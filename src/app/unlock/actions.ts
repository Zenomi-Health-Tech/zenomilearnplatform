"use server";
import { cookies } from "next/headers";

/**
 * Checking the access code.
 *
 * The code is not held here and not in a hosting variable either. The backend
 * owns it, so it can be rotated, revoked or expired without redeploying this
 * site, and several can exist at once: one per client, which is what makes it
 * possible to withdraw one preview without disturbing the others.
 *
 * No weaker than keeping it in the environment. The code still never reaches a
 * browser; the visitor types it, this server forwards it, and the answer is
 * yes or no.
 *
 * The trade is a dependency: if the API cannot be reached, nobody gets in. It
 * fails closed and says so, rather than opening the site or leaving someone
 * staring at a form that silently does nothing.
 */
const API =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://zenomi.elitceler.com/api/v1";

export async function unlock(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) return { ok: false, reason: "wrong" as const };

  try {
    const res = await fetch(`${API}/access/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: "zenomilearn", code }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (res.status === 401) return { ok: false, reason: "wrong" as const };
    if (!res.ok) return { ok: false, reason: "unavailable" as const };

    const data = await res.json();
    if (!data?.ok) return { ok: false, reason: "wrong" as const };
  } catch {
    return { ok: false, reason: "unavailable" as const };
  }

  (await cookies()).set("zl_unlocked", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return { ok: true as const };
}
