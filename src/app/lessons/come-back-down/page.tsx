import type { Metadata } from "next";
import LessonDeck from "./LessonDeck";

export const metadata: Metadata = {
  title: "Come back down | ZenomiLearn microlesson",
  description:
    "A microlesson on the double breath: what stress does to your body, the technique, and when to reach for it.",
};

export default function ComeBackDownPage() {
  return (
    <div className="bg-white px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#704180]">
          <span>Microlesson</span>
          <span className="text-gray-300">&middot;</span>
          <span className="text-gray-400">Emotional skills</span>
        </div>
        <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl leading-tight text-gray-900 sm:text-4xl">
          Come back down
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-gray-600">
          Five steps and a quick check. About three minutes.
        </p>

        <div className="mt-8">
          <LessonDeck />
        </div>

        <footer className="mt-8 rounded-2xl border border-gray-200 px-5 py-4 text-xs leading-relaxed text-gray-500">
          <p>
            <span className="font-semibold text-[#AF2451]">Where this comes from.</span> The double breath
            is also called a physiological sigh, and your body already does it when you sob or just before
            you fall asleep. In a 2023 Stanford study in Cell Reports Medicine, a few minutes a day of it
            improved mood and lowered breathing rate more than the same few minutes of sitting meditation.
            One evidence informed activity among many.
          </p>
          <p className="mt-2">
            <span className="font-semibold text-[#AF2451]">Zenomi Health is a technology platform.</span> It
            does not provide medical advice, diagnosis or treatment, and nothing here creates a provider and
            patient relationship. For any clinical concern, please speak to a licensed professional.
          </p>
        </footer>
      </div>
    </div>
  );
}
