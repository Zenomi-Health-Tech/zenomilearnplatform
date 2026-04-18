"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ScormPlayer from "@/components/ScormPlayer";
import Link from "next/link";

const WEEK_TITLES: Record<string, string> = {
  "1": "Sleep Hygiene & Nutrition",
  "2": "What Are Emotions?",
  "3": "What is Empathy?",
  "4": "Self-Awareness",
  "5": "Self-Regulation",
  "6": "Building Resilience",
};

function formatLocation(loc: string): string {
  if (!loc) return "";
  // Only show if it's a clean number (actual page/slide)
  if (/^\d+$/.test(loc)) return `Page ${loc}`;
  return "";
}

export default function WeekPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const weekId = params.id as string;
  const [entryPoint, setEntryPoint] = useState<string | null>(null);
  const [status, setStatus] = useState("not attempted");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

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
      const saved = localStorage.getItem(`scorm_progress_week_${weekId}`);
      if (saved) {
        const d = JSON.parse(saved);
        setStatus(d["cmi.core.lesson_status"] || "not attempted");
        setLocation(d["cmi.core.lesson_location"] || "");
      }
    } catch {}
  }, [weekId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!entryPoint) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
        <p className="text-gray-600">No content uploaded for Week {weekId} yet.</p>
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
    <div className="h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-gray-200 bg-gray-50 shrink-0 gap-2 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button onClick={() => router.push("/")} className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 transition-colors shrink-0">
            ← Back
          </button>
          <div className="w-px h-4 bg-gray-300 shrink-0 hidden sm:block" />
          <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
            W{weekId}: {WEEK_TITLES[weekId] || ""}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 shrink-0">
          <span className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span>{statusLabel}</span>
          {loc && <span className="text-gray-400 hidden sm:inline">• {loc}</span>}
        </div>
      </div>

      {/* SCORM iframe */}
      <div className="flex-1">
        <ScormPlayer
          weekId={weekId}
          entryPoint={entryPoint}
          onStatusChange={(s, l) => { setStatus(s); setLocation(l); }}
        />
      </div>
    </div>
  );
}
