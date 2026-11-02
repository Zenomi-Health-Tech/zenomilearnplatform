import type { Metadata } from "next";
import Link from "next/link";
import SessionPlayer from "./SessionPlayer";

export const metadata: Metadata = {
  title: "The double breath | Zenomi mindfulness",
  description:
    "A guided breathing session. Three rounds of the double breath, about forty five seconds.",
};

export default function DoubleBreathPage() {
  return (
    <div className="bg-white px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#704180]">
          <span>Mindfulness</span>
          <span className="text-gray-300">&middot;</span>
          <span className="text-gray-400">Breathing</span>
        </div>
        <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl leading-tight text-gray-900 sm:text-4xl">
          The double breath
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-gray-600">
          Three rounds, about forty five seconds. Press play and follow the orb. Nothing to read while it
          runs.
        </p>

        <div className="mt-7">
          <SessionPlayer />
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 px-5 py-4">
          <p className="text-sm text-gray-600">
            New to this one?{" "}
            <Link href="/lessons/come-back-down" className="font-semibold text-[#704180] hover:underline">
              Take the microlesson first
            </Link>{" "}
            to learn what it is doing and why it works.
          </p>
        </div>

        <footer className="mt-6 rounded-2xl border border-gray-200 px-5 py-4 text-xs leading-relaxed text-gray-500">
          <p>
            <span className="font-semibold text-[#AF2451]">Zenomi Health is a technology platform.</span> It
            does not provide medical advice, diagnosis or treatment, and nothing here creates a provider and
            patient relationship. For any clinical concern, please speak to a licensed professional.
          </p>
        </footer>
      </div>
    </div>
  );
}
