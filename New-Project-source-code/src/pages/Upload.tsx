import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { MAX_UPLOAD_SIZE_MB } from "../constants/config";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export default function Upload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = useCallback((f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) return "Unsupported file type. Please upload a JPG or PNG image.";
    if (f.size > MAX_SIZE_BYTES) return `File is too large. Maximum size is ${MAX_UPLOAD_SIZE_MB}MB.`;
    return null;
  }, []);

  const handleFile = useCallback((f: File) => {
    setError(null);
    const validationError = validateFile(f);
    if (validationError) { setError(validationError); setFile(null); setPreviewUrl(null); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }, [validateFile, previewUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleBrowse = () => fileInputRef.current?.click();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };
  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null); setPreviewUrl(null); setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setIsUploading(true); setError(null);
    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const filePath = `originals/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw new Error(uploadError.message);
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;
      const { data: prediction, error: insertError } = await supabase.from("predictions").insert({
        user_id: user.id, original_image_url: imageUrl, original_file_path: filePath, status: "processing",
      }).select("id").single();
      if (insertError) throw new Error(insertError.message);
      navigate(`/predicting/${prediction.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)]" style={{ background: "#0F172A" }}>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA" }}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            New Analysis
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
            Upload Image
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#64748B" }}>
            Select a satellite or drone image of a flooded region for AI analysis.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 flex items-start gap-3 rounded-xl p-4 text-sm"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}
          >
            <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        {!previewUrl ? (
          /* ── Drop zone ── */
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload an image file"
            onClick={handleBrowse}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleBrowse(); } }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="relative cursor-pointer"
            style={{
              border: `2px dashed ${isDragging ? "#3B82F6" : "rgba(59,130,246,0.25)"}`,
              borderRadius: "20px",
              background: isDragging
                ? "rgba(59,130,246,0.07)"
                : "rgba(15,23,42,0.5)",
              transition: "all 0.2s",
              boxShadow: isDragging ? "0 0 40px rgba(59,130,246,0.15), inset 0 0 40px rgba(59,130,246,0.05)" : "none",
              transform: isDragging ? "scale(1.01)" : "scale(1)",
            }}
          >
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
              {/* Upload icon */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-200"
                style={{
                  background: isDragging ? "rgba(59,130,246,0.15)" : "rgba(30,41,59,0.8)",
                  border: `1px solid ${isDragging ? "rgba(59,130,246,0.5)" : "rgba(59,130,246,0.15)"}`,
                  boxShadow: isDragging ? "0 0 30px rgba(59,130,246,0.3)" : "none",
                }}
              >
                <svg
                  className="w-9 h-9 transition-colors duration-200"
                  style={{ color: isDragging ? "#60A5FA" : "#475569" }}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>

              <p className="text-base font-medium mb-2" style={{ color: isDragging ? "#F1F5F9" : "#94A3B8" }}>
                {isDragging ? "Drop your image here" : (
                  <>Drag and drop an image, or{" "}
                    <span style={{ color: "#60A5FA", textDecoration: "underline", textUnderlineOffset: "3px" }}>browse files</span>
                  </>
                )}
              </p>

              <div className="flex items-center gap-3 mt-3">
                {["JPG", "PNG"].map((fmt) => (
                  <span key={fmt} className="px-2.5 py-1 rounded-md text-xs font-semibold"
                    style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#64748B" }}>
                    {fmt}
                  </span>
                ))}
                <span className="text-xs" style={{ color: "#475569" }}>Max {MAX_UPLOAD_SIZE_MB}MB</span>
              </div>
            </div>
          </div>
        ) : (
          /* ── Preview + actions ── */
          <div className="space-y-5">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(59,130,246,0.2)", background: "#080F1E" }}
            >
              <img src={previewUrl} alt="Upload preview" className="w-full max-h-[480px] object-contain" />
              <button
                onClick={clearFile}
                className="absolute top-3 right-3 p-2 rounded-full cursor-pointer transition-all duration-150 active:scale-90"
                style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(59,130,246,0.25)", color: "#94A3B8" }}
                aria-label="Remove image"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* File info */}
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
              style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(59,130,246,0.12)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
                <ImageIcon className="w-4 h-4" style={{ color: "#60A5FA" }} aria-hidden="true" />
              </div>
              <span className="truncate flex-1" style={{ color: "#94A3B8" }}>{file?.name}</span>
              <span className="shrink-0 tabular-nums font-mono text-xs" style={{ color: "#64748B" }}>
                {(file!.size / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>

            {/* Run Analysis button */}
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="btn-primary w-full py-3.5 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                  </svg>
                  Run Analysis
                </span>
              )}
            </button>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleInputChange} className="hidden" aria-hidden="true" />
      </div>
    </div>
  );
}
