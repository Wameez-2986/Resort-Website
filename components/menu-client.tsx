"use client";

import { useState } from "react";
import { CategoryCards } from "@/components/category-cards";
import { MenuSearch } from "@/components/menu-search";
import { AnimatePresence, motion } from "framer-motion";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  menuItems: MenuItem[];
};

export function MenuClient({
  initialCategories,
  searchData,
}: {
  initialCategories: any[];
  searchData: Category[];
}) {
  const [hasQuery, setHasQuery] = useState(false);

  return (
    <div className="flex flex-col w-full bg-[#0F0F0F] pt-10">
      {/* Search bar — always visible */}
      <MenuSearch
        initialData={searchData}
        onQueryChange={(q) => setHasQuery(q.trim().length > 0)}
      />

      {/* Category cards — hidden while search is active */}
      <AnimatePresence mode="wait">
        {!hasQuery && (
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryCards initialCategories={initialCategories} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
