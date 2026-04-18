"use client";
import { useEffect, useState } from "react";

export default function ContentProtection() {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    // === 1. Disable right-click ===
    const noContext = (e: MouseEvent) => e.preventDefault();

    // === 2. Disable keyboard shortcuts ===
    const noKeys = (e: KeyboardEvent) => {
      if (e.key === "F12") { e.preventDefault(); return; }
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      if (ctrl && shift && ["I","i","J","j","C","c"].includes(e.key)) { e.preventDefault(); return; }
      if (ctrl && (e.key === "u" || e.key === "U")) { e.preventDefault(); return; }
      if (ctrl && ["s","S","p","P"].includes(e.key)) { e.preventDefault(); return; }
      // PrintScreen - blur content and clear clipboard
      if (e.key === "PrintScreen") {
        e.preventDefault();
        navigator.clipboard.writeText("").catch(() => {});
        document.body.style.filter = "blur(30px)";
        setTimeout(() => { document.body.style.filter = ""; }, 1500);
        return;
      }
      // Windows Snipping Tool: Win+Shift+S
      if (e.metaKey && shift && (e.key === "s" || e.key === "S")) { e.preventDefault(); return; }
      // Mac screenshot: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
      if (e.metaKey && shift && ["3","4","5"].includes(e.key)) { e.preventDefault(); return; }
    };

    // === 3. Disable drag/copy/cut ===
    const noDrag = (e: DragEvent) => e.preventDefault();
    const noCopy = (e: ClipboardEvent) => e.preventDefault();

    // === 4. Screen capture detection via Permissions API ===
    const checkScreenCapture = async () => {
      try {
        // @ts-expect-error - display-capture is valid but not in all TS types
        const permStatus = await navigator.permissions.query({ name: "display-capture" });
        if (permStatus.state === "granted") {
          setBlocked(true);
        }
        permStatus.onchange = () => {
          if (permStatus.state === "granted") setBlocked(true);
        };
      } catch {
        // Not supported in all browsers - that's ok
      }
    };
    checkScreenCapture();

    // === 5. Visibility change detection - blur on tab switch (potential recording) ===
    const onVisibilityChange = () => {
      if (document.hidden) {
        document.body.style.filter = "blur(20px)";
      } else {
        document.body.style.filter = "";
      }
    };

    // === 6. Detect Picture-in-Picture (potential recording workaround) ===
    const onPiP = () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(() => {});
      }
    };

    // === 7. Disable text selection ===
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    // === 8. DevTools detection (production only) ===
    let devtoolsOpen = false;
    const detectDevTools = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      if (performance.now() - start > 100) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#704180;font-size:18px;">Developer tools are not allowed on this platform.</div>';
        }
      } else {
        devtoolsOpen = false;
      }
    };

    document.addEventListener("contextmenu", noContext);
    document.addEventListener("keydown", noKeys);
    document.addEventListener("dragstart", noDrag);
    document.addEventListener("copy", noCopy);
    document.addEventListener("cut", noCopy);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("enterpictureinpicture", onPiP);

    let interval: NodeJS.Timeout | null = null;
    if (process.env.NODE_ENV === "production") {
      interval = setInterval(detectDevTools, 3000);
    }

    return () => {
      document.removeEventListener("contextmenu", noContext);
      document.removeEventListener("keydown", noKeys);
      document.removeEventListener("dragstart", noDrag);
      document.removeEventListener("copy", noCopy);
      document.removeEventListener("cut", noCopy);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("enterpictureinpicture", onPiP);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      document.body.style.filter = "";
      if (interval) clearInterval(interval);
    };
  }, []);

  if (blocked) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-4">
        <p className="text-[#704180] text-lg text-center font-medium">
          Screen recording detected. Please stop recording to continue.
        </p>
      </div>
    );
  }

  return null;
}
