/**
 * The seam between two sections: a thin lavender rule with a round arrow in
 * the middle that scrolls to the next section.
 */
export default function SectionDivider({ to, label }: { to: string; label: string }) {
  return (
    <div className="relative mx-auto flex max-w-[1360px] items-center gap-4 px-4 sm:px-8 lg:px-12 py-2">
      <span className="h-px flex-1 bg-gradient-to-r from-[#CDB8F2]/10 to-[#CDB8F2]/70" />
      <a
        href={`#${to}`}
        aria-label={label}
        className="zl-divider-arrow grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#CDB8F2]/80 bg-[#CDB8F2]/15 text-[#E4D8FB] transition-colors hover:bg-[#CDB8F2] hover:text-[#4B1336]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
      </a>
      <span className="h-px flex-1 bg-gradient-to-l from-[#CDB8F2]/10 to-[#CDB8F2]/70" />
    </div>
  );
}
