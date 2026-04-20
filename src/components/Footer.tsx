import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2d2d2d] text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        <div className="col-span-2 sm:col-span-1">
          <span className="text-lg font-bold"><span className="text-white">Zenomi</span><span className="text-[#704180]">Learn</span></span>
          <p className="text-xs sm:text-sm mt-1">Empowering teens with emotional wellness education.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">Links</h4>
          <ul className="space-y-1">
            {["/", "/courses", "/about", "/contact"].map((h) => (
              <li key={h}><Link href={h} className="hover:text-white transition-colors">{h === "/" ? "Home" : h.slice(1).charAt(0).toUpperCase() + h.slice(2)}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">Programs</h4>
          <ul className="space-y-1">
            {["Emotional Regulation", "Teen Wellness", "Mindfulness", "Resilience"].map((p) => (
              <li key={p}><span className="hover:text-white cursor-pointer">{p}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">Contact</h4>
          <p className="break-all sm:break-normal text-xs sm:text-sm">support@zenomilearn.com</p>
          <p className="mt-1">+1 (555) 123-4567</p>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-xs">
        &copy; {new Date().getFullYear()} ZenomiLearn. All rights reserved.
      </div>
    </footer>
  );
}
