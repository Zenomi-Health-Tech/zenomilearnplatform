"use client";

import { useEffect, useRef, useState } from "react";
import type { Session } from "@/data/scenarios";

/**
 * A mindfulness audio session in the style of the guided breathing player
 * (SessionPlayer): the layered orb, orbiting dots and a transport underneath.
 *
 * The orb is driven by the audio's own clock, not a timer, so it stays in step
 * after a seek, a pause or a throttled tab. It follows a slow, even breath of
 * five seconds in and five out, which suits every session in the library.
 */

const CYCLE = 10; // seconds per breath
const ORBIT: [number, number][] = [
  [1, 0],
  [0.309017, 0.951057],
  [-0.809017, 0.587785],
  [-0.809017, -0.587785],
  [0.309017, -0.951057],
];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clock = (s: number) => {
  s = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export default function OrbAudioPlayer({ session, onPlay, audioRef }: { session: Session; onPlay?: () => void; audioRef?: React.RefObject<HTMLAudioElement | null> }) {
  const own = useRef<HTMLAudioElement>(null);
  const ref = audioRef ?? own;
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [reduced, setReduced] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Read the audio clock every frame while playing so the orb moves smoothly;
  // timeupdate alone only fires about four times a second.
  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const a = ref.current;
      if (a) setTime(a.currentTime);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing, ref]);

  const total = session.seconds;
  const started = time > 0;
  const phase = (time % CYCLE) / CYCLE; // 0..1 across one breath
  const breathingIn = phase < 0.5;
  const t = breathingIn ? phase * 2 : (phase - 0.5) * 2;
  const scale = reduced || !started ? 1 : breathingIn ? 0.86 + 0.5 * easeInOut(t) : 1.36 - 0.5 * easeInOut(t);
  const label = !started ? "Begin" : !playing ? "Paused" : breathingIn ? "Breathe in" : "Breathe out";

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) a.play(); else a.pause();
  };
  const seek = (s: number) => {
    const a = ref.current;
    if (!a) return;
    a.currentTime = Math.min(total, Math.max(0, s));
    setTime(a.currentTime);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] px-5 py-9 sm:px-10 sm:py-12"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #4B1E5E 0%, #2E1840 55%, #1C1226 100%)" }}
    >
      <div className="mx-auto flex max-w-md flex-col items-center">
        <p className="text-[12px] font-medium text-white/55">{session.kind}</p>
        <h3 className="mt-1 text-center text-[22px] font-semibold text-white">{session.title}</h3>

        <div className="relative mt-6 flex h-[240px] w-[240px] items-center justify-center">
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              width: 190, height: 190, transform: `scale(${scale * 1.1})`,
              background: "rgba(206,147,216,0.22)", filter: "blur(2px)",
              animation: reduced || !playing ? undefined : "zenGlow 2s ease-in-out infinite alternate",
            }}
          />
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{ width: 160, height: 160, transform: `scale(${scale})`, background: "rgba(206,147,216,0.3)", boxShadow: "0 0 30px 10px rgba(180,12,72,0.25)" }}
          />
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{ width: 138, height: 138, transform: `scale(${scale * 0.88})`, background: "rgba(132,48,108,0.55)" }}
          />
          {ORBIT.map(([cx, cy], i) => {
            const r = 94 * scale;
            return <span key={i} aria-hidden className="absolute rounded-full bg-white/60" style={{ width: 4, height: 4, left: 118 + r * cx, top: 118 + r * cy }} />;
          })}
          <div
            className="relative z-10 flex h-[104px] w-[104px] items-center justify-center rounded-full text-center"
            style={{ background: "radial-gradient(circle at 35% 30%, rgba(245,163,199,0.95), #84306C)", boxShadow: "0 0 20px rgba(132,48,108,0.6)" }}
          >
            <span className="px-3 text-[14px] font-semibold tracking-wide text-white">{label}</span>
          </div>
        </div>

        <p className="mt-6 max-w-xs text-center text-sm leading-relaxed text-white/70">{session.about}</p>

        <div className="mt-7 w-full">
          <input
            type="range"
            min={0}
            max={total}
            step={1}
            value={Math.min(time, total)}
            onChange={(e) => seek(Number(e.target.value))}
            className="zl-range zl-range-dark w-full"
            style={{ ["--p" as string]: `${(time / total) * 100}%` }}
            aria-label="Seek"
          />
          <div className="mt-2 flex justify-between text-[11px] font-medium tabular-nums text-white/50">
            <span>{clock(time)}</span>
            <span>{clock(total)}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <button type="button" onClick={() => seek(time - 15)} aria-label="Back 15 seconds" className="flex h-11 w-11 items-center justify-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-16 w-16 items-center justify-center rounded-full text-[#4B1336] shadow-lg transition hover:scale-105"
            style={{ background: "#F5A3C7" }}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor"><path d="M6.5 5.5v13l11-6.5z" /></svg>
            )}
          </button>
          <button type="button" onClick={() => seek(time + 15)} aria-label="Forward 15 seconds" className="flex h-11 w-11 items-center justify-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>
          </button>
        </div>
      </div>

      <audio
        ref={ref}
        src={session.src}
        preload="metadata"
        onPlay={() => { setPlaying(true); onPlay?.(); }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => { if (!playing) setTime(e.currentTarget.currentTime); }}
      />
    </section>
  );
}
