import React from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SidebarLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className={cn(
      "block w-full rounded-md px-3 py-2 text-sm font-medium transition hover:bg-gray-200",
    )}
  >
    {children}
  </Link>
);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user?.uid) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <SidebarTrigger className="absolute top-4 right-4 z-10 text-gray-700 hover:text-black" />
      <div dir="rtl" className="relative flex min-h-screen w-full bg-white">
        <Sidebar side="right" className="border-l bg-gray-100 shadow-md">
          <div className="p-4">
            <h2 className="mb-6 text-right text-lg font-bold">לוח ניהול</h2>
            <nav className="space-y-2 text-right">
              <SidebarLink href="/admin">דף הבית</SidebarLink>
              <SidebarLink href="/admin/requests">בקשות מנהלים</SidebarLink>
              <SidebarLink href="/admin/users">ניהול משתמשים</SidebarLink>
              <SidebarLink href="/api/auth/signout">התנתק</SidebarLink>
            </nav>
          </div>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
