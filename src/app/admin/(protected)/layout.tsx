import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logout } from "../(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Package,
  FolderTree,
  Handshake,
  FileText,
  LogOut,
  Search,
  LayoutDashboard,
  ChevronLeft,
  Settings,
  HelpCircle,
  Bell,
} from "lucide-react";
import { getAdminContent } from "@/lib/content";

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
    <div className="flex min-h-screen">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-[#0f0f10] text-neutral-200 flex flex-col">
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-white">
              {content.site.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder={content.navigation.search}
              className="w-full rounded-md bg-neutral-900 border border-neutral-800 py-2 pl-9 pr-4 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          <NavLink
            href="/admin/products"
            icon={<LayoutDashboard className="h-4 w-4" />}
          >
            {content.navigation.dashboard}
          </NavLink>
          <NavLink
            href="/admin/products"
            icon={<Package className="h-4 w-4" />}
          >
            {content.navigation.products}
          </NavLink>
          <NavLink
            href="/admin/categories"
            icon={<FolderTree className="h-4 w-4" />}
          >
            {content.navigation.categories}
          </NavLink>
          <NavLink
            href="/admin/partners"
            icon={<Handshake className="h-4 w-4" />}
          >
            {content.navigation.partners}
          </NavLink>
          <NavLink
            href="/admin/price-list"
            icon={<FileText className="h-4 w-4" />}
          >
            {content.navigation.priceList}
          </NavLink>
        </nav>

        {/* User Profile */}
        <div className="border-t border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-neutral-700">
              <AvatarFallback className="bg-neutral-800 text-neutral-200 text-sm">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.username}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                {content.navigation.administrator}
              </p>
            </div>
            <form action={logout}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-neutral-50">
        <div className="h-full p-8">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
    >
      {icon}
      {children}
    </Link>
  );
}
