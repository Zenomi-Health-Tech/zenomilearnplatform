/**
 * The Zenomi Health lockup as the Zenomi Matters newsletter sets it: the white
 * Z mark, a thin divider, the name, and the line "Transforming Teen Emotional
 * Health" underneath. `boxed` puts it on the newsletter's plum panel, for
 * light backgrounds; without it, it sits straight on the plum hero.
 */
export default function BrandLockup({ boxed = false }: { boxed?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-3 sm:gap-4 ${boxed ? "rounded-2xl border border-[#A0558A]/60 px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_10px_24px_-14px_rgba(75,19,54,0.6)]" : ""}`}
      style={boxed ? { background: "linear-gradient(120deg, #671E56, #511646)" } : undefined}
    >
      <img src="/images/zenomi-mark.png" alt="" className="h-7 sm:h-9 w-auto brightness-0 invert" />
      <span aria-hidden className="h-8 sm:h-10 w-px bg-white/35" />
      <span className="text-left leading-tight">
        <span className="block text-[17px] sm:text-[20px] font-medium text-white">Zenomi Health</span>
        <span className="block text-[11px] sm:text-[12.5px] tracking-[0.02em] text-[#F4D3E6]">Transforming Teen Emotional Health</span>
      </span>
    </span>
  );
}
