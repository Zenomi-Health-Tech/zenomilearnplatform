"use server";
import { cookies } from "next/headers";
import { timingSafeEqual, createHash } from "crypto";

/**
 * Checking the access code.
 *
 * The code is NOT in this file, and must not be. This repository is public, so
 * a literal here is readable by anyone and the gate becomes decorative. It is
 * read from the environment instead and set in the hosting dashboard.
 *
 * If the variable is missing the gate refuses everything rather than falling
 * back to a default. A forgotten env var should lock the door, not leave it
 * open.
 */
const COOKIE = "zl_unlocked";

/** Typed on a phone or read down a line: spacing and case do not matter. */
const normalise = (s: string) => s.replace(/[^a-z0-9]/gi, "").toUpperCase();

/** Compared on equal-length digests, so the check cannot be timed. */
const sameCode = (a: string, b: string) => {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
};

export async function unlock(formData: FormData) {
  const expected = process.env.ZL_ACCESS_CODE;
  if (!expected) return { ok: false, reason: "unconfigured" as const };

  // A brute force over a random code is already impractical; this makes a
  // scripted attempt slow enough to be pointless as well.
  await new Promise((r) => setTimeout(r, 400));

  const given = normalise(String(formData.get("code") ?? ""));
  if (!given || !sameCode(given, normalise(expected))) return { ok: false, reason: "wrong" as const };

  (await cookies()).set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return { ok: true as const };
}
