import React from 'react';
import { AWS_BUCKET, IMAGE_BASE_URL } from '../utils/constants';
import FALLBACK_PLACEHOLDER from '../assets/fallback_placeholder.png';

const FALLBACK_IMAGE_2 = FALLBACK_PLACEHOLDER;

/**
 * Helper to check if a string is a direct URL (External, Data, Local, Blob)
 */
const isDirectUrl = (url: string) => {
  if (!url) return false;
  const trimmed = url.trim();
  // We exclude strings starting with '/' if they don't look like local assets,
  // because many S3 keys start with a slash.
  return (
    trimmed.startsWith('http') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('/src/assets/')
  );
};

/**
 * Resolves an image key or URL into a final usable source.
 */
export function getResolvedImageUrl({
  imgKey,
  width,
  height,
  fallbackImage,
  contain
}: {
  imgKey: string;
  width?: number;
  height?: number;
  fallbackImage?: string;
  contain?: boolean;
}): string {
  const trimmedKey = imgKey?.trim() || "";
  if (!trimmedKey) return fallbackImage || FALLBACK_IMAGE_2;

  if (isDirectUrl(trimmedKey)) return trimmedKey;

  const s3Base = (IMAGE_BASE_URL || "").replace(/\/+$/, '');
  if (!s3Base) return fallbackImage || FALLBACK_IMAGE_2;

  // 
  try {
    const imageRequestObject = {
      bucket: AWS_BUCKET,
      key: imgKey,
      edits: {
        resize: {
          width,
          height,
          fit: contain ? "contain" : "cover",
        },
      },
    };
    return `${s3Base}/${btoa(JSON.stringify(imageRequestObject))}`;
  } catch (e) {
    // Fallback in case of JSON stringify or btoa error
    return fallbackImage || FALLBACK_IMAGE_2;
  }
}

const SmartImage = React.forwardRef<HTMLImageElement, {
  imgKey: string;
  width?: number;
  height?: number;
  contain?: boolean;
  className?: string;
  requestWidth?: number;
  requestHeight?: number;
  fallbackImage?: string;
  onClick?: () => void;
  alt?: string;
  loading?: "lazy" | "eager";
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  fallback?: React.ReactNode;
  fallbackSrc?: string;
}>(({
  imgKey,
  width,
  height,
  contain,
  className,
  requestWidth,
  requestHeight,
  onClick,
  alt = "Smart Image",
  loading,
  onLoad,
  fallback,
  fallbackSrc
}, ref) => {
  const finalWidth = width ?? requestWidth;
  const finalHeight = height ?? requestHeight;

  // retryStage: 0: Optimized, 1: Raw S3, 2: Macbease Fallback, 3: Global Fallback, 4: Custom Fallback
  const [retryStage, setRetryStage] = React.useState(0);

  const isFailed = retryStage >= (fallbackSrc ? 4 : (fallback ? 4 : 3));
  console.log(imgKey);

  const resolvedSrc = React.useMemo(() => {
    const trimmedKey = imgKey?.trim() || "";
    const effectiveFallback = fallbackSrc || FALLBACK_IMAGE_2;

    if (!trimmedKey) return effectiveFallback;

    const s3Base = (IMAGE_BASE_URL || "").replace(/\/+$/, '');

    // 1. If it's an absolute external URL, or data/blob, use it directly (only at stage 0)
    if (isDirectUrl(trimmedKey)) {
      if (retryStage === 0) return trimmedKey;
      return retryStage === 1 ? effectiveFallback : (fallbackSrc || FALLBACK_IMAGE_2);
    }

    const cleanKey = trimmedKey.replace(/^\/+/, '');

    // Safety check: btoa() fails on very long strings or non-latin characters.
    const isPotentiallyHuge = cleanKey.length > 3000;

    // 2. Optimized S3 (Stage 0)
    if (retryStage === 0 && s3Base && (finalWidth || finalHeight) && !isPotentiallyHuge) {
      try {
        const imageRequest = {
          bucket: AWS_BUCKET,
          key: cleanKey,
          edits: {
            resize: {
              width: finalWidth ? Math.round(finalWidth) : undefined,
              height: finalHeight ? Math.round(finalHeight) : undefined,
              fit: contain ? 'contain' : 'cover',
            },
            jpeg: { quality: 80 }
          },
        };
        // Use a robust btoa that handles unicode (important for S3 keys)
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(imageRequest))));
        return `${s3Base}/${encoded}`;
      } catch (e) {
        console.warn("SmartImage: Optimization encoding failed", e);
      }
    }

    // 3. Raw S3 (Stage 0 only - if optimized skipped or not applicable)
    // We skip Stage 1 (Raw S3 retry) to ensure faster fallback to placeholders if the main S3/CDN is failing.
    if (retryStage === 0 && s3Base) {
      const encodedKey = cleanKey.split('/').map(segment => encodeURIComponent(segment)).join('/');
      return `${s3Base}/${encodedKey}`;
    }

    // 4. Fallbacks (Stage 2+)
    if (retryStage === 2) return effectiveFallback;
    if (retryStage === 3) return FALLBACK_IMAGE_2;
    return FALLBACK_IMAGE_2;
  }, [imgKey, finalWidth, finalHeight, contain, retryStage, fallbackSrc]);

  React.useEffect(() => {
    setRetryStage(0);
  }, [imgKey]);

  if (isFailed && fallback) {
    return <div className={className}>{fallback}</div>;
  }
  return (
    <img
      ref={ref}
      src={resolvedSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      loading={loading || "lazy"}
      decoding="async"
      onLoad={onLoad}
      onError={() => {
        const maxStage = (fallbackSrc || fallback) ? 4 : 3;
        if (retryStage < maxStage) {
          setRetryStage(prev => prev + 1);
        }
      }}
    />
  );
});

export default React.memo(SmartImage, (prev, next) => {
  return (
    prev.imgKey === next.imgKey &&
    prev.width === next.width &&
    prev.height === next.height &&
    prev.contain === next.contain &&
    prev.className === next.className &&
    prev.requestWidth === next.requestWidth &&
    prev.requestHeight === next.requestHeight &&
    prev.alt === next.alt &&
    prev.fallbackSrc === next.fallbackSrc &&
    prev.loading === next.loading
    // We ignore onClick and onLoad changes to prevent re-renders when parent creates new functions
  );
});