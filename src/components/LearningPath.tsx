import JaneyPath from "./JaneyPath";

type Tab = "lessons" | "interactive";

/**
 * "Here's your learning path": Janey between the two halves of ZenomiLearn,
 * with arrows from each into "Both work great together". The two boxes are
 * also the switch between the Lessons and Interactive Learning lists below.
 */

function Arrow({ flip = false }: { flip?: boolean }) {
  // From the bottom of a box, down and round into the side of the bar.
  return (
    <svg viewBox="0 0 200 90" preserveAspectRatio="none" className={`h-full w-full text-white/85 ${flip ? "-scale-x-100" : ""}`} aria-hidden>
      <path d="M40 0 C40 58 70 74 190 74" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M178 63 L194 74 L178 85" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Box({ active, onClick, children, cta }: { active: boolean; onClick: () => void; children: React.ReactNode; cta: string }) {
  // The whole box is one button; the pill at its foot says what it does.
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex h-full min-h-[290px] w-full flex-col rounded-2xl border px-7 py-7 text-left backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 ${
        active
          ? "border-white/50 bg-[#2A0F24]/40 shadow-[0_18px_40px_-20px_rgba(20,0,30,0.8)]"
          : "border-white/25 bg-[#2A0F24]/30 hover:border-white/50 hover:bg-[#2A0F24]/40"
      }`}
    >
      <span className="block pb-6">{children}</span>
      <span
        className={`mt-auto inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
          "bg-white text-[#4B1336]"
        }`}
      >
        {cta}
        <span aria-hidden className="transition-transform group-hover:translate-y-0.5">↓</span>
      </span>
    </button>
  );
}

export default function LearningPath({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  // Pick the list, then take the reader down to it.
  const go = (t: Tab) => {
    setTab(t);
    requestAnimationFrame(() => document.getElementById("learn")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const lessons = (
    <Box active={tab === "lessons"} onClick={() => go("lessons")} cta="View lessons">
      <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#FFC2DD]">Learn</span>
      <span className="mt-1 block text-[24px] sm:text-[27px] font-light leading-tight text-white">Interactive <span className="font-[family-name:var(--font-fraunces)] italic font-medium text-[#FFC2DD]">lessons</span></span>
      <span className="mt-2 block text-[15px] leading-relaxed text-white/85">Short weekly lessons that build the skills.</span>
      <span className="mt-3 flex flex-wrap gap-2">
        {["Sleep", "Nutrition", "Emotional Regulation"].map((t) => (
          <span key={t} className="rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-[#6B1B4F]">{t}</span>
        ))}
      </span>
    </Box>
  );
  const scenarios = (
    <Box active={tab === "interactive"} onClick={() => go("interactive")} cta="Explore scenarios">
      <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#D9CCFF]">Practice</span>
      <span className="mt-1 block text-[24px] sm:text-[27px] font-light leading-tight text-white">Everyday <span className="font-[family-name:var(--font-fraunces)] italic font-medium text-[#D9CCFF]">scenarios</span></span>
      <span className="mt-2 block text-[15px] leading-relaxed text-white/85">Real moments that stress you, and what helps them.</span>
      <span className="mt-3 flex flex-wrap gap-2">
        {["Short stories", "Mindfulness audio", "School and home"].map((t) => (
          <span key={t} className="rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-[#4A2A9E]">{t}</span>
        ))}
      </span>
    </Box>
  );

  return (
    <section>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* desktop: boxes either side of Janey, arrows into the bar */}
        <div className="hidden lg:grid grid-cols-[1fr_420px_1fr] items-stretch gap-x-6">
          <div className="self-center h-[310px]">{lessons}</div>
          <JaneyPath className="z-10" />
          <div className="self-center h-[310px]">{scenarios}</div>
          <div className="h-[80px] pl-[18%]"><Arrow /></div>
          <div className="h-[80px] pt-[30px]">
            <span className="block rounded-xl bg-white py-3.5 text-center text-[23px] font-light text-[#411649] whitespace-nowrap shadow-[0_14px_30px_-16px_rgba(20,0,30,0.7)]">Both work great <span className="font-[family-name:var(--font-fraunces)] italic font-medium text-[#84306C]">together</span></span>
          </div>
          <div className="h-[80px] pr-[18%]"><Arrow flip /></div>
        </div>

        {/* phones and tablets: stacked */}
        <div className="lg:hidden">
          <JaneyPath className="mx-auto w-full max-w-[460px]" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {lessons}
            {scenarios}
          </div>
          <p className="mt-4 rounded-xl bg-white px-5 py-3 text-center text-[17px] font-semibold text-[#411649]">Both work great together</p>
        </div>
      </div>
    </section>
  );
}
