"use client";

import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { Accept, useDropzone } from "react-dropzone"; // Import react-dropzone
import { FileText, Loader2, UploadCloud, XCircle } from "lucide-react"; // Icons
// --- Shadcn UI Component Imports ---
import { Button } from "@/components/ui/button";
// Input removed as URL inputs are replaced
// Select removed as Type is removed
import { Label } from "@/components/ui/label";
import { SUPABASE_ANON_KEY, SUPABASE_BUCKET, SUPABASE_URL } from "@/lib/utils"; // Adjust path if needed

// --- Helper Function ---
const generateUUID = () => crypto.randomUUID();

// --- Upload Function ---
interface UploadResponse {
  publicUrl: string;
  error?: string;
}

export const uploadFileToSupabase = async (
  file: File,
  pathPrefix: string = "", // e.g., 'pdfs/' or 'sources/'
): Promise<UploadResponse> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase URL or Anon Key is not configured.");
    return { publicUrl: "", error: "Upload configuration error." };
  }

  // Create a unique filename to avoid conflicts and handle special characters
  const uniqueFileName = `${generateUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filePath = `${pathPrefix}${uniqueFileName}`;
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${filePath}`;
  const publicUrlBase = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/`;

  const formData = new FormData();
  // Append file with the unique filename. Supabase uses this as the object key.
  formData.append("file", file, uniqueFileName);

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        // Use the Anon key for browser-based uploads (assuming RLS policies are set)
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        // 'x-upsert': 'true', // Uncomment to overwrite existing files with the same name
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Supabase upload error:", errorData);
      throw new Error(
        errorData.message || `Upload failed with status: ${response.status}`,
      );
    }

    // Construct the public URL based on the path used for upload
    const publicUrl = `${publicUrlBase}${filePath}`;

    console.log("Upload successful, Public URL:", publicUrl);
    return { publicUrl };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      publicUrl: "",
      error:
        err instanceof Error
          ? err.message
          : "An unknown upload error occurred.",
    };
  }
};

// --- Reusable File Upload Component ---
interface FileUploadZoneProps {
  onFileUpload: (url: string, file: File) => void; // Callback with URL and original file
  accept: Accept; // e.g., { 'application/pdf': ['.pdf'] }
  label: string;
  description?: string;
  multiple?: boolean;
  maxFiles?: number;
  currentFileUrl?: string | null; // To display info about an already uploaded file
  currentFileName?: string | null;
  onRemoveCurrent?: () => void; // Callback to clear the current file URL
  uploadPathPrefix?: string; // e.g., 'pdfs/' or 'sources/'
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  accept,
  label,
  description,
  multiple = false,
  maxFiles = 1,
  currentFileUrl,
  currentFileName,
  onRemoveCurrent,
  uploadPathPrefix = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Add progress state if needed

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;
      setIsUploading(true);
      setUploadError(null);

      const fileToUpload = acceptedFiles[0]; // Handle single file upload for now

      const result = await uploadFileToSupabase(fileToUpload, uploadPathPrefix);

      setIsUploading(false);
      if (result.error) {
        setUploadError(result.error);
        toast.error("Upload Failed", { description: result.error });
      } else {
        onFileUpload(result.publicUrl, fileToUpload); // Pass URL and original file back
        toast.success("File Uploaded Successfully!");
      }
    },
    [onFileUpload, uploadPathPrefix],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    disabled: isUploading || !!currentFileUrl, // Disable if uploading or file already present
  });

  // Function to clear the uploaded file
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering dropzone
    setUploadError(null);
    if (onRemoveCurrent) {
      onRemoveCurrent();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {currentFileUrl ? (
        // Display uploaded file info
        <div className="flex items-center justify-between p-3 border border-dashed rounded-md bg-muted/50">
          <div className="flex items-center space-x-2 overflow-hidden">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <a
              href={currentFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline truncate"
              title={currentFileName || currentFileUrl}
            >
              {currentFileName || "Uploaded File"}
            </a>
          </div>
          {onRemoveCurrent && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              aria-label="Remove file"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        // Display Dropzone
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full h-32 px-4 text-center border-2 border-dashed rounded-md cursor-pointer transition-colors
                        ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-primary/70"}
                        ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                        ${uploadError ? "border-destructive bg-destructive/10" : ""}
                    `}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
              {/* Add Progress component here if tracking progress */}
            </div>
          ) : uploadError ? (
            <div className="flex flex-col items-center space-y-1 text-destructive">
              <XCircle className="h-8 w-8" />
              <p className="text-sm font-medium">Upload Failed</p>
              <p className="text-xs">{uploadError}</p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center space-y-2 text-primary">
              <UploadCloud className="h-8 w-8" />
              <p className="text-sm font-medium">Drop the file here...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 text-muted-foreground">
              <UploadCloud className="h-8 w-8" />
              <p className="text-sm font-medium">
                Drag & drop file here, or click to select
              </p>
              <p className="text-xs">
                {description || `Max ${maxFiles} file(s)`}
              </p>
            </div>
          )}
        </div>
      )}
      {uploadError && !isUploading && !currentFileUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUploadError(null)}
          className="mt-2"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
