"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Upload, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  label?: string;
}

export function ImageUpload({
  images,
  onChange,
  multiple = true,
  label = "Images",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (fileArray.length === 0) {
        toast.error("Please select valid image files");
        return;
      }

      setUploading(true);
      try {
        const uploaded: string[] = [];
        for (const file of fileArray) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload failed");
          uploaded.push(data.url);
        }

        if (multiple) {
          onChange([...images, ...uploaded]);
        } else {
          onChange(uploaded.slice(0, 1));
        }
        toast.success("Image uploaded successfully");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [images, multiple, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles],
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
        )}
      >
        <Upload className="mx-auto h-8 w-8 text-muted mb-3" />
        <p className="text-sm text-muted mb-3">
          Drag & drop images here, or click to browse
        </p>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          disabled={uploading}
        />
        <Button variant="outline" size="sm" disabled={uploading} type="button">
          {uploading ? "Uploading..." : "Choose Files"}
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, index) => (
            <div key={url} className="relative group aspect-video rounded-lg overflow-hidden glass">
              <Image src={url} alt={`Upload ${index + 1}`} fill className="object-cover" sizes="200px" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-xs text-white flex items-center gap-1">
                <GripVertical className="h-3 w-3" />
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
