"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * A playable guided session, built to match the mindfulness player in the app:
 * the layered breathing orb from MindBreathingOrb, a phase label in the core,
 * orbiting dots, and a transport underneath.
 *
 * The practice is the double breath, also called a physiological sigh. One
 * round is a breath in, a second short sip on top, then a long breath out that
 * runs longer than both breaths in put together.
 */

type Cue = { label: string; text: string; ms: number; from: number; to: number };

const ROUNDS = 3;

const ROUND: Cue[] = [
  { label: "Breathe in", text: "Through your nose. A normal breath, not a huge one.", ms: 3000, from: 0.86, to: 1.3 },
  { label: "Sip again", text: "A second short sip on top. Do not breathe out yet.", ms: 1000, from: 1.3, to: 1.5 },
  { label: "Let it go", text: "Long and slow, out through your mouth.", ms: 6000, from: 1.5, to: 0.86 },
  { label: "Rest", text: "Nothing to do here.", ms: 1200, from: 0.86, to: 0.86 },
];

const CUES: Cue[] = [
  { label: "Settle in", text: "Let your shoulders drop. You do not have to feel calm to start.", ms: 5000, from: 1, to: 1 },
  ...Array.from({ length: ROUNDS }).flatMap(() => ROUND),
  { label: "Done", text: "Notice where you are now compared with a minute ago.", ms: 5000, from: 1, to: 1 },
];

const TOTAL = CUES.reduce((n, c) => n + c.ms, 0);
/* Unit circle positions for the five orbit dots, written out rather than computed:
   Math.cos and Math.sin are implementation defined and can differ in the last bits
   between the server runtime and the browser, which trips a hydration mismatch. */
const ORBIT: [number, number][] = [
  [1, 0],
  [0.309017, 0.951057],
  [-0.809017, 0.587785],
  [-0.809017, -0.587785],
  [0.309017, -0.951057],
];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function clock(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Which cue is running at an elapsed time, and how far through that cue we are. */
function resolve(elapsed: number) {
  let acc = 0;
  for (let i = 0; i < CUES.length; i++) {
    if (elapsed < acc + CUES[i].ms) return { index: i, t: (elapsed - acc) / CUES[i].ms };
    acc += CUES[i].ms;
  }
  return { index: CUES.length - 1, t: 1 };
}

export default function SessionPlayer() {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [reduced, setReduced] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = now - last.current;
      last.current = now;
      setElapsed((e) => {
        const next = e + dt;
        if (next >= TOTAL) {
          setPlaying(false);
          return TOTAL;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  const { index, t } = useMemo(() => resolve(elapsed), [elapsed]);
  const cue = CUES[index];
  const finished = elapsed >= TOTAL;
  const started = elapsed > 0;
  const scale = reduced || !started ? 1 : cue.from + (cue.to - cue.from) * easeInOut(Math.min(1, Math.max(0, t)));
  const round = Math.min(ROUNDS, Math.max(1, Math.ceil(index / ROUND.length)));

  const toggle = useCallback(() => {
    if (finished) {
      setElapsed(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  }, [finished]);

  const restart = useCallback(() => {
    setElapsed(0);
    setPlaying(false);
  }, []);

  const pct = (elapsed / TOTAL) * 100;

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] px-5 py-10 sm:px-10 sm:py-14"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #3C2A66 0%, #241A3E 55%, #1A1326 100%)" }}
    >
      <div className="mx-auto flex max-w-md flex-col items-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
          {started && !finished ? `Round ${round} of ${ROUNDS}` : "Guided practice"}
        </p>

        {/* the orb, matching MindBreathingOrb in the app */}
        <div className="relative mt-8 flex h-[260px] w-[260px] items-center justify-center">
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              width: 200, height: 200, transform: `scale(${scale * 1.1})`,
              background: "rgba(149,117,205,0.25)",
              filter: "blur(2px)",
              animation: reduced ? undefined : "zenGlow 2s ease-in-out infinite alternate",
            }}
          />
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              width: 170, height: 170, transform: `scale(${scale})`,
              background: "rgba(179,157,219,0.35)",
              boxShadow: "0 0 30px 10px rgba(149,117,205,0.45)",
            }}
          />
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{ width: 148, height: 148, transform: `scale(${scale * 0.88})`, background: "rgba(149,117,205,0.5)" }}
          />
          {ORBIT.map(([cx, cy], i) => {
            const r = 100 * scale;
            return (
              <span
                key={i}
                aria-hidden
                className="absolute rounded-full bg-white/60"
                style={{ width: 4, height: 4, left: 128 + r * cx, top: 128 + r * cy }}
              />
            );
          })}
          <div
            className="relative z-10 flex h-[110px] w-[110px] items-center justify-center rounded-full text-center"
            style={{
              background: "radial-gradient(circle at 35% 30%, rgba(206,147,216,0.95), #9575CD)",
              boxShadow: "0 0 20px rgba(123,94,167,0.6)",
            }}
          >
            <span className="px-3 text-[15px] font-semibold tracking-wide text-white">
              {started ? cue.label : "Begin"}
            </span>
          </div>
        </div>

        <p className="mt-8 min-h-[3rem] max-w-xs text-center text-sm leading-relaxed text-white/70">
          {started ? cue.text : "Three rounds of the double breath. About forty five seconds. Sound off, nothing to read."}
        </p>

        {/* transport */}
        <div className="mt-8 w-full">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg,#CE93D8,#9575CD)" }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] font-medium tabular-nums text-white/45">
            <span>{clock(elapsed)}</span>
            <span>{clock(TOTAL)}</span>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-5">
          <button
            type="button"
            onClick={restart}
            aria-label="Start again"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : finished ? "Play again" : "Play"}
            className="flex h-16 w-16 items-center justify-center rounded-full text-[#2B1F4A] shadow-lg transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#241A3E]"
            style={{ background: "linear-gradient(135deg,#F2DCF7,#CE93D8)" }}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            )}
          </button>

          <div className="h-11 w-11" aria-hidden />
        </div>

        <p className="mt-7 text-center text-[11px] leading-relaxed text-white/40">
          A guided audio version of this practice is in the Zenomi app, under Breathing, called
          Physiological Sigh.
        </p>
      </div>

    </section>
  );
}
