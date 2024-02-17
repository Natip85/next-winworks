import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AuthContext from "@/components/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/nav/Sidebar";
import getCurrentUser from "@/actions/getCurrentUser";
import MainNavbar from "@/components/nav/AdminNavbar";
import Bottombar from "@/components/nav/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next-WinWorks",
  description: "An e-commerce solution",
  icons: { icon: "/logo.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AuthContext>
          <Toaster />
          <MainNavbar currentUser={currentUser} />
          <main className="flex flex-row">
            <Sidebar />
            <section className="flex min-h-screen flex-1 flex-col items-center px-1 pb-10 pt-28 max-md:pb-32 sm:px-10 bg-[#F1F1F1]">
              <div className="w-full max-w-6xl">{children}</div>
            </section>
          </main>
          <Bottombar />
        </AuthContext>
      </body>
    </html>
  );
}
