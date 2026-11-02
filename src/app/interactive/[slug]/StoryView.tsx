"use client";

import Link from "next/link";
import { useRef } from "react";
import LearnFooter from "@/components/LearnFooter";
import BrandLockup from "@/components/BrandLockup";
import OrbAudioPlayer from "@/components/OrbAudioPlayer";
import { categories, sessions, stories } from "@/data/scenarios";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function StoryView({ n }: { n: number }) {
  const i = stories.findIndex((s) => s.n === n);
  const s = stories[i];
  const v = s.video!;
  const session = sessions[s.session];
  const prev = stories[i - 1];
  const next = stories[i + 1];

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sessionRef = useRef<HTMLElement>(null);

  // From the story to the session: the button under the video, and the end of
  // the video itself, both bring the mindfulness player into view.
  const toSession = () => {
    videoRef.current?.pause();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    sessionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="zl font-[family-name:var(--font-poppins)] bg-[#FBF7FC] min-h-screen">

      <main className="max-w-[880px] mx-auto px-4 sm:px-6 pt-5 sm:pt-6 pb-20">
        <Link href="/" aria-label="Zenomi Health home" className="inline-block">
          <BrandLockup boxed />
        </Link>
        <Link href="/?tab=interactive#learn" className="mt-6 flex w-fit items-center gap-1.5 text-[14px] font-semibold text-[#84306C] hover:underline">
          ← Interactive Learning
        </Link>

        <div className="zl-panel mt-5">
          <p className="text-[13px] font-medium text-[#84306C]">
            Story {i + 1} of {stories.length} · {categories.find((c) => c.id === s.category)!.label}
          </p>
          <h1 className="mt-1.5 text-[28px] sm:text-[36px] font-semibold leading-tight tracking-tight text-[#2A0F24]">{v.title}</h1>
          <p className="mt-2 max-w-[640px] text-[16px] leading-relaxed text-[#5B4560]">{s.text}</p>
        </div>

        {/* Step 1 */}
        <section className="mt-8">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-7 h-7 rounded-full bg-[#84306C] text-white text-[13px] font-semibold">1</span>
            <h2 className="text-[18px] font-semibold text-[#2A0F24]">Watch the story</h2>
            <span className="text-[13px] text-[#5B4560]">{clock(v.seconds)}</span>
          </div>
          <video
            ref={videoRef}
            src={v.src}
            poster={v.poster}
            controls
            playsInline
            controlsList="nodownload"
            onPlay={() => audioRef.current?.pause()}
            onEnded={toSession}
            className="mt-4 w-full aspect-video rounded-2xl bg-black shadow-[0_20px_50px_-28px_rgba(42,15,36,0.6)]"
          />
          <button
            type="button"
            onClick={toSession}
            className="zl-next mt-4 flex w-full items-center gap-3 rounded-2xl border border-[#5A3CBE]/20 bg-[#EFE8FA] px-4 py-3 text-left transition-colors hover:bg-[#E6DCF8]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#5A3CBE] text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" /></svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold text-[#2A0F24]">Next: listen to the mindfulness session</span>
              <span className="block text-[13px] text-[#5B4560]">{session.title} · {Math.round(session.seconds / 60)} min</span>
            </span>
            <span className="zl-bob grid h-8 w-8 place-items-center rounded-full bg-white text-[#5A3CBE]" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
            </span>
          </button>
        </section>

        {/* Step 2 */}
        <section ref={sessionRef} className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-7 h-7 rounded-full bg-[#84306C] text-white text-[13px] font-semibold">2</span>
            <h2 className="text-[18px] font-semibold text-[#2A0F24]">Try the session</h2>
            <span className="text-[13px] text-[#5B4560]">{Math.round(session.seconds / 60)} min</span>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-[#5B4560]">{s.why}</p>
          <div className="mt-4">
            <OrbAudioPlayer session={session} audioRef={audioRef} onPlay={() => videoRef.current?.pause()} />
          </div>
        </section>

        {/* More stories */}
        <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prev ? (
            <Link href={`/interactive/${prev.video!.slug}`} className="zl-story flex items-center gap-3 rounded-2xl border border-[#84306C]/10 bg-white p-3">
              <img src={prev.video!.poster} alt="" className="w-24 aspect-video rounded-lg object-cover" />
              <span className="min-w-0">
                <span className="block text-[12px] text-[#5B4560]">← Previous story</span>
                <span className="block text-[14px] font-semibold leading-snug text-[#2A0F24]">{prev.video!.title}</span>
              </span>
            </Link>
          ) : <span className="hidden sm:block" />}
          {next && (
            <Link href={`/interactive/${next.video!.slug}`} className="zl-story flex items-center gap-3 rounded-2xl border border-[#84306C]/10 bg-white p-3 sm:flex-row-reverse sm:text-right">
              <img src={next.video!.poster} alt="" className="w-24 aspect-video rounded-lg object-cover" />
              <span className="min-w-0">
                <span className="block text-[12px] text-[#5B4560]">Next story →</span>
                <span className="block text-[14px] font-semibold leading-snug text-[#2A0F24]">{next.video!.title}</span>
              </span>
            </Link>
          )}
        </nav>
      </main>
      <LearnFooter light />
    </div>
  );
}
