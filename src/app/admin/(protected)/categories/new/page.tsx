import { CategoryForm } from "../category-form";

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Добавить новую категорию</h1>
        <p className="text-neutral-600">Создайте новую категорию товаров</p>
      </div>
      <CategoryForm />
    </div>
  );
}
