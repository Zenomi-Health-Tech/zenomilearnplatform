/**
 * The page foot. Transparent with white text, so it sits on the same dark
 * gradient as the sections above it; pass `light` on a light page.
 */
export default function LearnFooter({ light = false }: { light?: boolean }) {
  return (
    <footer className={light ? "border-t border-[#84306C]/10 bg-white" : "mt-auto border-t border-white/15"}>
      <div className={`max-w-[1120px] mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-[13px] ${light ? "text-[#5B4560]" : "text-white/70"}`}>
        <span>© Zenomi Health</span>
        <span className={`font-semibold ${light ? "text-[#84306C]" : "text-white"}`}>ZenomiLearn</span>
      </div>
    </footer>
  );
}
