import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MANIFEST_PATH = path.join(process.cwd(), "public", "scorm", "manifest.json");

export async function GET() {
  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    return NextResponse.json(manifest);
  } catch {
    return NextResponse.json({ error: "Manifest not found" }, { status: 404 });
  }
}
