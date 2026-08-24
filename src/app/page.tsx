"use client";
import { useEffect, useRef, useState, type RefObject } from "react";

const weeks = [
  {
    week: 1, title: "Sleep Smarter: Real-World Strategies for Teen Nights", color: "bg-[#3d6b8b]", colorHex: "#3d6b8b",
    bullets: [
      "Discover evidence-based strategies to improve sleep quality and establish healthy nighttime routines.",
      "Learn how sleep impacts mood, focus, and overall teen wellbeing.",
    ],
  },
  {
    week: 2, title: "Reset & Recharge: A 6-Week Challenge to Improve Your Sleep", color: "bg-[#4a7a9e]", colorHex: "#4a7a9e",
    bullets: [
      "Take on a structured 6-week challenge designed to reset your sleep patterns.",
      "Build lasting habits that help you wake up refreshed and ready to take on the day.",
    ],
  },
  {
    week: 3, title: "Nutrition Essentials: Building Healthy Habits for Teens", color: "bg-[#704180]", colorHex: "#704180",
    bullets: [
      "Learn the fundamentals of nutrition and how food choices impact your energy and mood.",
      "Build practical healthy eating habits that fit your lifestyle as a teen.",
    ],
  },
  {
    week: 4, title: "What Are Emotions?", color: "bg-[#3d8b8b]", colorHex: "#3d8b8b",
    bullets: [
      "Understand the basics of emotions through five bite-sized micro lessons.",
      "Learn to recognize, name, and understand what emotions really are and why we have them.",
    ],
  },
  {
    week: 5, title: "What is Empathy?", color: "bg-[#4a9e6e]", colorHex: "#4a9e6e",
    bullets: [
      "Discover the power of empathy—understanding and sharing the feelings of others.",
      "Practice perspective-taking and learn how empathy strengthens relationships.",
    ],
  },
  {
    week: 6, title: "Self-Awareness", color: "bg-[#4a9e6e]", colorHex: "#4a9e6e",
    bullets: [
      "Develop a deeper understanding of yourself—your thoughts, feelings, and behaviors.",
      "Learn to recognize patterns and understand your unique emotional landscape.",
    ],
  },
  {
    week: 7, title: "Self-Regulation", color: "bg-[#c46b7c]", colorHex: "#c46b7c",
    bullets: [
      "Master techniques to manage your emotions and impulses effectively.",
      "Build a toolkit of strategies to calm down, think clearly, and respond thoughtfully.",
    ],
  },
  {
    week: 8, title: "Resiliency for Teens", color: "bg-[#c4873a]", colorHex: "#c4873a",
    bullets: [
      "Learn what it means to be resilient and understand its importance in our lives.",
      "Reframe negative thoughts, build positive relationships, and create a personalized Resiliency Toolkit.",
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

    let percentage = 0;
    if (status === "completed" || status === "passed") {
      percentage = 100;
    } else if (suspendData) {
      try {
        const sd = JSON.parse(suspendData);
        if (sd.progress !== undefined) percentage = Math.round(sd.progress * 100);
        else if (sd.v !== undefined) percentage = Math.round((sd.v / 100) * 100);
      } catch {
        if (location) {
          const loc = parseInt(location);
          if (!isNaN(loc)) percentage = Math.min(Math.round((loc / 20) * 100), 95);
        }
      }
      if (percentage === 0 && status === "incomplete") percentage = 5;
    } else if (status === "incomplete") {
      percentage = 5;
    }

    return { status, location, percentage, totalTime };
  } catch { return null; }
}

function loadAllProgress(): Record<number, WeekProgress | null> {
  const p: Record<number, WeekProgress | null> = {};
  for (let i = 1; i <= 8; i++) p[i] = parseProgress(i);
  return p;
}

function formatTime(t: string): string {
  const m = t.match(/(\d+):(\d+):(\d+)/);
  if (!m) return "";
  const h = parseInt(m[1]), min = parseInt(m[2]);
  if (h > 0) return `${h}h ${min}m`;
  if (min > 0) return `${min}m`;
  return "< 1m";
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

// Clock icon SVG
function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

// Pin icon SVG (replaces 📍)
function PinIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}

function ContinueBanner({
  resumeWeek,
  resumeProg,
  completedCount,
  totalWeeks,
}: {
  resumeWeek: (typeof weeks)[0];
  resumeProg: WeekProgress | null;
  completedCount: number;
  totalWeeks: number;
}) {
  const isInProgress = resumeProg?.status === "incomplete";
  const noneStarted = completedCount === 0 && !isInProgress;
  const label = isInProgress ? "Continue" : noneStarted ? "Get Started" : "Next Up";
  const overallPct = Math.round((completedCount / totalWeeks) * 100);

  return (
    <div className="mb-6 bg-white border border-[#704180]/20 rounded-2xl overflow-hidden shadow-sm">
      {/* Overall progress bar */}
      <div className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Course Progress</span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#704180]">
            {completedCount} of {totalWeeks} weeks complete
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#704180] to-[#9b5db5] rounded-full transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        {overallPct > 0 && (
          <p className="mt-1 text-[10px] text-gray-400 text-right">{overallPct}% complete</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Resume / next up */}
      <div className="px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#704180]">{label}</p>
          <p className="mt-0.5 text-[13px] sm:text-[15px] font-medium text-gray-900 leading-snug line-clamp-1">
            Week {resumeWeek.week}: {resumeWeek.title}
          </p>
          {isInProgress && resumeProg && (
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">
              {resumeProg.percentage}% complete · {100 - resumeProg.percentage}% left
              {formatTime(resumeProg.totalTime) ? ` · ${formatTime(resumeProg.totalTime)} spent` : ""}
            </p>
          )}
        </div>
        <a
          href={`/courses/week/${resumeWeek.week}`}
          className="shrink-0 bg-[#704180] text-white text-[11px] sm:text-[13px] font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-[#5c3468] transition-colors whitespace-nowrap"
        >
          {label} →
        </a>
      </div>
    </div>
  );
}

function WeekCard({ w, prog }: { w: (typeof weeks)[0]; prog: WeekProgress | null }) {
  const ref = useReveal();
  const isCompleted = prog?.status === "completed" || prog?.status === "passed";
  const isInProgress = prog?.status === "incomplete";
  const notStarted = !prog;

  const buttonLabel = isCompleted ? "Restart" : isInProgress ? "Resume" : "Start";
  const buttonStyle = isCompleted
    ? "bg-white text-[#2d8a5e] border border-[#2d8a5e]/30 hover:bg-[#2d8a5e]/5"
    : isInProgress
    ? "bg-white text-[#704180] border border-[#704180]/30 hover:bg-[#704180]/5"
    : `text-white hover:opacity-90`;

  const cleanLocation = (() => {
    if (!prog?.location) return "";
    if (/^\d+$/.test(prog.location)) return `Page ${prog.location}`;
    return "";
  })();

  return (
    <div ref={ref} className="reveal">
      <a href={`/courses/week/${w.week}`} className="block">
        <div className="flex rounded-xl overflow-hidden border border-gray-200/80 card-hover relative bg-white">
          {/* Week sidebar */}
          <div className={`${w.color} text-white flex flex-col items-center justify-center w-[56px] sm:w-[64px] shrink-0`}>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase opacity-90">Week</span>
            <span className="text-[28px] sm:text-[34px] font-bold leading-none mt-0.5">{w.week}</span>
          </div>

          {/* Content */}
          <div className="px-3 py-3 sm:px-6 sm:py-5 flex-1 min-w-0">
            {/* Title + badge */}
            <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
              <h3 className="text-[16px] sm:text-[21px] font-[family-name:var(--font-playfair)] text-gray-900 leading-snug">
                {w.title}
              </h3>
              {isCompleted && (
                <span className="shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-[#2d8a5e] bg-[#2d8a5e]/8 border border-[#2d8a5e]/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2d8a5e]" />
                  Done
                </span>
              )}
              {isInProgress && (
                <span className="shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-[#704180] bg-[#704180]/8 border border-[#704180]/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#704180] animate-pulse" />
                  {prog.percentage}%
                </span>
              )}
            </div>

            {/* Bullets */}
            <ul className="space-y-1.5 sm:space-y-2">
              {w.bullets.map((b, j) => (
                <li key={j} className="text-gray-600 text-[13px] sm:text-[15px] leading-[1.6] flex gap-2">
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
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[10px] sm:text-[12px] text-gray-400 flex-wrap min-w-0">
                {isInProgress && cleanLocation && (
                  <span className="flex items-center gap-0.5">
                    <PinIcon />
                    {cleanLocation}
                  </span>
                )}
                {isInProgress && (
                  <span className="text-[#704180] font-medium">{100 - prog.percentage}% left</span>
                )}
                {prog && formatTime(prog.totalTime) && (
                  <span className="flex items-center gap-1">
                    <ClockIcon />
                    {formatTime(prog.totalTime)}
                  </span>
                )}
                {isCompleted && (
                  <span className="text-[#2d8a5e] font-medium">Complete ✓</span>
                )}
              </div>

              <span
                className={`shrink-0 text-[11px] sm:text-[12px] font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all ${buttonStyle}`}
                style={notStarted ? { backgroundColor: w.colorHex } : undefined}
              >
                {buttonLabel} →
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default function Home() {
  const [progressMap, setProgressMap] = useState<Record<number, WeekProgress | null>>({});
  const headerRef = useReveal();

  const refreshProgress = () => setProgressMap(loadAllProgress());

  useEffect(() => {
    refreshProgress();
    // Refresh when user returns to this tab after studying a week
    window.addEventListener("focus", refreshProgress);
    return () => window.removeEventListener("focus", refreshProgress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine which week to show in the "Continue" banner
  const completedCount = weeks.filter((w) => {
    const s = progressMap[w.week]?.status;
    return s === "completed" || s === "passed";
  }).length;

  const firstInProgress = weeks.find((w) => progressMap[w.week]?.status === "incomplete");
  // Prefer last-visited week over defaulting to Week 1 when nothing is in-progress
  const lastVisitedId = (() => {
    try { return parseInt(localStorage.getItem("scorm_last_visited_week") || ""); } catch { return NaN; }
  })();
  const lastVisitedWeek = !isNaN(lastVisitedId) ? weeks.find((w) => w.week === lastVisitedId) : undefined;
  const firstNotStarted = weeks.find((w) => !progressMap[w.week]);
  const resumeWeek = firstInProgress ?? lastVisitedWeek ?? firstNotStarted;
  const allDone = completedCount === weeks.length;

  return (
    <div className="bg-[#f4f0f7]">
      {/* Header */}
      <section ref={headerRef} className="reveal header-glow pt-12 sm:pt-24 pb-10 sm:pb-16 text-center px-4">
        <p className="text-[10px] sm:text-[13px] font-semibold tracking-[0.25em] uppercase text-[#704180]">
          8-Week Course
        </p>
        <h1 className="mt-4 text-[26px] sm:text-[42px] md:text-[52px] lg:text-[58px] font-[family-name:var(--font-playfair)] font-normal text-gray-900 leading-[1.15]">
          Emotional Regulation<br className="hidden sm:block" /> for Teens
        </h1>
        <p className="mt-4 text-gray-500 text-[14px] sm:text-[17px] max-w-[520px] mx-auto leading-[1.7]">
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

          {/* Center: continue banner + all week cards */}
          <div>
            {/* Continue / progress banner */}
            {allDone ? (
              <div className="mb-6 bg-white border border-[#2d8a5e]/20 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Course Progress</span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#2d8a5e]">8 of 8 weeks complete</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[#2d8a5e] rounded-full w-full" />
                </div>
                <p className="text-[13px] sm:text-[15px] font-medium text-gray-800">
                  You've completed the full course. Great work! ✓
                </p>
              </div>
            ) : resumeWeek ? (
              <ContinueBanner
                resumeWeek={resumeWeek}
                resumeProg={progressMap[resumeWeek.week] ?? null}
                completedCount={completedCount}
                totalWeeks={weeks.length}
              />
            ) : null}

            {/* Week cards */}
            <div className="space-y-4">
              {weeks.map((w) => (
                <WeekCard key={w.week} w={w} prog={progressMap[w.week]} />
              ))}
            </div>
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
