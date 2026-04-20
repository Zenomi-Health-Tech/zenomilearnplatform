"use client";
import { useEffect, useRef, useState } from "react";

export default function ContentProtection() {
  const [blocked, setBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // === 1. Disable right-click ===
    const noContext = (e: MouseEvent) => e.preventDefault();

    // === 2. Disable keyboard shortcuts (desktop) ===
    const noKeys = (e: KeyboardEvent) => {
      if (e.key === "F12") { e.preventDefault(); return; }
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      if (ctrl && shift && ["I","i","J","j","C","c"].includes(e.key)) { e.preventDefault(); return; }
      if (ctrl && (e.key === "u" || e.key === "U")) { e.preventDefault(); return; }
      if (ctrl && ["s","S","p","P"].includes(e.key)) { e.preventDefault(); return; }
      if (e.key === "PrintScreen") {
        e.preventDefault();
        navigator.clipboard?.writeText("").catch(() => {});
        flashBlur();
        return;
      }
      if (e.metaKey && shift && (e.key === "s" || e.key === "S")) { e.preventDefault(); return; }
      if (e.metaKey && shift && ["3","4","5"].includes(e.key)) {
        e.preventDefault();
        flashBlur();
        return;
      }
    };

    // === 3. Disable drag/copy/cut/selectall ===
    const prevent = (e: Event) => e.preventDefault();

    // === 5. Blur on window blur — only if document is also hidden (real app switch, not iframe focus) ===
    const onVisibility = () => {
      if (document.hidden) {
        document.body.style.filter = "blur(30px)";
      } else {
        document.body.style.filter = "";
      }
    };

    // === 6. Detect screen capture API ===
    const checkCapture = async () => {
      try {
        // @ts-expect-error - display-capture is valid
        const p = await navigator.permissions.query({ name: "display-capture" });
        const check = () => {
          if (p.state === "granted") {
            setBlocked(true);
            setBlockReason("Screen capture detected. Please stop screen sharing to continue.");
          }
        };
        check();
        p.onchange = check;
      } catch { /* not supported */ }
    };
    checkCapture();

    // === 7. Block PiP ===
    const onPiP = () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(() => {});
      }
    };

    // === 8. Disable text selection ===
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    // === 9. DevTools detection (production) ===
    let devtoolsDetected = false;
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      if (widthDiff || heightDiff) {
        if (!devtoolsDetected) {
          devtoolsDetected = true;
          setBlocked(true);
          setBlockReason("Developer tools are not allowed on this platform.");
        }
      } else {
        devtoolsDetected = false;
      }
    };

    // === 10. Watermark overlay (deters recording — visible user identity) ===
    if (overlayRef.current) {
      const ts = new Date().toISOString().slice(0, 16);
      overlayRef.current.textContent = Array(50).fill(`ZenomiLearn • ${ts}`).join("   ");
    }

    document.addEventListener("contextmenu", noContext);
    document.addEventListener("keydown", noKeys);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("enterpictureinpicture", onPiP);

    let interval: NodeJS.Timeout | null = null;
    if (process.env.NODE_ENV === "production") {
      interval = setInterval(detectDevTools, 1000);
    }

    return () => {
      document.removeEventListener("contextmenu", noContext);
      document.removeEventListener("keydown", noKeys);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("enterpictureinpicture", onPiP);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      document.body.style.filter = "";
      if (interval) clearInterval(interval);
    };
  }, []);

  if (blocked) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-6">
        <p className="text-[#704180] text-lg text-center font-medium max-w-sm">
          {blockReason}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9998] pointer-events-none select-none overflow-hidden whitespace-nowrap leading-[3] text-[11px] tracking-widest break-all"
      style={{
        color: "rgba(112,65,128,0.03)",
        transform: "rotate(-25deg) scale(1.5)",
        transformOrigin: "center center",
      }}
    />
  );
}

function flashBlur() {
  document.body.style.filter = "blur(30px)";
  setTimeout(() => { document.body.style.filter = ""; }, 2000);
}
