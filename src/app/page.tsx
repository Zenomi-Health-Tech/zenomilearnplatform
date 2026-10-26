"use client";
import { useEffect, useRef, useState } from "react";
import InteractiveLearning from "@/components/InteractiveLearning";
import LearnFooter from "@/components/LearnFooter";
import BrandLockup from "@/components/BrandLockup";
import HeroSphere from "@/components/HeroSphere";
import LearningPath from "@/components/LearningPath";
import SectionDivider from "@/components/SectionDivider";

// Each week carries one stop on the logo gradient, crimson through to indigo,
// so the journey line reads as the brand mark stretched over the course.
// `week` is the SCORM folder id, used for links and saved progress. Reset &
// Recharge (folder 2) is left out so the course has one sleep lesson, which is
// shown as covering weeks 1 and 2; the rest keep their folder number, 3 to 8.
const weeks = [
  { week: 1, color: "#B40C48", title: "Sleep Smarter: Real-World Strategies for Teen Nights", blurb: "Evidence-based strategies to improve sleep quality and build healthy nighttime routines." },
  { week: 3, color: "#A2165A", title: "Nutrition Essentials: Building Healthy Habits for Teens", blurb: "How food choices affect your energy and mood, and habits that fit your life." },
  { week: 4, color: "#93226A", title: "What Are Emotions?", blurb: "Five bite-sized micro lessons on recognizing, naming and understanding emotions." },
  { week: 5, color: "#84306C", title: "What is Empathy?", blurb: "Understanding and sharing the feelings of others, and how it strengthens relationships." },
  { week: 6, color: "#6E32A0", title: "Self-Awareness", blurb: "Get to know your thoughts, feelings and behaviors, and the patterns behind them." },
  { week: 7, color: "#6437B0", title: "Self-Regulation", blurb: "A toolkit of strategies to calm down, think clearly and respond thoughtfully." },
  { week: 8, color: "#5A3CBE", title: "Resiliency for Teens", blurb: "Reframe negative thoughts, build positive relationships and create your Resiliency Toolkit." },
].map((w) => ({ ...w, num: w.week, label: w.week === 1 ? "Weeks 1 & 2" : `Week ${w.week}` }));

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

const isDone = (p?: WeekProgress | null) => p?.status === "completed" || p?.status === "passed";

/** Adds `visible` once the element scrolls into view, so the lessons arrive one by one. */
function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

const headline = "A guided journey to understanding, managing, and thriving with your emotions.";

// The buttons stay the same whatever the teen has done; progress lives with
// the lessons, not up here.
function Hero() {
  return (
    <section className="zl-hero relative overflow-hidden text-white">
      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-8 lg:px-12 pt-4 sm:pt-5 pb-2 grid lg:grid-cols-[1fr_auto] gap-x-10 gap-y-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <BrandLockup />
            <span className="lg:hidden text-[24px] font-light tracking-[-0.015em]">Zenomi<span className="font-[family-name:var(--font-fraunces)] italic font-medium text-[#FFC2DD] ml-2">Learn</span></span>
          </div>
          <h1 aria-label={headline} className="my-auto pt-8 lg:pt-0 text-[30px] sm:text-[36px] lg:text-[clamp(34px,2.9vw,44px)] font-light leading-[1.22] tracking-[-0.015em]">
            A guided journey to understanding,<br className="hidden sm:block" /> managing, and{" "}
            <span className="font-[family-name:var(--font-fraunces)] italic font-medium text-[#FFC2DD]">thriving</span> with your emotions.
          </h1>
        </div>
        <div className="hidden lg:flex flex-col items-center">
          <span className="mb-7 text-[32px] font-light tracking-[-0.015em]">Zenomi<span className="font-[family-name:var(--font-fraunces)] italic font-medium text-[#FFC2DD] ml-2">Learn</span></span>
          <HeroSphere />
        </div>
      </div>
    </section>
  );
}

// Weeks with a cover illustration, by SCORM folder id. Week 8's is 16:9, the
// rest are wide 8:3 banners.
const COVERS = new Set([1, 3, 4, 5, 6, 7, 8]);

// The four skills the last week ties together, as its cover lays them out.
const RESILIENCE_SKILLS = [
  { t: "Understand emotions", d: "Name what you feel." },
  { t: "Practice empathy", d: "Connect with others." },
  { t: "Build self-awareness", d: "Know strengths and triggers." },
  { t: "Manage emotions", d: "Practice helpful responses." },
];

function LessonStep({ w, prog, isNext }: { w: (typeof weeks)[0]; prog: WeekProgress | null; isNext: boolean }) {
  const ref = useReveal<HTMLLIElement>(0.25);
  const done = isDone(prog);
  const inProgress = prog?.status === "incomplete";
  const label = done ? "Review" : inProgress ? "Resume" : "Start";

  return (
    <li ref={ref} className="zl-step" style={{ ["--c" as string]: w.color }}>
      <a href={`/courses/week/${w.week}`} className="zl-card group grid overflow-hidden rounded-3xl bg-[#F5ECFD] sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* cover: the course illustration, or a brand panel until one exists */}
        <span className={`relative block overflow-hidden ${!COVERS.has(w.week) ? "self-stretch min-h-[150px]" : w.week === 8 ? "self-center aspect-[16/9]" : "self-center aspect-[8/3]"}`}>
          {COVERS.has(w.week) ? (
            <img src={`/images/courses/week-${w.week}.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          ) : (
            <span className="absolute inset-0 grid place-items-center" style={{ background: `linear-gradient(135deg, ${w.color}, #2A0F24)` }}>
              <span className="text-center text-white">
                <span className="block text-[12px] font-semibold uppercase tracking-[0.2em] opacity-80">Week</span>
                <span className="block text-[48px] font-bold leading-none">{w.num}</span>
              </span>
            </span>
          )}
        </span>

        <span className="flex flex-col border-t border-[#84306C]/10 px-5 py-5 sm:border-t-0 sm:border-l sm:px-7 sm:py-6">
          <span className="flex items-center justify-between gap-3">
            <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ color: "#fff", background: w.color }}>
              {done ? "✓ " : ""}{w.label}
            </span>
            {done && <span className="zl-badge bg-[#E7F6EE] text-[#1F7A4D]">Completed</span>}
            {inProgress && <span className="zl-badge bg-[#F3E9F7] text-[#6E32A0]">In progress</span>}
            {isNext && !inProgress && !done && <span className="zl-badge bg-[#FCE7EF] text-[#B40C48]">Up next</span>}
          </span>
          <h3 className="mt-3 text-[18px] sm:text-[20px] font-semibold leading-snug text-[#2A0F24]">{w.title}</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[#5B4560]">{w.blurb}</p>
          {w.week === 8 && (
            <span className="mt-4 block">
              <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#5A3CBE]">Brings together</span>
              <span className="mt-2 grid grid-cols-2 gap-2">
                {RESILIENCE_SKILLS.map((k) => (
                  <span key={k.t} className="rounded-xl bg-white/70 px-3 py-2">
                    <span className="block text-[13px] font-semibold text-[#2A0F24]">{k.t}</span>
                    <span className="block text-[12px] text-[#5B4560]">{k.d}</span>
                  </span>
                ))}
              </span>
              <span className="mt-3 block text-[13px] italic text-[#5B4560]">Adapt, recover, keep learning: resilience grows with practice and support.</span>
            </span>
          )}
          <span className="mt-auto pt-4">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold text-white transition-opacity group-hover:opacity-90" style={{ background: w.color }}>
              {label} <span className="zl-arrow">→</span>
            </span>
          </span>
        </span>
      </a>
    </li>
  );
}

/** Shown only once the teen has started a week; a new visitor sees just the lessons. */
function ProgressCard({ completed, current, href, label }: { completed: number; current: (typeof weeks)[0] | undefined; href: string; label: string }) {
  return (
    <div className="zl-panel mb-8 rounded-2xl bg-white border border-[#84306C]/12 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#84306C]">Your progress</p>
          <p className="mt-1 text-[15px] sm:text-[16px] font-semibold text-[#2A0F24] truncate">
            {current ? `${current.label}: ${current.title}` : "You have finished every week"}
          </p>
        </div>
        <a href={href} className="zl-btn zl-btn-primary shrink-0 px-4 py-2 text-[13px]">
          {label} <span className="zl-arrow">→</span>
        </a>
      </div>
      <div className="mt-4 h-2 rounded-full bg-[#84306C]/12 overflow-hidden" aria-hidden>
        <div className="h-full rounded-full bg-[#84306C]" style={{ width: `${(completed / weeks.length) * 100}%` }} />
      </div>
      <p className="mt-2 text-[12px] text-[#5B4560]">{completed} of {weeks.length} lessons complete</p>
    </div>
  );
}

function Lessons({ progress, nextWeek }: { progress: Record<number, WeekProgress | null>; nextWeek?: number }) {
  return (
    <div className="zl-panel">
      <h2 className="text-[30px] sm:text-[38px] font-light tracking-[-0.015em] text-white">Weekly <span className="font-[family-name:var(--font-fraunces)] italic font-medium text-[#FFC2DD]">lessons</span></h2>
      <p className="mt-1.5 text-[15px] sm:text-[16px] text-white/75">One step at a time, at your own pace.</p>
      <ol className="mt-6 space-y-5">
        {weeks.map((w) => (
          <LessonStep key={w.week} w={w} prog={progress[w.week] ?? null} isNext={w.week === nextWeek} />
        ))}
      </ol>
    </div>
  );
}

export default function Home() {
  const [progress, setProgress] = useState<Record<number, WeekProgress | null>>({});
  const [tab, setTab] = useState<"lessons" | "interactive">("lessons");

  useEffect(() => {
    // Coming back from a story page lands on the Interactive tab. Read after
    // mount, since the server render cannot see the query string.
    if (new URLSearchParams(window.location.search).get("tab") !== "interactive") return;
    const id = requestAnimationFrame(() => setTab("interactive"));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const refresh = () => setProgress(loadAllProgress());
    refresh();
    // Refresh when the teen comes back to this tab after studying a week
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const completed = weeks.filter((w) => isDone(progress[w.week])).length;
  const inProgress = weeks.find((w) => progress[w.week]?.status === "incomplete");
  const notStarted = weeks.find((w) => !progress[w.week]);
  const next = inProgress ?? notStarted;
  const started = completed > 0 || !!inProgress;
  const resumeHref = `/courses/week/${next?.week ?? 1}`;
  const resumeLabel = inProgress ? `Continue ${inProgress.label}` : completed === 0 ? "Start Week 1" : next ? `Start ${next.label}` : "Review the course";

  return (
    <div className="zl zl-stage font-[family-name:var(--font-poppins)] min-h-screen flex flex-col">
      {/* Dark banner, light learning path, then the lists back on the banner's dark */}
      <div className="zl-stage">
      <Hero />
      <SectionDivider to="path" label="Go to your learning path" />
      <div id="path" className="zl-path-band scroll-mt-4">
        <LearningPath tab={tab} setTab={setTab} />
      </div>
      <SectionDivider to="learn" label="Go to the lessons" />
      <div>
        <section id="learn" className="max-w-[1040px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-20 scroll-mt-4">
          <div key={tab}>
            {started && tab === "lessons" && <ProgressCard completed={completed} current={next} href={resumeHref} label={resumeLabel} />}
            {tab === "lessons" ? <Lessons progress={progress} nextWeek={next?.week} /> : <InteractiveLearning />}
          </div>
        </section>
      </div>
      </div>
      <LearnFooter />
    </div>
  );
}
