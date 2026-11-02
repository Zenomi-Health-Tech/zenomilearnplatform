"use client";
import Link from "next/link";

/**
 * ZenomiLearn has no accounts of its own.
 *
 * This page used to carry an email and password form whose submit handler was
 * preventDefault and nothing else, so the button never did anything. The teen
 * arrives from the Zenomi app already signed in, which is why there is nothing
 * to type here.
 */
export default function LoginPage() {
  return (
    <div className="bg-gray-50 py-10 sm:py-16 px-3 sm:px-4 min-h-[calc(100vh-112px)] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-8 text-center">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-gray-900">Zenomi</span>
          <span className="text-[#704180]">Learn</span>
        </Link>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">Open this from the Zenomi app</h1>
        <p className="mt-3 text-sm text-gray-500">
          Your courses open from the Zenomi app or your Zenomi account, so we already know it is
          you. We will send a code to the email on your account to let you in.
        </p>
      </div>
    </div>
  );
}
