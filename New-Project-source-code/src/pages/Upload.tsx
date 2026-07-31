import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from "lucide-react";
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
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Unsupported file type. Please upload a JPG or PNG image.";
    }
    if (f.size > MAX_SIZE_BYTES) {
      return `File is too large. Maximum size is ${MAX_UPLOAD_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      setError(null);
      const validationError = validateFile(f);
      if (validationError) {
        setError(validationError);
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      // Revoke old preview URL
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    },
    [validateFile, previewUrl]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Upload original image to Supabase Storage
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const filePath = `originals/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      // 2. Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // 3. Insert a row into the predictions table
      const { data: prediction, error: insertError } = await supabase
        .from("predictions")
        .insert({
          user_id: user.id,
          original_image_url: imageUrl,
          original_file_path: filePath,
          status: "processing",
        })
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);

      // 4. Navigate to the Predicting page
      navigate(`/predicting/${prediction.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
        Upload Image
      </h1>
      <p className="mt-2 text-foreground/70">
        Select a satellite or drone image of a flooded region for AI analysis.
      </p>

      {/* Error message */}
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      {/* Drop zone / preview area */}
      {!previewUrl ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload an image file"
          onClick={handleBrowse}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBrowse();
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`mt-8 border-2 border-dashed rounded-xl p-12 sm:p-16 text-center transition-all duration-200 cursor-pointer
            ${
              isDragging
                ? "border-accent bg-accent/5 scale-[1.01]"
                : "border-border hover:border-foreground/30 bg-muted/30"
            }
          `}
        >
          <UploadCloud
            className={`w-12 h-12 mx-auto transition-colors duration-200 ${
              isDragging ? "text-accent" : "text-foreground/30"
            }`}
            aria-hidden="true"
          />
          <p className="mt-4 text-foreground/60 font-medium">
            {isDragging ? (
              "Drop your image here"
            ) : (
              <>
                Drag and drop an image here, or{" "}
                <span className="text-accent underline underline-offset-2">
                  browse
                </span>
              </>
            )}
          </p>
          <p className="mt-2 text-sm text-foreground/40">
            Accepted formats: JPG, PNG. Max size: {MAX_UPLOAD_SIZE_MB}MB.
          </p>
        </div>
      ) : (
        /* Image preview + actions */
        <div className="mt-8 space-y-6">
          <div className="relative rounded-xl overflow-hidden border border-border bg-muted">
            <img
              src={previewUrl}
              alt="Upload preview"
              className="w-full max-h-[500px] object-contain"
            />
            <button
              onClick={clearFile}
              className="absolute top-3 right-3 bg-foreground/70 text-white p-2 rounded-full hover:bg-foreground/90 active:scale-90 transition-all duration-150 cursor-pointer"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* File info */}
          <div className="flex items-center gap-3 text-sm text-foreground/60 bg-muted/50 rounded-lg p-4">
            <ImageIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="truncate">{file?.name}</span>
            <span className="shrink-0 tabular-nums">
              {(file!.size / (1024 * 1024)).toFixed(1)} MB
            </span>
          </div>

          {/* Run Analysis button */}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full sm:w-auto bg-accent text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading…
              </span>
            ) : (
              "Run Analysis"
            )}
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
