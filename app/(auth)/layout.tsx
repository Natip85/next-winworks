import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import getCurrentUser from "@/actions/getCurrentUser";
import AuthContext from "@/providers/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "next-winworks",
  description: "An e-commerce solution",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AuthContext>
          <Toaster />
          <main className="flex flex-col min-h-screen bg-secondary">
            <section className="flex-grow">{children}</section>
          </main>
        </AuthContext>
      </body>
    </html>
  );
}
