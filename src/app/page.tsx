import Image from "next/image";

const weeks = [
  {
    week: 1, title: "Sleep Hygiene & Nutrition", color: "bg-[#704180]",
    bullets: [
      "Build a foundation for emotional well-being through better sleep and mindful nutrition.",
      "Learn practical habits for restful nights and fueling your body and mind.",
    ],
  },
  {
    week: 2, title: "What Are Emotions?", color: "bg-[#3d8b8b]",
    bullets: [
      "Understand the basics of emotions through five bite-sized micro lessons.",
      "Learn to recognize, name, and understand what emotions really are and why we have them.",
    ],
  },
  {
    week: 3, title: "What is Empathy?", color: "bg-[#4a9e6e]",
    bullets: [
      "Discover the power of empathy—understanding and sharing the feelings of others.",
      "Practice perspective-taking and learn how empathy strengthens relationships.",
    ],
  },
  {
    week: 4, title: "Self-Awareness", color: "bg-[#4a9e6e]",
    bullets: [
      "Develop a deeper understanding of yourself—your thoughts, feelings, and behaviors.",
      "Learn to recognize patterns and understand your unique emotional landscape.",
    ],
  },
  {
    week: 5, title: "Self-Regulation", color: "bg-[#c46b7c]",
    bullets: [
      "Master techniques to manage your emotions and impulses effectively.",
      "Build a toolkit of strategies to calm down, think clearly, and respond thoughtfully.",
    ],
  },
  {
    week: 6, title: "Building Resilience", color: "bg-[#c4873a]",
    bullets: [
      "Strengthen your ability to bounce back from challenges.",
      "Create a personal plan for handling stress, setbacks, and growing stronger through adversity.",
    ],
  },
];

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="80" height="24" viewBox="0 0 80 24" fill="none" className="text-gray-400">
      {direction === "right" ? (
        <>
          <line x1="0" y1="12" x2="70" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <polyline points="62,6 70,12 62,18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          <line x1="10" y1="12" x2="80" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <polyline points="18,6 10,12 18,18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </>
      )}
    </svg>
  );
}

function WeekCard({ w }: { w: (typeof weeks)[0] }) {
  return (
    <div className="flex">
      <div className={`${w.color} text-white flex flex-col items-center justify-center w-14 sm:w-16 shrink-0 rounded-l-lg`}>
        <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase">Week</span>
        <span className="text-2xl sm:text-3xl font-bold">{w.week}</span>
      </div>
      <div className="border border-l-0 border-gray-200 rounded-r-lg p-4 sm:p-5 flex-1">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{w.title}</h3>
        <ul className="space-y-2">
          {w.bullets.map((b, j) => (
            <li key={j} className="text-gray-600 text-sm leading-relaxed flex gap-2">
              <span className="mt-0.5 shrink-0">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-12 sm:pt-16 pb-8 sm:pb-10 text-center px-4">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#704180]">
          6-Week Course
        </p>
        <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-gray-900 leading-tight">
          Emotional Regulation for Teens
        </h1>
        <p className="mt-3 sm:mt-4 text-gray-500 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
          A guided journey to understanding, managing, and thriving with your emotions.
        </p>
      </section>

      {/* Week Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-16 sm:pb-20 space-y-3">
        {weeks.map((w, i) => {
          const hasImages = i === 0 || i === 2;
          const hasArrows = i === 1 || i === 3;

          return (
            <div key={w.week} className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-4 items-center">
              {/* Left side */}
              <div className="hidden lg:flex items-center justify-center">
                {hasImages && (
                  <Image
                    src={i === 0 ? "/images/1.png" : "/images/2.png"}
                    alt="Course illustration"
                    width={200}
                    height={170}
                    className="rounded-lg object-cover"
                  />
                )}
                {hasArrows && <Arrow direction="right" />}
              </div>

              {/* Center: week card */}
              <WeekCard w={w} />

              {/* Right side */}
              <div className="hidden lg:flex items-center justify-center">
                {hasImages && (
                  <Image
                    src="/images/3.png"
                    alt="Course illustration"
                    width={200}
                    height={170}
                    className="rounded-lg object-cover"
                  />
                )}
                {hasArrows && <Arrow direction="left" />}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
