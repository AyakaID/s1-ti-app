"use client";

import { useEffect, useRef, ReactNode } from "react";
import { animate, set, stagger } from "animejs";

interface StaggerContainerProps {
  children: ReactNode;
  selector?: string;
  delayStep?: number;
  duration?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  selector = ".stagger-item",
  delayStep = 70,
  duration = 800,
  className = "",
}: StaggerContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(selector);
    if (!items || items.length === 0) return;

    // Set initial hidden opacity to avoid layout pop
    set(items, {
      opacity: 0,
      translateY: 24,
      scale: 0.96,
    });

    const anim = animate(items, {
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.96, 1],
      delay: stagger(delayStep, { start: 100 }),
      duration,
      ease: "outCubic",
    });

    return () => {
      if (anim && typeof anim.pause === "function") anim.pause();
    };
  }, [selector, delayStep, duration]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
