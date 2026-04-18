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

    // Load saved status
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

  const statusColor =
    status === "completed" || status === "passed" ? "bg-green-500" :
    status === "incomplete" ? "bg-yellow-500" : "bg-gray-400";

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-sm text-gray-500 hover:text-gray-800">
            ← Back
          </button>
          <span className="text-sm font-medium text-gray-800">
            Week {weekId}: {WEEK_TITLES[weekId] || ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="capitalize">{status.replace("_", " ")}</span>
          {location && <span className="text-gray-400">• Page {location}</span>}
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
