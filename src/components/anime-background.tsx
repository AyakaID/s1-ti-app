"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

interface PausableAnimation {
  pause?: () => void;
}

export function AnimeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animation: PausableAnimation | null = null;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    // Generate random particle dots
    const particleCount = Math.min(Math.floor(window.innerWidth / 25), 50);
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.6,
    }));

    // Animate particle pulse with Anime.js v4 animate
    const animObj = { progress: 0 };
    animation = animate(animObj, {
      progress: [0, 100],
      duration: 10000,
      ease: "linear",
      loop: true,
      onUpdate: () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
          p.x += p.speedX;
          p.y += p.speedY;

          // Bounce off boundaries
          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
          ctx.fill();

          // Connect close particles with subtle indigo lines
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 140)})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        });
      },
    });

    const resizeHandler = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      if (animation && typeof animation.pause === "function") animation.pause();
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
    />
  );
}
