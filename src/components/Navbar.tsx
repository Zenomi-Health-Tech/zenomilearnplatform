"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#2d2d2d] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <Link href="/" className="text-xl font-bold">
          <span className="text-white">Zun</span>
          <span className="text-[#704180]">day</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-gray-300 hover:text-white text-sm transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="px-4 py-1.5 rounded bg-[#704180] text-white text-sm hover:bg-[#8F59A8] transition-colors">
            Login
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white" aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-700 px-4 pb-3 space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-gray-300 hover:text-white text-sm">
              {l.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="block py-2 text-[#704180] font-medium text-sm">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
