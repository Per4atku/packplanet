import { PartnerForm } from "../partner-form";
import { getAdminContent } from "@/lib/content";

export default function NewPartnerPage() {
  const content = getAdminContent();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{content.partnerForm.newTitle}</h1>
        <p className="text-neutral-600">{content.partnerForm.newDescription}</p>
      </div>
      <PartnerForm content={content} />
    </div>
  );
}
