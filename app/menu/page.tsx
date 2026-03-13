"use client";

import { useState } from "react";
import { CategoryCards } from "@/components/category-cards";
import { MenuSearch } from "@/components/menu-search";
import { AnimatePresence, motion } from "framer-motion";

export default function MenuPage() {
  const [hasQuery, setHasQuery] = useState(false);

  return (
    <div className="flex flex-col w-full bg-[#0F0F0F] pt-10">
      {/* Search bar — always visible */}
      <MenuSearch onQueryChange={(q) => setHasQuery(q.trim().length > 0)} />

      {/* Category cards — hidden while search is active */}
      <AnimatePresence>
        {!hasQuery && (
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryCards />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
