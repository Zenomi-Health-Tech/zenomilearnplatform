"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/**
 * A stepped microlesson, in the shape of a SCORM week: one card at a time,
 * back and next, a progress strip, a check question, and a completion state
 * kept in localStorage the way ScormPlayer keeps week progress.
 */

const STORAGE_KEY = "lesson_progress_come_back_down";

type Card =
  | { kind: "read"; eyebrow: string; title: string; body: string; note?: string }
  | { kind: "steps"; eyebrow: string; title: string; steps: { title: string; body: string }[] }
  | { kind: "reasons"; eyebrow: string; title: string; reasons: { title: string; body: string }[] }
  | {
      kind: "check";
      eyebrow: string;
      title: string;
      options: { label: string; correct?: boolean; feedback: string }[];
    }
  | { kind: "done"; eyebrow: string; title: string; body: string };

const CARDS: Card[] = [
  {
    kind: "read",
    eyebrow: "Start here",
    title: "Stress gets to your body before it gets to your thinking",
    body:
      "It shows up in your chest, your jaw, your stomach and your breathing, and it is already there by the time you notice it. That is why being told to calm down has never once worked. Words are the slowest way to reach a body that is already running.",
    note: "You are not trying to feel nothing. You are trying to come down a notch, which is usually enough to choose what happens next.",
  },
  {
    kind: "steps",
    eyebrow: "The technique",
    title: "The double breath",
    steps: [
      { title: "Breathe in", body: "Through your nose. A normal breath, not a huge one." },
      { title: "Sip again", body: "A second short sip of air on top of the first, still through your nose, without breathing out." },
      { title: "Let it go", body: "A long slow breath out through your mouth. Longer than both breaths in put together." },
      { title: "Again", body: "Two or three times. Most people feel the drop after the first one." },
    ],
  },
  {
    kind: "reasons",
    eyebrow: "Why it works",
    title: "Why your body listens",
    reasons: [
      { title: "It reopens your lungs", body: "Breathe shallow for a while and tiny air sacs in your lungs collapse. The second sip pops them back open, so one breath moves more air than it did a minute ago." },
      { title: "It slows your heart", body: "A breath out longer than the breath in tells your heart rate to drop. Not willpower, just how your lungs and your heart are already wired together." },
      { title: "It beats thinking to it", body: "You do not have to talk yourself round first. The body settles, then thinking gets easier, which is the opposite order to the one people tell you." },
    ],
  },
  {
    kind: "check",
    eyebrow: "Quick check",
    title: "Which part of the double breath should last the longest?",
    options: [
      { label: "The first breath in", feedback: "Not quite. The first breath in is ordinary, and it is deliberately not a big one." },
      { label: "The second sip", feedback: "Not quite. The sip is the shortest part of all, just a small top up." },
      { label: "The breath out", correct: true, feedback: "That is it. The breath out runs longer than both breaths in put together, and that length is what brings your heart rate down." },
    ],
  },
  {
    kind: "read",
    eyebrow: "In real life",
    title: "Where it earns its keep",
    body:
      "In the corridor before a test, instead of reading your notes one more time. Mid argument, before you say the thing you will think about all night. Lying awake with a loud head. Before you open the app you already know will make it worse.",
    note: "Practising it calm is what makes it available later, when you are not.",
  },
  {
    kind: "done",
    eyebrow: "Finished",
    title: "That is the lesson",
    body:
      "You know what the double breath is, what it does to your body, and when to reach for it. The only thing left is to actually do one.",
  },
];

function useProgress() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    try {
      setDone(localStorage.getItem(STORAGE_KEY) === "completed");
    } catch {
      /* storage can be unavailable, the lesson still works */
    }
  }, []);
  const complete = useCallback(() => {
    setDone(true);
    try {
      localStorage.setItem(STORAGE_KEY, "completed");
    } catch {
      /* ignore */
    }
  }, []);
  return { done, complete };
}

export default function LessonDeck() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const { done, complete } = useProgress();
  const card = CARDS[i];
  const last = i === CARDS.length - 1;
  const blocked = card.kind === "check" && picked === null;

  const go = useCallback(
    (delta: number) => {
      setI((n) => {
        const next = Math.min(CARDS.length - 1, Math.max(0, n + delta));
        if (next !== n) setPicked(null);
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (last) complete();
  }, [last, complete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && !blocked && !last) go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, blocked, last]);

  return (
    <div>
      {/* progress strip, one segment per card */}
      <div className="flex gap-1.5" aria-hidden>
        {CARDS.map((_, n) => (
          <span
            key={n}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ background: n <= i ? "#704180" : "#E7E1EA" }}
          />
        ))}
      </div>
      <p className="mt-2 text-[11px] font-medium text-gray-400">
        Step {i + 1} of {CARDS.length}
        {done && i < CARDS.length - 1 ? " · completed" : ""}
      </p>

      <div className="mt-5 min-h-[23rem] rounded-3xl border border-gray-200 bg-white p-6 sm:p-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#704180]">
          {card.eyebrow}
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl leading-snug text-gray-900 sm:text-[1.75rem]">
          {card.title}
        </h2>

        {card.kind === "read" && (
          <>
            <p className="mt-4 leading-relaxed text-gray-600">{card.body}</p>
            {card.note && (
              <p className="mt-5 rounded-2xl bg-[#F6F2F8] px-5 py-4 text-sm leading-relaxed text-[#4A3A57]">
                {card.note}
              </p>
            )}
          </>
        )}

        {card.kind === "steps" && (
          <ol className="mt-5 space-y-4">
            {card.steps.map((s, n) => (
              <li key={s.title} className="flex gap-4">
                <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#704180] font-[family-name:var(--font-playfair)] text-sm font-bold text-white">
                  {n + 1}
                </span>
                <span>
                  <span className="block font-semibold text-gray-900">{s.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-gray-600">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
        )}

        {card.kind === "reasons" && (
          <div className="mt-5 space-y-3">
            {card.reasons.map((r) => (
              <div key={r.title} className="rounded-2xl border border-gray-200 px-5 py-4">
                <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{r.body}</p>
              </div>
            ))}
          </div>
        )}

        {card.kind === "check" && (
          <div className="mt-5 space-y-3">
            {card.options.map((o, n) => {
              const chosen = picked === n;
              return (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setPicked(n)}
                  aria-pressed={chosen}
                  className="block w-full rounded-2xl border px-5 py-4 text-left transition"
                  style={{
                    borderColor: chosen ? (o.correct ? "#1F7A4D" : "#B48CFF") : "#E5E7EB",
                    background: chosen ? (o.correct ? "#F1F9F4" : "#F8F5FD") : "#fff",
                  }}
                >
                  <span className="text-sm font-medium text-gray-900">{o.label}</span>
                  {chosen && (
                    <span
                      className="mt-2 block text-sm leading-relaxed"
                      style={{ color: o.correct ? "#1F7A4D" : "#5A3CBE" }}
                    >
                      {o.feedback}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {card.kind === "done" && (
          <>
            <p className="mt-4 leading-relaxed text-gray-600">{card.body}</p>
            <Link
              href="/mindfulness/double-breath"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#704180] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Play the guided session
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </Link>
          </>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={i === 0}
          className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        {!last && (
          <button
            type="button"
            onClick={() => go(1)}
            disabled={blocked}
            className="rounded-full bg-[#704180] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {blocked ? "Pick an answer" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
