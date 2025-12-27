import { CategoryForm } from "../category-form";
import { getAdminContent } from "@/lib/content";

export default function NewCategoryPage() {
  const content = getAdminContent();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{content.categoryForm.newTitle}</h1>
        <p className="text-neutral-600">{content.categoryForm.newDescription}</p>
      </div>
      <CategoryForm content={content} />
    </div>
  );
}
