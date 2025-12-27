"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadPriceList } from "./actions";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminContent } from "@/lib/content";

interface UploadFormProps {
  content: AdminContent;
}

export function UploadForm({ content }: UploadFormProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFiles[0]);

    const result = await uploadPriceList(formData);

    if (result?.error) {
      setError(result.error);
      setIsUploading(false);
    } else {
      setIsUploading(false);
      setSelectedFiles([]);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FileUpload
        onFilesChange={setSelectedFiles}
        multiple={false}
        disabled={isUploading}
        maxSize={10 * 1024 * 1024}
        label={content.uploadForm.fileLabel}
        description="Перетащите ваши файлы или нажмите чтобы открыть меню"
        preview="list"
      />

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isUploading || selectedFiles.length === 0}
        size="lg"
        className="w-full sm:w-auto"
      >
        <Upload className="mr-2 h-5 w-5" />
        {isUploading
          ? content.uploadForm.uploadingButton
          : content.uploadForm.uploadButton}
      </Button>
    </form>
  );
}
