"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";

const weeks = [
  {
    week: 1, title: "Sleep Hygiene & Nutrition", color: "bg-[#704180]", colorHex: "#704180",
    bullets: [
      "Build a foundation for emotional well-being through better sleep and mindful nutrition.",
      "Learn practical habits for restful nights and fueling your body and mind.",
    ],
  },
  {
    week: 2, title: "What Are Emotions?", color: "bg-[#3d8b8b]", colorHex: "#3d8b8b",
    bullets: [
      "Understand the basics of emotions through five bite-sized micro lessons.",
      "Learn to recognize, name, and understand what emotions really are and why we have them.",
    ],
  },
  {
    week: 3, title: "What is Empathy?", color: "bg-[#4a9e6e]", colorHex: "#4a9e6e",
    bullets: [
      "Discover the power of empathy—understanding and sharing the feelings of others.",
      "Practice perspective-taking and learn how empathy strengthens relationships.",
    ],
  },
  {
    week: 4, title: "Self-Awareness", color: "bg-[#4a9e6e]", colorHex: "#4a9e6e",
    bullets: [
      "Develop a deeper understanding of yourself—your thoughts, feelings, and behaviors.",
      "Learn to recognize patterns and understand your unique emotional landscape.",
    ],
  },
  {
    week: 5, title: "Self-Regulation", color: "bg-[#c46b7c]", colorHex: "#c46b7c",
    bullets: [
      "Master techniques to manage your emotions and impulses effectively.",
      "Build a toolkit of strategies to calm down, think clearly, and respond thoughtfully.",
    ],
  },
  {
    week: 6, title: "Building Resilience", color: "bg-[#c4873a]", colorHex: "#c4873a",
    bullets: [
      "Strengthen your ability to bounce back from challenges.",
      "Create a personal plan for handling stress, setbacks, and growing stronger through adversity.",
    ],
  },
];

interface WeekProgress {
  status: string;
  location: string;
  percentage: number;
  totalTime: string;
}

function parseProgress(weekId: number): WeekProgress | null {
  try {
    const saved = localStorage.getItem(`scorm_progress_week_${weekId}`);
    if (!saved) return null;
    const d = JSON.parse(saved);
    const status = d["cmi.core.lesson_status"] || "not attempted";
    if (status === "not attempted") return null;
    const location = d["cmi.core.lesson_location"] || "";
    const suspendData = d["cmi.suspend_data"] || "";
    const totalTime = d["cmi.core.total_time"] || "0000:00:00.00";

    // Try to extract progress percentage from suspend_data
    let percentage = 0;
    if (status === "completed" || status === "passed") {
      percentage = 100;
    } else if (suspendData) {
      try {
        // Articulate Rise stores progress in suspend_data
        const sd = JSON.parse(suspendData);
        if (sd.progress !== undefined) percentage = Math.round(sd.progress * 100);
        else if (sd.v !== undefined) percentage = Math.round((sd.v / 100) * 100);
      } catch {
        // If not JSON, estimate from location
        if (location) {
          const loc = parseInt(location);
          if (!isNaN(loc)) percentage = Math.min(Math.round((loc / 20) * 100), 95);
        }
      }
      if (percentage === 0 && status === "incomplete") percentage = 10;
    } else if (status === "incomplete") {
      percentage = 10;
    }

    return { status, location, percentage, totalTime };
  } catch { return null; }
}

function formatTime(t: string): string {
  const m = t.match(/(\d+):(\d+):(\d+)/);
  if (!m) return "";
  const h = parseInt(m[1]), min = parseInt(m[2]);
  if (h > 0) return `${h}h ${min}m`;
  if (min > 0) return `${min}m`;
  return "<1m";
}

function useReveal(): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function WeekCard({ w, prog }: { w: (typeof weeks)[0]; prog: WeekProgress | null }) {
  const ref = useReveal();
  const isCompleted = prog?.status === "completed" || prog?.status === "passed";
  const isInProgress = prog?.status === "incomplete";
  const notStarted = !prog;

  const buttonLabel = isCompleted ? "Restart Course" : isInProgress ? "Resume Course" : "Start Course";
  const buttonStyle = isCompleted
    ? "bg-white text-[#2d8a5e] border border-[#2d8a5e]/30 hover:bg-[#2d8a5e]/5"
    : isInProgress
    ? "bg-white text-[#704180] border border-[#704180]/30 hover:bg-[#704180]/5"
    : `text-white hover:opacity-90`;

  const cleanLocation = (() => {
    if (!prog?.location) return "";
    // Articulate Rise uses hashes like "#/lessons/abc" — don't show raw data
    // Only show if it's a clean simple number (real page/slide number)
    if (/^\d+$/.test(prog.location)) return `Page ${prog.location}`;
    return "";
  })();

  return (
    <div ref={ref} className="reveal">
      <Link href={`/courses/week/${w.week}`} className="block">
        <div className="flex rounded-xl overflow-hidden border border-gray-200/80 card-hover relative bg-white">
          {/* Week sidebar */}
          <div className={`${w.color} text-white flex flex-col items-center justify-center w-[56px] sm:w-[64px] shrink-0`}>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase opacity-90">Week</span>
            <span className="text-[28px] sm:text-[34px] font-bold leading-none mt-0.5">{w.week}</span>
          </div>

          {/* Content */}
          <div className="px-5 py-4 sm:px-6 sm:py-5 flex-1 min-w-0">
            {/* Title + badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-[18px] sm:text-[21px] font-[family-name:var(--font-playfair)] text-gray-900 leading-snug">
                {w.title}
              </h3>
              {isCompleted && (
                <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-semibold text-[#2d8a5e] bg-[#2d8a5e]/8 border border-[#2d8a5e]/20 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2d8a5e]" />
                  Completed
                </span>
              )}
              {isInProgress && (
                <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-semibold text-[#704180] bg-[#704180]/8 border border-[#704180]/20 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#704180] animate-pulse" />
                  {prog.percentage}% Done
                </span>
              )}
            </div>

            {/* Bullets */}
            <ul className="space-y-2">
              {w.bullets.map((b, j) => (
                <li key={j} className="text-gray-600 text-[14px] sm:text-[15px] leading-[1.7] flex gap-2">
                  <span className="mt-[6px] shrink-0 w-[5px] h-[5px] rounded-full bg-gray-300" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Progress bar */}
            {isInProgress && (
              <div className="mt-4 h-[5px] bg-[#704180]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#704180] rounded-full transition-all duration-500" style={{ width: `${prog.percentage}%` }} />
              </div>
            )}
            {isCompleted && (
              <div className="mt-4 h-[5px] bg-[#2d8a5e]/15 rounded-full overflow-hidden">
                <div className="h-full bg-[#2d8a5e] rounded-full w-full" />
              </div>
            )}

            {/* Footer: info + button */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-[11px] sm:text-[12px] text-gray-400 flex-wrap">
                {isInProgress && cleanLocation && (
                  <span>📍 {cleanLocation}</span>
                )}
                {isInProgress && (
                  <span className="text-[#704180] font-medium">{100 - prog.percentage}% remaining</span>
                )}
                {prog && formatTime(prog.totalTime) && (
                  <span>⏱ {formatTime(prog.totalTime)} spent</span>
                )}
                {isCompleted && (
                  <span className="text-[#2d8a5e] font-medium">All lessons complete ✓</span>
                )}
              </div>

              <span
                className={`shrink-0 text-[12px] font-semibold px-4 py-2 rounded-lg transition-all ${buttonStyle}`}
                style={notStarted ? { backgroundColor: w.colorHex } : undefined}
              >
                {buttonLabel} →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Home() {
  const [progressMap, setProgressMap] = useState<Record<number, WeekProgress | null>>({});
  const headerRef = useReveal();

  useEffect(() => {
    const p: Record<number, WeekProgress | null> = {};
    for (let i = 1; i <= 6; i++) p[i] = parseProgress(i);
    setProgressMap(p);
  }, []);

  return (
    <div className="bg-[#f4f0f7]">
      {/* Header */}
      <section ref={headerRef} className="reveal header-glow pt-16 sm:pt-24 pb-12 sm:pb-16 text-center px-4">
        <p className="text-[11px] sm:text-[13px] font-semibold tracking-[0.25em] uppercase text-[#704180]">
          6-Week Course
        </p>
        <h1 className="mt-5 text-[32px] sm:text-[42px] md:text-[52px] lg:text-[58px] font-[family-name:var(--font-playfair)] font-normal text-gray-900 leading-[1.12]">
          Emotional Regulation<br className="hidden sm:block" /> for Teens
        </h1>
        <p className="mt-5 text-gray-500 text-[15px] sm:text-[17px] max-w-[520px] mx-auto leading-[1.7]">
          A guided journey to understanding, managing, and thriving with your emotions.
        </p>
      </section>

      {/* Cards with sticky side images */}
      <section className="max-w-[1100px] mx-auto px-4 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-x-8">
          {/* Left image - sticky */}
          <div className="hidden lg:block">
            <div className="sticky top-20 float-anim">
              <img src="/images/left.png" alt="Teens expressing emotions" width={332} height={417} className="w-[220px] h-auto" />
            </div>
          </div>

          {/* Center: all week cards */}
          <div className="space-y-4">
            {weeks.map((w) => (
              <WeekCard key={w.week} w={w} prog={progressMap[w.week]} />
            ))}
          </div>

          {/* Right image - sticky */}
          <div className="hidden lg:block">
            <div className="sticky top-20 float-anim">
              <img src="/images/right.png" alt="Teens together" width={319} height={374} className="w-[220px] h-auto" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
