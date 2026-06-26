import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude SCORM week content (255MB) from the upload function bundle —
  // the week-* directories are served as static CDN assets, not needed
  // inside the function. manifest.json is intentionally NOT excluded so
  // the manifest API can read it at runtime on Vercel.
  outputFileTracingExcludes: {
    "/api/scorm/upload": ["./public/scorm/week-*/**"],
  },
};

export default nextConfig;
