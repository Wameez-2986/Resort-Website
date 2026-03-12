import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/header";
import { CartProvider } from "@/context/cart-context";
import { FloatingCart } from "@/components/floating-cart";
import { CartDrawer } from "@/components/cart-drawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Talav Resort",
  description: "A Luxury Resort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col font-sans bg-[#0F0F0F] text-white w-full`}
      >
        <CartProvider>
          <Header />
          <main className="flex-1 w-full relative">
            {children}
          </main>
          <FloatingCart />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
