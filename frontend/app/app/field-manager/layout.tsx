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

export default async function ManagerLayout({
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
      <SidebarTrigger className="fixed top-0 right-0 z-50 h-10 w-10 rounded-none rounded-bl-3xl bg-white shadow" />
      <div dir="rtl" className="relative flex min-h-screen w-full bg-white">
        <Sidebar side="right" className="border-l bg-gray-100 shadow-md">
          <div className="p-4">
            <h2 className="mb-6 text-right text-lg font-bold">תפריט</h2>
            <nav className="space-y-2 text-right">
              <SidebarLink href="/field-manager">דף הבית</SidebarLink>
              <SidebarLink href="/field-manager/fields">
                המגרשים שלי{" "}
              </SidebarLink>
              <SidebarLink href="/field-manager/field/create">
                הוספת מגרש
              </SidebarLink>
              <SidebarLink href="/api/auth/signout">התנתק</SidebarLink>
            </nav>
          </div>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
