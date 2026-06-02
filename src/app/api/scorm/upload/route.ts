import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

const SCORM_DIR = path.join(process.cwd(), "public", "scorm");
const MANIFEST_PATH = path.join(SCORM_DIR, "manifest.json");

function readManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
}

function writeManifest(data: Record<string, unknown>) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const week = formData.get("week") as string | null;

    if (!file || !week || !/^[1-6]$/.test(week)) {
      return NextResponse.json({ error: "Missing file or invalid week (1-6)" }, { status: 400 });
    }

    const weekDir = path.join(SCORM_DIR, `week-${week}`);

    // Clear existing content (keep .gitkeep)
    if (fs.existsSync(weekDir)) {
      for (const entry of fs.readdirSync(weekDir)) {
        if (entry === ".gitkeep") continue;
        fs.rmSync(path.join(weekDir, entry), { recursive: true, force: true });
      }
    } else {
      fs.mkdirSync(weekDir, { recursive: true });
    }

    // Extract zip
    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);
    zip.extractAllTo(weekDir, true);

    // Find entry point from imsmanifest.xml
    const manifestXml = path.join(weekDir, "imsmanifest.xml");
    let entryPoint = "index.html";
    if (fs.existsSync(manifestXml)) {
      const xml = fs.readFileSync(manifestXml, "utf-8");
      const hrefMatch = xml.match(/<resource[^>]*href="([^"]+)"/);
      if (hrefMatch) entryPoint = hrefMatch[1];
    }

    // Update manifest.json
    const manifest = readManifest();
    manifest.weeks[week] = {
      ...manifest.weeks[week],
      uploaded: true,
      entryPoint,
      uploadedAt: new Date().toISOString(),
    };
    writeManifest(manifest);

    return NextResponse.json({ success: true, week, entryPoint });
  } catch (e) {
    console.error("SCORM upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
