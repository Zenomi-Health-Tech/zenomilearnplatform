"use client";
import { useEffect, useState } from "react";
import { getToken, getCourseAccess } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import ScormPlayer from "@/components/ScormPlayer";
import Link from "next/link";

const WEEK_TITLES: Record<string, string> = {
  "1": "Sleep Smarter: Real-World Strategies for Teen Nights",
  "2": "Reset & Recharge: A 6-Week Challenge to Improve Your Sleep",
  "3": "Nutrition Essentials: Building Healthy Habits for Teens",
  "4": "What Are Emotions?",
  "5": "What is Empathy?",
  "6": "Self-Awareness",
  "7": "Self-Regulation",
  "8": "Resiliency for Teens",
};

function formatLocation(loc: string): string {
  if (!loc) return "";
  // Only show if it's a clean number (actual page/slide)
  if (/^\d+$/.test(loc)) return `Page ${loc}`;
  return "";
}

// The homepage shows the one sleep lesson as weeks 1 and 2; every other week
// keeps its folder number.
const SHOWN_NUMBER: Record<string, string> = { "1": "1 & 2" };

export default function WeekPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const weekId = params.id as string;
  const [entryPoint, setEntryPoint] = useState<string | null>(null);
  const [status, setStatus] = useState("not attempted");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const [blocked, setBlocked] = useState<string | null>(null);

  // The gate is off. A week opens for anyone with the link.
  //
  // Two things to know before it is put back. The course content itself has
  // always been served straight from public/scorm, so a direct path reached it
  // whether or not this page let you through: the gate was closing the door and
  // leaving the window open. And it made the site unusable on a laptop, because
  // the only way to get a session was to come from the phone.
  //
  // When a session does exist we still ask the backend about eligibility, so a
  // teen who has not finished the five assessments is told which ones are
  // outstanding. Someone with no session simply gets the week.
  useEffect(() => {
    if (!getToken()) return;
    getCourseAccess().then(({ ok, status, body }) => {
      if (status === 401) return;
      if (!ok) {
        setBlocked(String((body as any).message ?? "These courses are not open yet."));
        setLoading(false);
      }
    });
  }, [weekId]);

  useEffect(() => {
    fetch("/api/scorm/manifest")
      .then((r) => r.json())
      .then((data) => {
        const week = data.weeks?.[weekId];
        if (week?.uploaded && week.entryPoint) {
          setEntryPoint(week.entryPoint);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    try {
      // Track last visited week so home page banner can detect where user left off
      localStorage.setItem("scorm_last_visited_week", weekId);

      const saved = localStorage.getItem(`scorm_progress_week_${weekId}`);
      if (saved) {
        const d = JSON.parse(saved);
        setStatus(d["cmi.core.lesson_status"] || "not attempted");
        setLocation(d["cmi.core.lesson_location"] || "");
      }
    } catch {}
  }, [weekId]);

  if (blocked) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-112px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Not open yet</h1>
          <p className="mt-3 text-sm text-gray-600">{blocked}</p>
          <p className="mt-4 text-xs text-gray-400">
            Finish your assessments in the Zenomi app and these will unlock.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white" style={{ height: "100dvh" }}>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!entryPoint) {
    return (
      <div className="flex flex-col items-center justify-center bg-white gap-4 px-4 text-center" style={{ height: "100dvh" }}>
        <p className="text-gray-600">No content uploaded for Week {SHOWN_NUMBER[weekId] ?? weekId} yet.</p>
        <Link href="/" className="text-[#704180] hover:underline text-sm">← Back to course</Link>
      </div>
    );
  }

  const statusLabel =
    status === "completed" || status === "passed" ? "Completed" :
    status === "incomplete" ? "In Progress" : "Not Started";

  const statusColor =
    status === "completed" || status === "passed" ? "bg-[#2d8a5e]" :
    status === "incomplete" ? "bg-[#704180]" : "bg-gray-400";

  const loc = formatLocation(location);

  return (
    <div className="flex flex-col bg-white" style={{ height: "100dvh" }}>
      {/* Top bar - compact on mobile */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2.5 border-b border-gray-200 bg-gray-50 shrink-0 gap-2 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button onClick={() => router.push("/")} className="text-xs text-gray-500 hover:text-gray-800 transition-colors shrink-0">
            ←
          </button>
          <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
            W{SHOWN_NUMBER[weekId] ?? weekId}: {WEEK_TITLES[weekId] || ""}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 shrink-0">
          <span className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="hidden sm:inline">{statusLabel}</span>
          {loc && <span className="text-gray-400 hidden sm:inline">• {loc}</span>}
        </div>
      </div>

      {/* SCORM iframe - takes all remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScormPlayer
          weekId={weekId}
          entryPoint={entryPoint}
          onStatusChange={(s, l) => { setStatus(s); setLocation(l); }}
        />
      </div>
    </div>
  );
}
