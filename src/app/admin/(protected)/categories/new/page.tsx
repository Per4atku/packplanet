import { CategoryForm } from "../category-form";

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Category</h1>
        <p className="text-neutral-600">Create a new product category</p>
      </div>
      <CategoryForm />
    </div>
  );
}
