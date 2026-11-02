"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Janey with her speech bubbles appearing one after another, as she
 * introduces the learning path. The bubbles are separate images laid over
 * the illustration at the places they were drawn, so each can pop in on its
 * own; the bottom bubble is part of the base picture and arrives with her.
 * Plays when the section scrolls into view, and again on hover.
 */

const BUBBLES = [
  { src: "/images/janey-bubble-top-4.png", left: 24.15, top: 1.65, width: 54.26, origin: "28% 100%", delay: 250 },
  { src: "/images/janey-bubble-left-4.png", left: 2.66, top: 23.27, width: 28.51, origin: "95% 85%", delay: 1000 },
  { src: "/images/janey-bubble-right-4.png", left: 70.32, top: 23.27, width: 29.57, origin: "5% 85%", delay: 1750 },
];

export default function JaneyPath({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun((n) => n || 1); obs.disconnect(); } }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`zl-janey relative ${run ? "zl-janey-on" : ""} ${className}`}
      onMouseEnter={() => setRun((n) => n + 1)}
      role="img"
      aria-label="Janey: Hey, here's your learning path! Learn skills through interactive lessons. Practice those skills in everyday situations. Learn the skills, then put them into practice!"
    >
      <img src="/images/janey-base-4.png" alt="" className="zl-janey-base block w-full h-auto" />
      {BUBBLES.map((b) => (
        <img
          key={`${b.src}-${run}`}
          src={b.src}
          alt=""
          className="zl-bubble absolute h-auto"
          style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, transformOrigin: b.origin, animationDelay: `${b.delay}ms` }}
        />
      ))}
    </div>
  );
}
