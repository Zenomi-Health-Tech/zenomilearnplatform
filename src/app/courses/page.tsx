import Link from "next/link";

const courses = [
  { title: "Emotional Regulation for Teens", weeks: 6, level: "Beginner", color: "bg-[#704180]", desc: "A guided journey to understanding, managing, and thriving with your emotions." },
  { title: "Mindfulness & Meditation", weeks: 4, level: "All Levels", color: "bg-[#3d8b8b]", desc: "Learn to be present, reduce stress, and cultivate inner peace through daily practice." },
  { title: "Building Healthy Relationships", weeks: 5, level: "Intermediate", color: "bg-[#4a9e6e]", desc: "Develop communication skills and learn to build meaningful connections." },
  { title: "Stress Management Toolkit", weeks: 3, level: "Beginner", color: "bg-[#c46b7c]", desc: "Practical strategies for managing stress in school, work, and daily life." },
  { title: "Confidence & Self-Esteem", weeks: 4, level: "Beginner", color: "bg-[#c4873a]", desc: "Build unshakeable confidence and a positive self-image." },
  { title: "Anger Management for Teens", weeks: 4, level: "All Levels", color: "bg-[#704180]", desc: "Understand anger triggers and learn healthy ways to express and manage anger." },
];

export default function CoursesPage() {
  return (
    <div className="bg-white py-12 sm:py-16 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#704180] text-center">Our Programs</p>
        <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 text-center">Courses</h1>
        <p className="mt-3 text-gray-500 text-center max-w-lg mx-auto">Explore our curated programs designed to support teen emotional wellness.</p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.title} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className={`${c.color} h-3`} />
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>{c.weeks} Weeks</span>
                  <span>•</span>
                  <span>{c.level}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{c.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{c.desc}</p>
                <Link href="/" className="mt-4 inline-block text-sm text-[#704180] font-medium hover:underline">
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
