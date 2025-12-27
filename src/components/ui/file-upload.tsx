"use client";

import { Upload, File, X, Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
  preview?: "image" | "list" | "none";
}

export function FileUpload({
  onFilesChange,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  label = "Upload files",
  description,
  className,
  preview = "list",
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (fileList: FileList | null): File[] => {
    if (!fileList) return [];

    const validFiles: File[] = [];
    setError("");

    Array.from(fileList).forEach((file) => {
      if (maxSize && file.size > maxSize) {
        setError(`File "${file.name}" exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
        return;
      }

      if (accept) {
        const acceptedTypes = accept.split(",").map((t) => t.trim());
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
        const mimeType = file.type;

        const isAccepted = acceptedTypes.some(
          (type) =>
            type === fileExtension ||
            type === mimeType ||
            (type.endsWith("/*") && mimeType.startsWith(type.replace("/*", "")))
        );

        if (!isAccepted) {
          setError(`File "${file.name}" is not an accepted file type`);
          return;
        }
      }

      validFiles.push(file);
    });

    return validFiles;
  };

  const handleFiles = (fileList: FileList | null) => {
    const validFiles = validateFiles(fileList);
    if (validFiles.length === 0) return;

    const newFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
    setError("");
  };

  const getAcceptedFormats = () => {
    if (!accept) return "All files";
    return accept
      .split(",")
      .map((t) => t.trim().toUpperCase().replace(".", ""))
      .join(", ");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-all cursor-pointer",
          "hover:border-primary/50 hover:bg-accent/5",
          isDragging && "border-primary bg-accent/10",
          disabled && "opacity-50 cursor-not-allowed",
          files.length === 0 ? "p-12" : "p-8"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div
            className={cn(
              "rounded-full p-4 transition-colors",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">
              {description || "Drag and drop files here, or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground">
              Accepted formats: {getAcceptedFormats()}
              {maxSize && ` • Max size: ${maxSize / 1024 / 1024}MB`}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {files.length > 0 && preview !== "none" && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Selected {multiple ? "files" : "file"} ({files.length})
          </p>

          {preview === "image" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {files.map((file, index) => {
                const isImage = file.type.startsWith("image/");
                const preview = isImage ? URL.createObjectURL(file) : null;

                return (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                  >
                    {preview ? (
                      <Image
                        src={preview}
                        alt={file.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <File className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1.5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white truncate opacity-0 transition-opacity group-hover:opacity-100">
                      {file.name}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    ) : (
                      <File className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 rounded-full p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
