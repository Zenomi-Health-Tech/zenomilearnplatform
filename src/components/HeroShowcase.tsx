"use client";

import { useEffect, useState } from "react";
import { sessions, stories } from "@/data/scenarios";

/**
 * The hero's one moving piece: a card that steps between a lesson and a story,
 * so the top of the page previews both tabs. Each card fades up into place;
 * nothing else in the hero moves.
 */

type Item =
  | { kind: "lesson"; href: string; num: number; title: string; blurb: string; color: string }
  | { kind: "story"; href: string; title: string; poster: string; video: string; audio: string };

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const story = (slug: string): Item => {
  const s = stories.find((x) => x.video!.slug === slug)!;
  const a = sessions[s.session];
  return { kind: "story", href: `/interactive/${slug}`, title: s.video!.title, poster: s.video!.poster, video: clock(s.video!.seconds), audio: a.title };
};

// Three lessons from the start, middle and end of the course, each followed by
// a story, one of them set at home.
const ITEMS: Item[] = [
  { kind: "lesson", href: "/courses/week/1", num: 1, title: "Sleep Smarter: Real-World Strategies for Teen Nights", blurb: "Evidence-based strategies to improve sleep quality and build healthy nighttime routines.", color: "#B40C48" },
  story("mind-goes-blank"),
  { kind: "lesson", href: "/courses/week/4", num: 3, title: "What Are Emotions?", blurb: "Five bite-sized micro lessons on recognizing, naming and understanding emotions.", color: "#93226A" },
  story("finding-my-place"),
  { kind: "lesson", href: "/courses/week/8", num: 7, title: "Resiliency for Teens", blurb: "Reframe negative thoughts, build positive relationships and create your Resiliency Toolkit.", color: "#5A3CBE" },
  story("one-more-message"),
]

const STEP_MS = 4500;

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6.5 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L8 4.64A1 1 0 0 0 6.5 5.5z" />
    </svg>
  );
}

function Card({ item }: { item: Item }) {
  // Both card kinds fill the same fixed frame, so the swap never jumps.
  if (item.kind === "lesson") {
    return (
      <span className="flex h-full flex-col p-5">
        <span className="text-[12px] font-semibold text-[#84306C]">Lesson</span>
        <span className="mt-3 flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-white" style={{ background: item.color }}>
            <span className="text-center leading-none">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.15em]">Week</span>
              <span className="mt-0.5 block text-[22px] font-bold">{item.num}</span>
            </span>
          </span>
          <span className="min-w-0">
            <span className="block text-[16px] font-semibold leading-snug text-[#2A0F24]">{item.title}</span>
            <span className="mt-1.5 block text-[13px] leading-relaxed text-[#5B4560] line-clamp-3">{item.blurb}</span>
          </span>
        </span>
        <span className="mt-auto inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: item.color }}>Start →</span>
      </span>
    );
  }
  return (
    <span className="flex h-full flex-col">
      <span className="relative block h-[132px] shrink-0 overflow-hidden">
        <img src={item.poster} alt="" className="h-full w-full object-cover object-[50%_30%]" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#84306C]">Interactive story</span>
      </span>
      <span className="block p-4">
        <span className="block text-[16px] font-semibold text-[#2A0F24]">{item.title}</span>
        <span className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
          <span className="flex items-center gap-2 rounded-lg bg-[#FCEBF2] px-2.5 py-2 font-semibold text-[#2A0F24]">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[#B40C48] text-white"><PlayIcon className="h-3 w-3" /></span>
            Video · {item.video}
          </span>
          <span className="flex min-w-0 items-center gap-2 rounded-lg bg-[#EFE8FA] px-2.5 py-2 font-semibold text-[#2A0F24]">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#5A3CBE] text-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" /></svg>
            </span>
            <span className="truncate">{item.audio}</span>
          </span>
        </span>
      </span>
    </span>
  );
}

export default function HeroShowcase() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % ITEMS.length), STEP_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-[360px]">
      <div className="relative h-[244px]">
        {/* two resting cards behind, for depth */}
        <span aria-hidden className="absolute inset-x-6 -bottom-3 top-3 rounded-2xl bg-white/15" />
        <span aria-hidden className="absolute inset-x-3 -bottom-1.5 top-1.5 rounded-2xl bg-white/25" />
        {ITEMS.map((item, n) => (
          <a
            key={n}
            href={item.href}
            tabIndex={n === i ? 0 : -1}
            aria-hidden={n !== i}
            className={`zl-show absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-24px_rgba(20,0,30,0.7)] ${n === i ? "zl-show-on" : ""}`}
          >
            <Card item={item} />
          </a>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {ITEMS.map((item, n) => (
          <button
            key={n}
            onClick={() => setI(n)}
            aria-label={`Show ${item.kind} ${n + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${n === i ? "w-6 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}
