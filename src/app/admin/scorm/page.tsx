"use client";
import { useState, useCallback, useEffect } from "react";

interface WeekInfo {
  title: string;
  uploaded: boolean;
  entryPoint: string | null;
  uploadedAt?: string;
}

export default function AdminScormPage() {
  const [weeks, setWeeks] = useState<Record<string, WeekInfo>>({});
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchManifest = useCallback(async () => {
    const res = await fetch("/api/scorm/manifest");
    if (res.ok) {
      const data = await res.json();
      setWeeks(data.weeks || {});
    }
  }, []);

  useEffect(() => { fetchManifest(); }, [fetchManifest]);

  const upload = async (file: File) => {
    if (!file.name.endsWith(".zip")) {
      setMessage("Please upload a .zip file");
      return;
    }
    setUploading(true);
    setMessage("");
    const form = new FormData();
    form.append("file", file);
    form.append("week", selectedWeek);

    const res = await fetch("/api/scorm/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      setMessage(`✅ Week ${selectedWeek} uploaded! Entry: ${data.entryPoint}`);
      fetchManifest();
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [selectedWeek]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-serif text-gray-900 mb-1">SCORM Content Manager</h1>
        <p className="text-gray-500 text-sm mb-8">Upload and manage SCORM packages for each week</p>

        {/* Week selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Week</label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full max-w-xs"
          >
            {Object.entries(weeks).map(([num, w]) => (
              <option key={num} value={num}>
                Week {num}: {w.title} {w.uploaded ? "✅" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            dragOver ? "border-[#704180] bg-purple-50" : "border-gray-300 bg-white"
          }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input id="file-input" type="file" accept=".zip" onChange={onFileSelect} className="hidden" />
          <div className="text-4xl mb-3">📦</div>
          {uploading ? (
            <p className="text-[#704180] font-medium">Uploading & extracting...</p>
          ) : (
            <>
              <p className="text-gray-700 font-medium">Drag & drop SCORM .zip here</p>
              <p className="text-gray-400 text-sm mt-1">or click to browse</p>
            </>
          )}
        </div>

        {message && <p className="mt-3 text-sm">{message}</p>}

        {/* Status table */}
        <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Week</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(weeks).map(([num, w]) => (
                <tr key={num} className="border-t border-gray-100">
                  <td className="px-4 py-2">{num}</td>
                  <td className="px-4 py-2">{w.title}</td>
                  <td className="px-4 py-2">
                    {w.uploaded ? (
                      <span className="text-green-600 font-medium">✅ Ready</span>
                    ) : (
                      <span className="text-gray-400">Not uploaded</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-400">
                    {w.uploadedAt ? new Date(w.uploadedAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
