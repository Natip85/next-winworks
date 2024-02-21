import type { Metadata } from "next";
import Topbar from "@/components/nav/Topbar";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import getCurrentUser from "@/actions/getCurrentUser";
import AuthContext from "@/providers/AuthContext";
import Footer from "@/components/Footer";
import CartProvider from "@/providers/CartProvider";
export const metadata: Metadata = {
  title: "Next-WinWorks",
  description: "An e-commerce solution",
  icons: { icon: "/logo.svg" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthContext>
          <CartProvider>
            <Toaster />
            <div className="flex flex-col min-h-screen">
              <div className="py-2 transition-colors bg-green-100 text-green-700 relative z-20 text-center">
                <div className="gap-4 justify-center lg:justify-center items-center lg:items-center flex flex-wrap">
                  <span className="text-xs font-light text-center md:text-center">
                    Free shipping on orders over $39 | Excludes AK, HI, & PR
                  </span>
                </div>
              </div>
              <Topbar />
              <main className="flex-grow">{children}</main>
            </div>
          </CartProvider>
        </AuthContext>
        <Footer />
      </body>
    </html>
  );
}
