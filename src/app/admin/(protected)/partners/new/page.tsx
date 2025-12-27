import { PartnerForm } from "../partner-form";

export default function NewPartnerPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Добавить нового партнера</h1>
        <p className="text-neutral-600">Добавьте нового бизнес-партнера</p>
      </div>
      <PartnerForm />
    </div>
  );
}
