import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { getSession } from "@/lib/session";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

import { Role } from "@/app/enums/role.enum";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin-ext"],
});

const SidebarLink = ({
  href,
  children,
  prefetch,
}: {
  href: string;
  children: React.ReactNode;
  prefetch: boolean;
}) => (
  <Link
    href={href}
    prefetch={prefetch}
    className={cn(
      "block w-full rounded-md px-3 py-2 text-sm font-medium transition hover:bg-gray-200",
    )}
  >
    {children}
  </Link>
);

export const metadata: Metadata = {
  title: "Yoop",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const role: Role = session?.user?.role ?? ("USER" as Role);

  return (
    <html lang="en" dir="rtl">
      <body className={`${geistSans.variable} antialiased`}>
        <SidebarProvider>
          <SidebarTrigger className="fixed top-0 right-0 z-50 h-10 w-10 rounded-bl-3xl bg-white shadow" />
          <div dir="rtl" className="relative flex min-h-screen w-full bg-white">
            <Sidebar side="right" className="border-l bg-gray-100 shadow-md">
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

                  <SidebarLink prefetch={false} href="/api/auth/signout">
                    התנתק
                  </SidebarLink>
                </nav>
              </div>
            </Sidebar>
            <main className="flex-1">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
