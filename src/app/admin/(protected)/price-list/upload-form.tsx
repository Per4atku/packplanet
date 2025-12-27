"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPriceList } from "./actions";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadForm() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true);
    setError("");

    const result = await uploadPriceList(formData);

    if (result?.error) {
      setError(result.error);
      setIsUploading(false);
    } else {
      setIsUploading(false);
      router.refresh();
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Price List File *</Label>
        <Input
          id="file"
          name="file"
          type="file"
          required
          disabled={isUploading}
          accept=".pdf,.xlsx,.xls,.doc,.docx"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isUploading}>
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload Price List"}
      </Button>
    </form>
  );
}
