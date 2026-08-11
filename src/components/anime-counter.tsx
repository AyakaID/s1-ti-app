"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

interface AnimeCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimeCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1200,
  className = "",
}: AnimeCounterProps) {
  const nodeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const obj = { count: 0 };

    const anim = animate(obj, {
      count: [0, value],
      modifier: (v: number) => Math.round(v),
      ease: "outExpo",
      duration,
      onUpdate: () => {
        if (node) {
          node.textContent = `${prefix}${Math.round(obj.count).toLocaleString()}${suffix}`;
        }
      },
    });

    return () => {
      if (anim && typeof anim.pause === "function") anim.pause();
    };
  }, [value, prefix, suffix, duration]);

  return <span ref={nodeRef} className={className}>{prefix}0{suffix}</span>;
}
