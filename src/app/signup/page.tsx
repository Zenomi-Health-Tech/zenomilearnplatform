"use client";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="bg-gray-50 py-16 px-4 min-h-[calc(100vh-112px)] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-gray-900">Zenomi</span><span className="text-[#704180]">Learn</span>
        </Link>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">Create an Account</h1>
        <p className="mt-1 text-sm text-gray-500 mb-6">Start your emotional wellness journey</p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-left">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input id="name" type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#704180] focus:border-transparent" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" type="email" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#704180] focus:border-transparent" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="password" type="password" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#704180] focus:border-transparent" />
          </div>
          <button type="submit" className="w-full bg-[#704180] text-white py-2.5 rounded-lg font-medium hover:bg-[#5a3468] transition-colors">
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#704180] font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
