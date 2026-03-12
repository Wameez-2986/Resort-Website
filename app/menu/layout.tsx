"use client";

import { usePathname } from "next/navigation";
import { FoodShowcase } from "@/components/food-showcase";
import { useEffect } from "react";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRootMenu = pathname === "/menu";

  useEffect(() => {
    if (isRootMenu) {
      // do nothing on root menu, let user scroll naturally
    } else {
      // When on a category page, we want to ensure we're at the top, since the hero is gone.
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, isRootMenu]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0F0F0F]">
      {/* Only show the full screen hero on the main /menu page */}
      {isRootMenu && <FoodShowcase />}
      
      <div className="w-full flex-1">
        {children}
      </div>
    </div>
  );
}
