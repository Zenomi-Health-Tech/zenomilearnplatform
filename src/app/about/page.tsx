export default function AboutPage() {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#704180] text-center">Who We Are</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-serif text-gray-900 text-center">About Zunday</h1>
        <p className="mt-6 text-gray-600 leading-relaxed text-center">
          Zunday is dedicated to empowering teens with the emotional tools they need to thrive. Our programs are designed by mental health professionals and educators who understand the unique challenges young people face today.
        </p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { num: "10,000+", label: "Students Enrolled" },
            { num: "50+", label: "Expert Instructors" },
            { num: "95%", label: "Completion Rate" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-[#704180]">{s.num}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">To make emotional wellness education accessible to every teen, helping them build resilience, empathy, and self-awareness for a healthier future.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Our Approach</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">We combine evidence-based techniques with engaging, bite-sized lessons that fit into busy teen lives. Each course is structured as a guided weekly journey with practical exercises and real-world applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
