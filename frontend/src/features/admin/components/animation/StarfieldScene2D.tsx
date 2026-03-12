import { useEffect, useRef } from "react";
import { initStarfield2D } from "../../3d/starfield2d";

interface StarfieldScene2DProps {
  engagementScore?: number;
  isDimmed?: boolean;
}

export default function StarfieldScene2D({
  engagementScore = 0.6,
  isDimmed = false,
}: StarfieldScene2DProps): React.JSX.Element | null {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* =========================
       SHARED STATE REFS
       (NO RE-RENDERS)
    ========================= */
  const energyRef = useRef<number>(engagementScore);
  const dimRef = useRef<boolean>(isDimmed);

  useEffect(() => {
    energyRef.current = engagementScore;
  }, [engagementScore]);

  useEffect(() => {
    dimRef.current = isDimmed;
  }, [isDimmed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanup: (() => void) | undefined;

    /* =========================
           CANVAS SIZE HANDLING
           (FULL SCREEN FIXED)
        ========================= */
    const updateCanvasSize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const DPR = window.devicePixelRatio || 1;

      if (
        canvas.width !== Math.floor(width * DPR) ||
        canvas.height !== Math.floor(height * DPR)
      ) {
        canvas.width = Math.floor(width * DPR);
        canvas.height = Math.floor(height * DPR);

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(DPR, DPR);
        }
      }
    };

    updateCanvasSize();

    /* =========================
           INIT STARFIELD
        ========================= */
    cleanup = initStarfield2D(
      canvas,
      () => energyRef.current,
      () => dimRef.current,
    );

    window.addEventListener("resize", updateCanvasSize);

    /* =========================
           CLEANUP
        ========================= */
    return () => {
      cleanup?.();
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
