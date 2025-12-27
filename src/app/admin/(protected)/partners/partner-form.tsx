"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { createPartner, updatePartner } from "./actions";
import { Partner } from "@/generated/prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PartnerFormProps {
  partner?: Partner;
}

export function PartnerForm({ partner }: PartnerFormProps) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    if (partner) {
      await updatePartner(partner.id, formData);
    } else {
      await createPartner(formData);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Partner Name *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={partner?.name}
              placeholder="e.g., Acme Corporation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={partner?.description}
              placeholder="Brief description of the partner..."
            />
          </div>

          {partner?.image && (
            <div className="space-y-2">
              <Label>Current Logo</Label>
              <div className="relative h-32 w-32">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image">
              {partner ? "Replace Logo" : "Partner Logo"}
            </Label>
            <Input id="image" name="image" type="file" accept="image/*" />
            <p className="text-sm text-neutral-500">
              Upload partner logo (PNG, JPG, SVG recommended)
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit">
              {partner ? "Update Partner" : "Create Partner"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
