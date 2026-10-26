"use client";
import Link from "next/link";
import { useState } from "react";
import { categories, sessions, stories, type Category, type Scenario } from "@/data/scenarios";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6.5 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L8 4.64A1 1 0 0 0 6.5 5.5z" />
    </svg>
  );
}

function HeadphonesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" />
    </svg>
  );
}

/** One story: a video to watch and a mindfulness session to try, shown as two boxes. */
function StoryCard({ s }: { s: Scenario }) {
  const v = s.video!;
  const session = sessions[s.session];
  return (
    <Link href={`/interactive/${v.slug}`} className="zl-story group flex h-full flex-col rounded-2xl bg-white border border-[#84306C]/10 overflow-hidden">
      <span className="relative block aspect-video overflow-hidden bg-[#EFE6F2]">
        <img src={v.poster} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <span className="absolute inset-0 bg-gradient-to-t from-[#2A0F24]/50 via-transparent to-transparent" />
        <span className="zl-play absolute left-4 bottom-4 grid place-items-center w-11 h-11 rounded-full bg-white text-[#84306C] shadow-lg">
          <PlayIcon className="w-4 h-4" />
        </span>
      </span>
      <span className="flex flex-1 flex-col p-4">
        <span className="block text-[16px] font-semibold leading-snug text-[#2A0F24] group-hover:text-[#84306C] transition-colors line-clamp-1">{v.title}</span>
        <span className="mt-1 block min-h-[2.5em] text-[13px] leading-[1.25em] text-[#5B4560] line-clamp-2">{s.text}</span>
        <span className="mt-auto pt-4 grid gap-2">
          <span className="flex h-12 items-center gap-3 rounded-xl bg-[#FCEBF2] px-3">
            <span className="grid place-items-center w-8 h-8 shrink-0 rounded-lg bg-[#B40C48] text-white"><PlayIcon className="w-3.5 h-3.5" /></span>
            <span className="flex-1 text-[13px] font-semibold text-[#2A0F24]">Watch the story</span>
            <span className="text-[12px] tabular-nums text-[#5B4560]">{clock(v.seconds)}</span>
          </span>
          <span className="flex h-12 items-center gap-3 rounded-xl bg-[#EFE8FA] px-3">
            <span className="grid place-items-center w-8 h-8 shrink-0 rounded-lg bg-[#5A3CBE] text-white"><HeadphonesIcon className="w-4 h-4" /></span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#2A0F24]">{session.title}</span>
            <span className="text-[12px] tabular-nums text-[#5B4560]">{Math.round(session.seconds / 60)} min</span>
          </span>
        </span>
      </span>
    </Link>
  );
}

export default function InteractiveLearning() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const shown = filter === "all" ? stories : stories.filter((s) => s.category === filter);
  const tabs = [{ id: "all" as const, label: "All" }, ...categories.filter((c) => stories.some((s) => s.category === c.id))];

  return (
    <div className="zl-panel">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[30px] sm:text-[38px] font-light tracking-[-0.015em] text-white">Interactive <span className="font-[family-name:var(--font-fraunces)] italic font-medium text-[#FFC2DD]">learning</span></h2>
          <p className="mt-1.5 text-[15px] sm:text-[16px] text-white/75">Watch a short story, then try the mindfulness session that goes with it.</p>
        </div>
        <div className="inline-flex gap-1 rounded-xl bg-white/12 p-1">
          {tabs.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`rounded-lg px-3 sm:px-4 py-1.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${filter === c.id ? "bg-white text-[#84306C] shadow-[0_1px_3px_rgba(42,15,36,0.12)]" : "text-white/80 hover:text-white"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {shown.map((s) => <StoryCard key={s.n} s={s} />)}
      </div>
    </div>
  );
}
