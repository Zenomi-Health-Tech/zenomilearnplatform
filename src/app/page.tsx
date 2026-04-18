"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const weeks = [
  {
    week: 1, title: "Sleep Hygiene & Nutrition", color: "bg-[#704180]",
    bullets: [
      "Build a foundation for emotional well-being through better sleep and mindful nutrition.",
      "Learn practical habits for restful nights and fueling your body and mind.",
    ],
  },
  {
    week: 2, title: "What Are Emotions?", color: "bg-[#3d8b8b]",
    bullets: [
      "Understand the basics of emotions through five bite-sized micro lessons.",
      "Learn to recognize, name, and understand what emotions really are and why we have them.",
    ],
  },
  {
    week: 3, title: "What is Empathy?", color: "bg-[#4a9e6e]",
    bullets: [
      "Discover the power of empathy—understanding and sharing the feelings of others.",
      "Practice perspective-taking and learn how empathy strengthens relationships.",
    ],
  },
  {
    week: 4, title: "Self-Awareness", color: "bg-[#4a9e6e]",
    bullets: [
      "Develop a deeper understanding of yourself—your thoughts, feelings, and behaviors.",
      "Learn to recognize patterns and understand your unique emotional landscape.",
    ],
  },
  {
    week: 5, title: "Self-Regulation", color: "bg-[#c46b7c]",
    bullets: [
      "Master techniques to manage your emotions and impulses effectively.",
      "Build a toolkit of strategies to calm down, think clearly, and respond thoughtfully.",
    ],
  },
  {
    week: 6, title: "Building Resilience", color: "bg-[#c4873a]",
    bullets: [
      "Strengthen your ability to bounce back from challenges.",
      "Create a personal plan for handling stress, setbacks, and growing stronger through adversity.",
    ],
  },
];

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <div className="flex justify-center py-1">
      <svg width="90" height="20" viewBox="0 0 90 20" fill="none" className="text-[#b0b0b0]">
        {direction === "right" ? (
          <>
            <line x1="5" y1="10" x2="78" y2="10" stroke="currentColor" strokeWidth="1.2" />
            <polyline points="72,5 80,10 72,15" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </>
        ) : (
          <>
            <line x1="12" y1="10" x2="85" y2="10" stroke="currentColor" strokeWidth="1.2" />
            <polyline points="18,5 10,10 18,15" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </>
        )}
      </svg>
    </div>
  );
}

function WeekCard({ w, progress }: { w: (typeof weeks)[0]; progress?: string }) {
  const statusLabel =
    progress === "completed" || progress === "passed" ? "Completed ✅" :
    progress === "incomplete" ? "In Progress 🔵" : null;

  return (
    <Link href={`/courses/week/${w.week}`} className="block">
      <div className="flex hover:shadow-md transition-shadow rounded-lg">
        <div className={`${w.color} text-white flex flex-col items-center justify-center w-14 sm:w-16 shrink-0 rounded-l-lg`}>
          <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase">Week</span>
          <span className="text-2xl sm:text-3xl font-bold">{w.week}</span>
        </div>
        <div className="border border-l-0 border-gray-200 rounded-r-lg p-4 sm:p-5 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{w.title}</h3>
            {statusLabel && <span className="text-xs text-gray-500">{statusLabel}</span>}
          </div>
          <ul className="space-y-2">
            {w.bullets.map((b, j) => (
              <li key={j} className="text-gray-600 text-[15px] leading-relaxed flex gap-2">
                <span className="mt-0.5 shrink-0">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [progress, setProgress] = useState<Record<number, string>>({});

  useEffect(() => {
    const p: Record<number, string> = {};
    for (let i = 1; i <= 6; i++) {
      try {
        const saved = localStorage.getItem(`scorm_progress_week_${i}`);
        if (saved) {
          const d = JSON.parse(saved);
          if (d["cmi.core.lesson_status"]) p[i] = d["cmi.core.lesson_status"];
        }
      } catch {}
    }
    setProgress(p);
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-14 sm:pt-20 pb-8 sm:pb-12 text-center px-4">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#704180]">
          6-Week Course
        </p>
        <h1 className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-normal text-gray-900 leading-tight">
          Emotional Regulation for Teens
        </h1>
        <p className="mt-4 text-gray-500 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          A guided journey to understanding, managing, and thriving with your emotions.
        </p>
      </section>

      {/* Weeks 1-2 with images */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-x-6 items-start">
          <div className="hidden lg:flex flex-col items-center pt-2">
            <Image src="/images/1.png" alt="Teens expressing emotions" width={240} height={200} className="rounded-lg object-cover" />
            <Arrow direction="right" />
          </div>
          <div className="space-y-3">
            <WeekCard w={weeks[0]} progress={progress[1]} />
            <WeekCard w={weeks[1]} progress={progress[2]} />
          </div>
          <div className="hidden lg:flex flex-col items-center pt-2">
            <Image src="/images/3.png" alt="Teens together" width={240} height={200} className="rounded-lg object-cover" />
            <Arrow direction="left" />
          </div>
        </div>
      </section>

      {/* Weeks 3-4 with images */}
      <section className="max-w-6xl mx-auto px-4 mt-3">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-x-6 items-start">
          <div className="hidden lg:flex flex-col items-center pt-2">
            <Image src="/images/1.png" alt="Teens expressing emotions" width={240} height={200} className="rounded-lg object-cover" />
            <Arrow direction="right" />
          </div>
          <div className="space-y-3">
            <WeekCard w={weeks[2]} progress={progress[3]} />
            <WeekCard w={weeks[3]} progress={progress[4]} />
          </div>
          <div className="hidden lg:flex flex-col items-center pt-2">
            <Image src="/images/3.png" alt="Teens together" width={240} height={200} className="rounded-lg object-cover" />
            <Arrow direction="left" />
          </div>
        </div>
      </section>

      {/* Weeks 5-6 centered */}
      <section className="max-w-6xl mx-auto px-4 mt-3 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-x-6">
          <div className="hidden lg:block" />
          <div className="space-y-3">
            <WeekCard w={weeks[4]} progress={progress[5]} />
            <WeekCard w={weeks[5]} progress={progress[6]} />
          </div>
          <div className="hidden lg:block" />
        </div>
      </section>
    </div>
  );
}
