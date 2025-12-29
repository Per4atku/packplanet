"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Package, LogOut, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminContent } from "@/lib/content";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

interface AdminSidebarProps {
  user: {
    username: string;
  };
  content: AdminContent;
  navItems: NavItem[];
  logoutAction: () => void;
}

export function AdminSidebar({
  user,
  content,
  navItems,
  logoutAction,
}: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-40 bg-[#0f0f10] text-neutral-200 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center flex-shrink-0">
              <Package className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-white whitespace-nowrap">
                {content.site.name}
              </span>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800 flex-shrink-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-neutral-800 p-4">
          <div className={cn("flex items-center gap-3", isCollapsed && "flex-col")}>
            <Avatar className="h-9 w-9 border border-neutral-700 flex-shrink-0">
              <AvatarFallback className="bg-neutral-800 text-neutral-200 text-sm">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {content.navigation.administrator}
                </p>
              </div>
            )}
            <form action={logoutAction}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800 flex-shrink-0"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
