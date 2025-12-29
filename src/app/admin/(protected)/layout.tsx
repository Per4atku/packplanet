import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logout } from "../(auth)/login/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Package,
  FolderTree,
  Handshake,
  FileText,
  LogOut,
} from "lucide-react";
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

  const navItems = [
    {
      href: "/admin/products",
      icon: Package,
      label: content.navigation.products,
    },
    {
      href: "/admin/categories",
      icon: FolderTree,
      label: content.navigation.categories,
    },
    {
      href: "/admin/partners",
      icon: Handshake,
      label: content.navigation.partners,
    },
    {
      href: "/admin/price-list",
      icon: FileText,
      label: content.navigation.priceList,
    },
  ];

  return (
    <div className="flex min-h-screen overflow-hidden">
      <AdminSidebar
        user={user}
        content={content}
        navItems={navItems}
        logoutAction={logout}
      />

      {/* Main Content */}
      <main className="flex-1 bg-neutral-50 overflow-auto">
        <div className="h-full p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
