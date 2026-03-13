"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { FloatingCart } from "@/components/floating-cart";
import { CartDrawer } from "@/components/cart-drawer";

// Wraps global UI — hides guest-facing components on the admin control panel
export function GlobalUI() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/talav-control-panel");
  const showHeader = pathname === "/" || pathname === "/menu";

  if (isAdmin) return null;

  return (
    <>
      {showHeader && <Header />}
      <FloatingCart />
      <CartDrawer />
    </>
  );
}
