import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { getSession } from "@/lib/session";

import { Role } from "@/app/enums/role.enum";
import SideBar from "./SideBar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin-ext"],
});

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
        <main className="flex-1">{children}</main>
        <Toaster richColors position="top-center" />

        <SideBar role={role} />
      </body>
    </html>
  );
}
