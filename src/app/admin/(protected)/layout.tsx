import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminContent } from "@/lib/content";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  const content = getAdminContent();

  return (
    <div className="flex min-h-screen overflow-hidden">
      <AdminSidebar
        user={user}
        content={content}
      />

      {/* Main Content */}
      <main className="flex-1 bg-neutral-50 overflow-auto">
        <div className="h-full p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
