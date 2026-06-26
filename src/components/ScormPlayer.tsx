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

// Parse ISO 8601 duration (SCORM 2004) to seconds
function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || "0") * 3600) + (parseInt(m[2] || "0") * 60) + parseFloat(m[3] || "0");
}

// Add ISO 8601 duration to HH:MM:SS total_time
function addIsoDuration(total: string, isoDuration: string): string {
  const parse = (t: string) => {
    const m = t.match(/(\d+):(\d+):(\d+)/);
    return m ? parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseInt(m[3]) : 0;
  };
  const s = parse(total) + parseDuration(isoDuration);
  const h = Math.floor(s / 3600);
  const min = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
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

    if (saved["cmi.core.lesson_location"]) {
      cmiData.current["cmi.core.entry"] = "resume";
    }

    // ── SCORM 1.2 API ──────────────────────────────────────────────────────
    const API = {
      LMSInitialize: () => { initialized.current = true; return "true"; },
      LMSFinish: () => {
        if (!initialized.current) return "false";
        const sessionTime = cmiData.current["cmi.core.session_time"] || "0000:00:00.00";
        const totalTime = cmiData.current["cmi.core.total_time"] || "0000:00:00.00";
        cmiData.current["cmi.core.total_time"] = addTime(totalTime, sessionTime);
        saveProgress(weekId, cmiData.current);
        initialized.current = false;
        return "true";
      },
      LMSGetValue: (element: string) => cmiData.current[element] ?? "",
      LMSSetValue: (element: string, value: string) => {
        cmiData.current[element] = value;
        saveProgress(weekId, cmiData.current);
        if (element === "cmi.core.lesson_status" || element === "cmi.core.lesson_location") {
          onStatusChange?.(cmiData.current["cmi.core.lesson_status"], cmiData.current["cmi.core.lesson_location"]);
        }
        return "true";
      },
      LMSCommit: () => { saveProgress(weekId, cmiData.current); return "true"; },
      LMSGetLastError: () => "0",
      LMSGetErrorString: () => "No Error",
      LMSGetDiagnostic: () => "",
    };

    // ── SCORM 2004 API ─────────────────────────────────────────────────────
    // Maps SCORM 2004 fields → stored as SCORM 1.2 keys so parseProgress works
    const API_1484_11 = {
      Initialize: (_: string) => { initialized.current = true; return "true"; },
      Terminate: (_: string) => {
        if (!initialized.current) return "false";
        const sessionTime = cmiData.current["cmi.core.session_time"] || "";
        const totalTime = cmiData.current["cmi.core.total_time"] || "0000:00:00.00";
        if (sessionTime) {
          cmiData.current["cmi.core.total_time"] = addIsoDuration(totalTime, sessionTime);
        }
        saveProgress(weekId, cmiData.current);
        initialized.current = false;
        return "true";
      },
      GetValue: (element: string) => {
        // Map SCORM 2004 fields to stored SCORM 1.2 equivalents
        if (element === "cmi.completion_status") return cmiData.current["cmi.core.lesson_status"] || "not attempted";
        if (element === "cmi.location") return cmiData.current["cmi.core.lesson_location"] || "";
        if (element === "cmi.score.raw") return cmiData.current["cmi.core.score.raw"] || "";
        if (element === "cmi.total_time") return cmiData.current["cmi.core.total_time"] || "0000:00:00.00";
        return cmiData.current[element] ?? "";
      },
      SetValue: (element: string, value: string) => {
        // Bridge SCORM 2004 fields to SCORM 1.2 storage keys
        if (element === "cmi.completion_status") {
          cmiData.current["cmi.core.lesson_status"] = value;
          saveProgress(weekId, cmiData.current);
          onStatusChange?.(value, cmiData.current["cmi.core.lesson_location"] || "");
          return "true";
        }
        if (element === "cmi.location") {
          cmiData.current["cmi.core.lesson_location"] = value;
          saveProgress(weekId, cmiData.current);
          onStatusChange?.(cmiData.current["cmi.core.lesson_status"] || "not attempted", value);
          return "true";
        }
        if (element === "cmi.score.raw") { cmiData.current["cmi.core.score.raw"] = value; }
        else if (element === "cmi.session_time") { cmiData.current["cmi.core.session_time"] = value; }
        else { cmiData.current[element] = value; }
        saveProgress(weekId, cmiData.current);
        return "true";
      },
      Commit: (_: string) => { saveProgress(weekId, cmiData.current); return "true"; },
      GetLastError: () => "0",
      GetErrorString: (_: string) => "",
      GetDiagnostic: (_: string) => "",
    };

    (window as unknown as Record<string, unknown>).API = API;
    (window as unknown as Record<string, unknown>).API_1484_11 = API_1484_11;
  }, [weekId, onStatusChange]);

  useEffect(() => {
    setupAPI();
    return () => {
      delete (window as unknown as Record<string, unknown>).API;
      delete (window as unknown as Record<string, unknown>).API_1484_11;
    };
  }, [setupAPI]);

  return (
    <iframe
      ref={iframeRef}
      src={`/scorm/week-${weekId}/${entryPoint}`}
      className="w-full border-0 scorm-iframe"
      style={{ height: "100%", minHeight: "calc(100dvh - 44px)" }}
      allow="autoplay"
      scrolling="auto"
      title="SCORM Content"
    />
  );
}
