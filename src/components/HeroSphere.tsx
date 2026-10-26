"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's right-hand piece: the feelings and skills the course covers,
 * spread over a slowly turning sphere, with the Zenomi mark at its centre.
 *
 * Positions are computed on the client only. Math.sin and Math.cos can differ
 * in the last bits between the server runtime and the browser, which would trip
 * a hydration mismatch, so the words render hidden and are placed after mount.
 * Each frame writes transforms straight to the DOM rather than through state.
 */

const WORDS = [
  "Calm", "Joy", "Worry", "Focus", "Empathy", "Sleep", "Courage", "Hope",
  "Stress", "Resilience", "Kindness", "Confidence", "Sadness", "Gratitude",
  "Self-awareness", "Balance", "Belonging", "Breathe",
];
// A few words carry the brand pink so the sphere is not one flat colour.
const ACCENT = new Set(["Calm", "Empathy", "Resilience", "Hope", "Breathe", "Self-awareness"]);

const R = 108; // sphere radius, px
const SPEED = 0.0016; // radians per frame at 60fps, roughly one turn a minute
const TILT = -0.32; // fixed lean so the poles show
const CLEAR = 36; // px around the centre where no word is shown
const FADE = 24; // px over which a word fades as it nears that space

const W = 300, H = 260; // stage size, px
const MERIDIANS = 4; // longitude lines
const PARALLELS = [-0.5, 0, 0.5]; // latitude lines, as sin(latitude)
const SEG = 48; // segments per line

export default function HeroSphere() {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const n = WORDS.length;
    // Fibonacci lattice: an even spread of n points over the sphere.
    const pts = WORDS.map((_, i) => {
      const y = 1 - (2 * (i + 0.5)) / n;
      const r = Math.sqrt(1 - y * y);
      const th = Math.PI * (3 - Math.sqrt(5)) * i;
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r };
    });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);

    // The globe's wireframe, drawn on a canvas behind the words.
    const cv = canvas.current;
    const ctx = cv?.getContext("2d") ?? null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (cv) { cv.width = W * dpr; cv.height = H * dpr; }
    const lines: { x: number; y: number; z: number }[][] = [];
    for (let m = 0; m < MERIDIANS; m++) {
      const lon = (Math.PI * m) / MERIDIANS;
      lines.push(Array.from({ length: SEG + 1 }, (_, k) => {
        const t = (2 * Math.PI * k) / SEG;
        return { x: Math.cos(lon) * Math.sin(t), y: Math.cos(t), z: Math.sin(lon) * Math.sin(t) };
      }));
    }
    for (const y of PARALLELS) {
      const r = Math.sqrt(1 - y * y);
      lines.push(Array.from({ length: SEG + 1 }, (_, k) => {
        const t = (2 * Math.PI * k) / SEG;
        return { x: Math.cos(t) * r, y, z: Math.sin(t) * r };
      }));
    }

    let a = 0;
    let raf = 0;
    let last = performance.now();

    const project = (p: { x: number; y: number; z: number }, ca: number, sa: number) => {
      const x1 = p.x * ca + p.z * sa;
      const z1 = -p.x * sa + p.z * ca;
      return { x: x1, y: p.y * cosT - z1 * sinT, z: p.y * sinT + z1 * cosT };
    };

    const drawLines = (ca: number, sa: number) => {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (const line of lines) {
        let prev = project(line[0], ca, sa);
        for (let k = 1; k < line.length; k++) {
          const cur = project(line[k], ca, sa);
          // fainter as the segment turns away
          const depth = ((prev.z + cur.z) / 2 + 1) / 2;
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.03 + depth * 0.14).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(W / 2 + prev.x * R, H / 2 + prev.y * R);
          ctx.lineTo(W / 2 + cur.x * R, H / 2 + cur.y * R);
          ctx.stroke();
          prev = cur;
        }
      }
    };

    const draw = () => {
      const ca = Math.cos(a), sa = Math.sin(a);
      drawLines(ca, sa);
      pts.forEach((p, i) => {
        const el = refs.current[i];
        if (!el) return;
        // spin about y, then lean about x
        const x1 = p.x * ca + p.z * sa;
        const z1 = -p.x * sa + p.z * ca;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;
        const depth = (z2 + 1) / 2; // 0 back, 1 front
        const s = 0.6 + depth * 0.6;
        el.style.transform = `translate(-50%, -50%) translate3d(${(x1 * R).toFixed(1)}px, ${(y2 * R).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
        // Only the side facing the reader is sharp; the rest recedes.
        let o = depth > 0.6 ? 0.55 + (depth - 0.6) * 1.125 : 0.12 + depth * 0.5;
        // Keep the logo clear: a word fades out as it nears the centre ball
        // and fades back in as it moves away. Measured on the word's box, so a
        // long word passing beside the ball counts too.
        const half = el.offsetWidth * s / 2;
        const dx = Math.max(0, Math.abs(x1 * R) - half);
        const dy = Math.abs(y2 * R);
        const near = Math.hypot(dx, dy);
        o *= Math.min(1, Math.max(0, (near - CLEAR) / FADE));
        el.style.opacity = o.toFixed(2);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth > 0.6 ? "none" : `blur(${((0.6 - depth) * 5).toFixed(1)}px)`;
      });
    };

    const tick = (now: number) => {
      // Scale by elapsed time so a slow frame does not slow the spin.
      a += SPEED * ((now - last) / 16.67);
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    };

    draw();
    if (!reduced) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative select-none" style={{ width: W, height: H }} aria-hidden>
      {/* globe lines */}
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />

      {/* centre ball: above every word, so text never covers the logo */}
      <span className="zl-core-glow absolute inset-0 z-[200] m-auto h-[84px] w-[84px] rounded-full" />
      <span className="zl-core absolute inset-0 z-[201] m-auto grid h-[50px] w-[50px] place-items-center rounded-full">
        <img src="/images/zenomi-mark.png" alt="" className="h-[16px] w-auto brightness-0 invert" />
      </span>

      {WORDS.map((w, i) => (
        <span
          key={w}
          ref={(el) => { refs.current[i] = el; }}
          className={`absolute left-1/2 top-1/2 whitespace-nowrap text-[13px] font-semibold opacity-0 ${ACCENT.has(w) ? "text-[#FFC2DD]" : "text-white"}`}
          style={{ willChange: "transform, opacity" }}
        >
          {w}
        </span>
      ))}
    </div>
  );
}
