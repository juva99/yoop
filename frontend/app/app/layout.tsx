import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { getSession } from "@/lib/session";
import { Toaster } from "sonner";

import { Role } from "@/app/enums/role.enum";

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
        <main className="pb-20">{children}</main>
        <Navbar role={role} />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
