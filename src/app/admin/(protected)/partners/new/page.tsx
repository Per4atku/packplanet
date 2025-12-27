import { PartnerForm } from "../partner-form";

export default function NewPartnerPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Partner</h1>
        <p className="text-neutral-600">Add a new business partner</p>
      </div>
      <PartnerForm />
    </div>
  );
}
