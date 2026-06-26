import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude SCORM content (255MB of static files served via CDN) from
  // serverless function bundles — otherwise the upload function exceeds
  // Vercel's 250MB uncompressed limit.
  outputFileTracingExcludes: {
    "/api/scorm/upload": ["./public/scorm/**"],
    "/api/scorm/manifest": ["./public/scorm/**"],
  },
};

export default nextConfig;
