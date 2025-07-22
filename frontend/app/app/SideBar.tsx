"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Role } from "@/app/enums/role.enum";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HIDDEN_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/menu",
  "/field-manager/contact",
];

const SidebarLink = ({
  href,
  children,
  prefetch,
}: {
  href: string;
  children: React.ReactNode;
  prefetch: boolean;
}) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onClick={toggleSidebar}
      className={cn(
        "block w-full rounded-md px-3 py-2 text-sm font-medium transition hover:bg-gray-200",
      )}
    >
      {children}
    </Link>
  );
};

const SignOutButton = () => {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

  const handleSignOut = async () => {
    toggleSidebar();

    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }

    // clear cookies
    const response = await fetch("/api/auth/signout", {
      method: "GET",
      cache: "no-store",
    });

    // refreshing the page to ensure the session is cleared
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className={cn(
        "block w-full rounded-md px-3 py-2 text-right text-sm font-medium transition hover:bg-gray-200",
      )}
    >
      התנתק
    </button>
  );
};

type SidebarProps = {
  role: Role;
};

const SideBar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  if (HIDDEN_PATHS.includes(pathname)) return null;
  switch (role) {
    case Role.USER:
      return (
        <SidebarProvider>
          <SidebarTrigger />
          <Sidebar side="right">
            <div className="p-4">
              <h2 className="mb-6 text-right text-lg font-bold">תפריט</h2>
              <nav className="space-y-2 text-right">
                <SidebarLink prefetch={true} href="/">
                  דף הבית
                </SidebarLink>
                <SidebarLink prefetch={true} href="/mygames">
                  המשחקים שלי{" "}
                </SidebarLink>
                <SidebarLink prefetch={true} href="/game/create">
                  יצירת משחק{" "}
                </SidebarLink>
                <SidebarLink prefetch={true} href="/friends">
                  חברים{" "}
                </SidebarLink>
                <SidebarLink prefetch={true} href="/groups">
                  קבוצות{" "}
                </SidebarLink>
                <SidebarLink prefetch={true} href="/profile">
                  פרופיל אישי{" "}
                </SidebarLink>

                <SignOutButton />
              </nav>
            </div>
          </Sidebar>
        </SidebarProvider>
      );

    case Role.FIELD_MANAGER:
      return (
        <SidebarProvider>
          <SidebarTrigger />
          <Sidebar side="right" className="border-l bg-gray-100 shadow-md">
            <div className="p-4">
              <h2 className="mb-6 text-right text-lg font-bold">תפריט</h2>
              <nav className="space-y-2 text-right">
                <SidebarLink prefetch={true} href="/field-manager">
                  דף הבית
                </SidebarLink>
                <SidebarLink prefetch={true} href="/field-manager/fields">
                  המגרשים שלי{" "}
                </SidebarLink>
                <SidebarLink prefetch={true} href="/field-manager/field/create">
                  הוספת מגרש
                </SidebarLink>
                <SignOutButton />
              </nav>
            </div>
          </Sidebar>
        </SidebarProvider>
      );

    case Role.ADMIN:
      return (
        <SidebarProvider>
          <SidebarTrigger />
          <Sidebar side="right" className="border-l bg-gray-100 shadow-md">
            <div className="p-4">
              <h2 className="mb-6 text-right text-lg font-bold">תפריט</h2>
              <nav className="space-y-2 text-right">
                <SidebarLink prefetch={true} href="/admin">
                  דף הבית
                </SidebarLink>
                <SidebarLink prefetch={true} href="/admin/requests">
                  בקשות מנהלי מגרשים
                </SidebarLink>
                <SidebarLink prefetch={true} href="/admin/users">
                  ניהול משתמשים
                </SidebarLink>
                <SignOutButton />
              </nav>
            </div>
          </Sidebar>
        </SidebarProvider>
      );
  }
  return null;
};

export default SideBar;
