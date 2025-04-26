"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, UploadCloud, XCircle } from "lucide-react";
// Supabase Configuration (Move to a separate config file if needed)
import {
  cn,
  SUPABASE_ANON_KEY,
  SUPABASE_BUCKET,
  SUPABASE_URL,
} from "@/lib/utils"; // Adjust path if needed
import { Accept, useDropzone } from "react-dropzone";
import { toast } from "sonner";

// Helper function to generate a unique filename
const generateUUID = () => crypto.randomUUID();

// Helper function to upload file to Supabase
const uploadFileToSupabase = async (
  file: File,
  bucket: string = SUPABASE_BUCKET,
  uploadPathPrefix: string = "",
): Promise<{ publicUrl: string; error: string | null }> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase URL or Anon Key is not configured.");
    return {
      publicUrl: "",
      error: "Supabase URL or Anon Key is not configured.",
    };
  }

  const uniqueFileName = `${generateUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`; // Sanitize filename
  const filePath = `${uploadPathPrefix}${uniqueFileName}`; // Path within the bucket
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
  const publicUrlBase = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/`;

  const formData = new FormData();
  formData.append("file", file, uniqueFileName); // Use uniqueFileName here

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Supabase upload error:", errorData);
      return {
        publicUrl: "",
        error:
          errorData.message || `Upload failed with status: ${response.status}`,
      };
    }

    const publicUrl = `${publicUrlBase}${filePath}`;
    return { publicUrl, error: null };
  } catch (error: any) {
    console.error("Upload error:", error);
    return {
      publicUrl: "",
      error: error.message || "An unknown error occurred",
    };
  }
};

interface UploadProfileImageProps {
  onUpload: (url: string) => void; // Callback function to handle the uploaded URL
  initialUrl?: string; // Optional initial URL if an image is already uploaded
  label?: string;
  description?: string;
  bucket?: string; // Optional Supabase bucket name
  uploadPathPrefix?: string; // Optional path within the bucket
}

const UploadProfileImage: React.FC<UploadProfileImageProps> = ({
  onUpload,
  initialUrl,
  label = "Profile Picture",
  description = "Upload your profile picture (JPEG, PNG, or GIF)",
  bucket,
  uploadPathPrefix = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(initialUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      setUploadError(null);

      const file = acceptedFiles[0]; // We handle single file uploads

      const uploadResult = await uploadFileToSupabase(
        file,
        bucket,
        uploadPathPrefix,
      );

      setIsUploading(false);

      if (uploadResult.error) {
        setUploadError(uploadResult.error);
        toast.error("Upload Failed", { description: uploadResult.error });
      } else {
        setFileUrl(uploadResult.publicUrl);
        setFileName(file.name); // Store original filename
        onUpload(uploadResult.publicUrl); // Notify parent component
        toast.success("File Uploaded Successfully!");
      }
    },
    [onUpload, bucket, uploadPathPrefix],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    } as Accept,
    maxFiles: 1,
    disabled: isUploading || !!fileUrl, // Disable if uploading or a file is already uploaded
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropzone from triggering
    setFileUrl(null);
    setFileName(null);
    onUpload(""); // Notify parent to clear the URL
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      {fileUrl ? (
        // Display file info and remove button
        <div className="flex items-center justify-between p-3 border border-dashed rounded-md bg-muted/50">
          <div className="flex items-center space-x-2 overflow-hidden">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline truncate"
              title={fileName || fileUrl} // Use fileName if available, otherwise use URL
            >
              {fileName || "Uploaded File"}
            </a>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            aria-label="Remove file"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Display dropzone
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center w-full h-32 px-4 text-center border-2 border-dashed rounded-md cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/30 hover:border-primary/70",
            isUploading && "opacity-50 cursor-not-allowed",
            uploadError && "border-destructive bg-destructive/10",
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
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
                Drag & drop file, or click to select
              </p>
              <p className="text-xs">{description}</p>
            </div>
          )}
        </div>
      )}
      {uploadError && !isUploading && !fileUrl && (
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

export default UploadProfileImage;
