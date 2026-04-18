"use client";
import { useEffect, useRef, useCallback } from "react";

const CMI_DEFAULTS: Record<string, string> = {
  "cmi.core.lesson_status": "not attempted",
  "cmi.core.lesson_location": "",
  "cmi.core.score.raw": "",
  "cmi.core.score.max": "100",
  "cmi.core.score.min": "0",
  "cmi.core.total_time": "0000:00:00.00",
  "cmi.core.session_time": "0000:00:00.00",
  "cmi.suspend_data": "",
  "cmi.core.entry": "ab-initio",
  "cmi.core.credit": "credit",
  "cmi.core.lesson_mode": "normal",
  "cmi.core.student_id": "learner_1",
  "cmi.core.student_name": "Learner",
};

function getStorageKey(weekId: string) {
  return `scorm_progress_week_${weekId}`;
}

function loadProgress(weekId: string): Record<string, string> {
  try {
    const saved = localStorage.getItem(getStorageKey(weekId));
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function saveProgress(weekId: string, data: Record<string, string>) {
  localStorage.setItem(getStorageKey(weekId), JSON.stringify(data));
}

function addTime(total: string, session: string): string {
  const parse = (t: string) => {
    const m = t.match(/(\d+):(\d+):(\d+)/);
    return m ? parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseInt(m[3]) : 0;
  };
  const s = parse(total) + parse(session);
  const h = Math.floor(s / 3600);
  const min = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(4, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.00`;
}

interface Props {
  weekId: string;
  entryPoint: string;
  onStatusChange?: (status: string, location: string) => void;
}

export default function ScormPlayer({ weekId, entryPoint, onStatusChange }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cmiData = useRef<Record<string, string>>({});
  const initialized = useRef(false);

  const setupAPI = useCallback(() => {
    const saved = loadProgress(weekId);
    cmiData.current = { ...CMI_DEFAULTS, ...saved };

    // If resuming, set entry to "resume"
    if (saved["cmi.core.lesson_location"]) {
      cmiData.current["cmi.core.entry"] = "resume";
    }

    const API = {
      LMSInitialize: () => {
        initialized.current = true;
        return "true";
      },
      LMSFinish: () => {
        if (!initialized.current) return "false";
        // Add session time to total time
        const sessionTime = cmiData.current["cmi.core.session_time"] || "0000:00:00.00";
        const totalTime = cmiData.current["cmi.core.total_time"] || "0000:00:00.00";
        cmiData.current["cmi.core.total_time"] = addTime(totalTime, sessionTime);
        saveProgress(weekId, cmiData.current);
        initialized.current = false;
        return "true";
      },
      LMSGetValue: (element: string) => {
        return cmiData.current[element] ?? "";
      },
      LMSSetValue: (element: string, value: string) => {
        cmiData.current[element] = value;
        saveProgress(weekId, cmiData.current);
        if (element === "cmi.core.lesson_status" || element === "cmi.core.lesson_location") {
          onStatusChange?.(
            cmiData.current["cmi.core.lesson_status"],
            cmiData.current["cmi.core.lesson_location"]
          );
        }
        return "true";
      },
      LMSCommit: () => {
        saveProgress(weekId, cmiData.current);
        return "true";
      },
      LMSGetLastError: () => "0",
      LMSGetErrorString: () => "No Error",
      LMSGetDiagnostic: () => "",
    };

    // SCORM 1.2 looks for API on parent window
    (window as unknown as Record<string, unknown>).API = API;
  }, [weekId, onStatusChange]);

  useEffect(() => {
    setupAPI();
    return () => {
      delete (window as unknown as Record<string, unknown>).API;
    };
  }, [setupAPI]);

  return (
    <iframe
      ref={iframeRef}
      src={`/scorm/week-${weekId}/${entryPoint}`}
      className="w-full h-full border-0"
      allow="autoplay"
      title="SCORM Content"
    />
  );
}
