import React, { useEffect, useRef } from "react";
import { initAstronautScene } from "../../3d/astronaut3d";
import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";
import astronautAnimation from "../../../../assets/Astronaut_Illustration.json";

interface AstronautScene3DProps {
  engagementScore?: number;
}

const AstronautScene3D: React.FC<AstronautScene3DProps> = ({
  engagementScore = 0.6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lottieRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const frameRef = useRef<number | null>(null);

  /* =========================
     ENERGY REF (FOR STARS)
  ========================= */
  const energyRef = useRef<number>(engagementScore);

  useEffect(() => {
    energyRef.current = engagementScore;
  }, [engagementScore]);

  useEffect(() => {
    if (!canvasRef.current) return;

    /* =========================
       INIT THREE.JS STARS
    ========================= */
    const cleanup3D = initAstronautScene(
      canvasRef.current,
      () => energyRef.current
    );

    /* =========================
       INIT LOTTIE
    ========================= */
    if (lottieRef.current) {
      animationRef.current = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: astronautAnimation,
      });
    }

    /* =========================
       SPEED BASED ON METRIC
    ========================= */
    const speed = 0.4 + engagementScore * 0.8;
    animationRef.current?.setSpeed(speed);

    /* =========================
       FLOAT + PARALLAX
    ========================= */
    const animate = (time: number) => {
      const t = time * 0.001;

      const floatY = Math.sin(t) * 14;
      const floatX = Math.sin(t * 0.6) * 10;

      const scrollOffset = window.scrollY * 0.12;
      const glow = 35 + Math.sin(t * 1.5) * 15;

      if (lottieRef.current) {
        lottieRef.current.style.transform = `
          translate(-50%, -50%)
          translate(${floatX}px, ${floatY - scrollOffset}px)
        `;

        lottieRef.current.style.filter = `
          drop-shadow(0 0 ${glow}px rgba(110,231,255,0.35))
        `;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    /* =========================
       CLEANUP
    ========================= */
    return () => {
      cleanup3D();
      animationRef.current?.destroy();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [engagementScore]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden ">
      {/* ⭐ Three.js Star Background */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* 🧑‍🚀 Lottie Astronaut */}
      <div
        ref={lottieRef}
        className="absolute top-1/2 right-[7%] sm:right-[30%] lg:right-[55%] w-[175px] h-[175px] md:w-[250px] md:h-[250px] z-10 pointer-events-none"
      />
    </div>
  );
};

export default AstronautScene3D;