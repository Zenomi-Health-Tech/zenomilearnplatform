import { NextRequest, NextResponse } from "next/server";

/**
 * A code in front of the whole site.
 *
 * The link gets shared before the work is public, so the gate has to hold even
 * when the URL is known. That is why this runs in middleware rather than in the
 * browser: a client side gate still ships every page to whoever asks and only
 * hides it with JavaScript. Here the server simply does not serve the page
 * without the cookie.
 *
 * Deliberately a soft gate for sharing, not authentication. Anyone with the
 * code is in, and that is the intent.
 */
const COOKIE = "zl_unlocked";

/**
 * Open regardless, or the gate cannot render and the site cannot style itself.
 *
 * Note these are the media folders under public/interactive, not the
 * /interactive/[slug] route. Opening the bare "/interactive" prefix left every
 * scenario story reachable without a code, which is precisely the content this
 * gate exists to hold back.
 */
const OPEN = [
  "/unlock",
  "/_next",
  "/images",
  "/favicon",
  "/icon",
  "/interactive/audio",
  "/interactive/video",
  "/interactive/poster",
];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (OPEN.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (req.cookies.get(COOKIE)?.value === "1") return NextResponse.next();

  // Remember where they were headed so the code screen can return them to it.
  const to = req.nextUrl.clone();
  to.pathname = "/unlock";
  to.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(to);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
