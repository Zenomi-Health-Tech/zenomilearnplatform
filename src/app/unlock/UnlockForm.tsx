"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { unlock } from "./actions";

/**
 * The code screen.
 *
 * The check runs on the server, so this page holds no code and reveals nothing
 * if someone reads the bundle. It only collects what the visitor types, hands
 * it over, and sends them where they were going.
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
      // A missing env var is a setup fault, not the visitor's mistake, and
      // saying "wrong code" would send them hunting for a typo that is not there.
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
    <main className="flex min-h-screen items-center justify-center bg-[#F7F4FB] px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#704180]/12 bg-white p-7 shadow-[0_10px_40px_-18px_rgba(112,65,128,0.35)] sm:p-9">
        <Image
          src="/images/zenomi-health-logo.png"
          alt="Zenomi Health"
          width={150}
          height={34}
          className="h-8 w-auto"
          priority
        />

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[#2A1430]">
          ZenomiLearn
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[#5B5266]">
          This preview is not public yet. Enter the code you were given to open it.
        </p>

        <form action={submit} className="mt-6">
          <label htmlFor="code" className="block text-sm font-medium text-[#2A1430]">
            Access code
          </label>
          <input
            id="code"
            name="code"
            autoFocus
            autoComplete="off"
            placeholder="Your code"
            className="mt-2 w-full rounded-xl border border-[#704180]/25 bg-white px-4 py-3 text-base uppercase tracking-[0.18em] text-[#2A1430] outline-none transition placeholder:tracking-normal placeholder:text-[#9B8AA3] focus:border-[#8B2D6C] focus:ring-2 focus:ring-[#8B2D6C]/20"
          />
          {error && <p className="mt-2 text-sm text-[#AF2451]">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full rounded-xl px-6 py-3.5 text-[15px] font-semibold text-white transition disabled:opacity-50"
            style={{ background: "linear-gradient(100deg,#704180,#8B2D6C 55%,#5B1A4E)" }}
          >
            {busy ? "Checking..." : "Open ZenomiLearn"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#9B8AA3]">
          Do not have a code? Email{" "}
          <a href="mailto:support@zenomihealth.com" className="text-[#8B2D6C] underline underline-offset-2">
            support@zenomihealth.com
          </a>
        </p>
      </div>
    </main>
  );
}
