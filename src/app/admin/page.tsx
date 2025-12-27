import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { user } = await validateRequest();

  // Redirect authenticated users to products dashboard
  // Redirect unauthenticated users to login
  if (user) {
    redirect("/admin/products");
  } else {
    redirect("/admin/login");
  }
}
