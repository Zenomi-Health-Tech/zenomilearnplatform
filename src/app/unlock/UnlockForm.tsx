"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLockup from "@/components/BrandLockup";
import { unlock } from "./actions";

/**
 * The code screen.
 *
 * Set on the plum the rest of ZenomiLearn uses for its dark sections, with the
 * same lockup the hero carries, so the first thing a client sees belongs to the
 * site rather than looking like a login bolted on front.
 *
 * The check runs on the server, so this page holds no code and reveals nothing
 * to anyone reading the bundle. It collects what is typed, hands it over, and
 * sends the visitor where they were going.
 */
export default function UnlockForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(formData: FormData) {
    setBusy(true);
    setError("");
    const res = await unlock(formData);
    setBusy(false);
    if (!res.ok) {
      // An unreachable API is not the visitor's mistake, and calling it a wrong
      // code sends them hunting for a typo that is not there.
      return setError(
        res.reason === "unavailable"
          ? "We cannot check that right now. Please try again in a moment."
          : "That code is not right. Please check and try again."
      );
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 font-[family-name:var(--font-poppins)]">
      {/* The ground the ZenomiLearn hero itself sits on: the brand band, the
          indigo light it carries over its top right, and its two blobs. Same
          classes the home page uses, so the two cannot drift apart. */}
      <div aria-hidden className="zl-brandband absolute inset-0 -z-10" />
      <div aria-hidden className="zl-hero pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="zl-blob zl-blob-a" />
        <span className="zl-blob zl-blob-b" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/[0.10] p-7 shadow-[0_30px_80px_-40px_rgba(28,6,24,0.9)] backdrop-blur-xl sm:p-9">
        <BrandLockup boxed />

        <h1 className="mt-7 text-2xl tracking-tight text-white sm:text-[28px]">
          Zenomi{" "}
          <span className="font-[family-name:var(--font-fraunces)] italic font-medium text-[#FFC2DD]">
            Learn
          </span>
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-white/60">
          This preview is not public yet. Enter the code you were given to open it.
        </p>

        <form action={submit} className="mt-7">
          <label htmlFor="code" className="block text-[13px] font-medium text-white/70">
            Access code
          </label>
          <input
            id="code"
            name="code"
            autoFocus
            autoComplete="off"
            placeholder="Your code"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-base uppercase tracking-[0.2em] text-white outline-none transition placeholder:tracking-normal placeholder:text-white/30 focus:border-[#CDB8F2]/60 focus:bg-white/[0.08]"
          />
          {error && <p className="mt-2.5 text-sm text-[#FF9BBE]">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="zl-btn-light mt-6 w-full rounded-xl px-6 py-3.5 text-[15px] font-semibold transition disabled:opacity-60"
          >
            {busy ? "Checking..." : "Open Zenomi Learn"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Do not have a code? Email{" "}
          <a
            href="mailto:support@zenomihealth.com"
            className="text-[#CDB8F2] underline underline-offset-2 hover:text-white"
          >
            support@zenomihealth.com
          </a>
        </p>
      </div>
    </main>
  );
}
