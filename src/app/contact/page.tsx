"use client";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-white py-10 sm:py-16 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#704180] text-center">Get In Touch</p>
        <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 text-center">Contact Us</h1>
        <p className="mt-3 text-gray-500 text-center text-sm sm:text-base">Have questions? We&apos;d love to hear from you.</p>

        {submitted ? (
          <div className="mt-10 text-center p-5 sm:p-8 bg-green-50 rounded-lg">
            <p className="text-green-700 font-semibold">Thank you! We&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="mt-10 space-y-5"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input id="name" type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#704180] focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="email" type="email" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#704180] focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="message" rows={5} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#704180] focus:border-transparent resize-none" />
            </div>
            <button type="submit" className="w-full bg-[#704180] text-white py-2.5 rounded-lg font-medium hover:bg-[#5a3468] transition-colors">
              Send Message
            </button>
          </form>
        )}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm">
          {[
            { icon: "📧", label: "Email", value: "support@zenomilearn.com" },
            { icon: "📞", label: "Phone", value: "+1 (555) 123-4567" },
            { icon: "📍", label: "Location", value: "San Francisco, CA" },
          ].map((c) => (
            <div key={c.label} className="p-4 border border-gray-200 rounded-lg">
              <span className="text-2xl">{c.icon}</span>
              <p className="mt-2 font-medium text-gray-900">{c.label}</p>
              <p className="text-gray-500">{c.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
