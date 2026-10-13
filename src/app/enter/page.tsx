"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sendLearnCode, verifyLearnCode, setToken } from "@/lib/api";

/**
 * The way into ZenomiLearn.
 *
 * Deliberately not a login form. The teen arrives from the app or the user
 * portal already signed in, carrying a one time token in the URL, so there is
 * nothing to ask them: no address, no password. The code goes to the address on
 * their account, which is what makes a forwarded link useless to anyone else.
 */
function Enter() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("t") ?? "";
  const next = params.get("next") ?? "/courses";

  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const asked = useRef(false);

  // React runs effects twice in development, and sending two codes would
  // invalidate the first one the teen receives.
  useEffect(() => {
    if (!token || asked.current) return;
    asked.current = true;
    setBusy(true);
    sendLearnCode(token)
      .then(({ ok, body }) => {
        if (ok) setSentTo(String((body.data as any)?.sentTo ?? "your registered email"));
        else setError(String(body.message ?? "This link has expired."));
      })
      .catch(() => setError("Could not reach Zenomi. Check your connection and try again."))
      .finally(() => setBusy(false));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { ok, body } = await verifyLearnCode(token, code.trim());
    setBusy(false);
    if (!ok) {
      setError(String(body.message ?? "That code is not right."));
      return;
    }
    setToken(String((body.data as any)?.token ?? ""));
    router.replace(next);
  };

  const shell = (children: React.ReactNode) => (
    <div className="bg-gray-50 py-10 sm:py-16 px-3 sm:px-4 min-h-[calc(100vh-112px)] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-8">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gray-900">Zenomi</span>
            <span className="text-[#704180]">Learn</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );

  if (!token) {
    return shell(
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900">Open this from the Zenomi app</h1>
        <p className="mt-2 text-sm text-gray-500">
          Opening ZenomiLearn from your Zenomi app or your Zenomi account lets us keep your
          progress with the rest of your Zenomi account.
        </p>
        <Link
          href="/courses"
          className="mt-6 inline-block rounded-full bg-[#704180] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Browse the courses
        </Link>
      </div>,
    );
  }

  return shell(
    <>
      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Check your email</h1>
        <p className="mt-1 text-sm text-gray-500">
          {sentTo ? (
            <>
              We sent a code to <span className="font-medium text-gray-700">{sentTo}</span>.
            </>
          ) : (
            "Sending you a code..."
          )}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Code
          </label>
          <input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-center text-lg tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#704180] focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || code.length < 4}
          className="w-full rounded-lg bg-[#704180] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Checking..." : "Continue"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-gray-400">
        The code goes to the email on your Zenomi account, so a link shared with someone else will
        not let them in.
      </p>
    </>,
  );
}

export default function EnterPage() {
  return (
    <Suspense fallback={null}>
      <Enter />
    </Suspense>
  );
}
