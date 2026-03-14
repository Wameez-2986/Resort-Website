"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, X, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/context/cart-context";

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
  image: string | null;
  menuItems: MenuItem[];
};

// ── Item card (reused in search results) ─────────────────────────────────────
function ItemCard({ item, categoryName }: { item: MenuItem; categoryName: string }) {
  const { addItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="bg-[#1A1A1A] rounded-2xl p-5 border border-white/5 hover:border-accent/30 transition-colors duration-300 flex flex-col group"
    >
      {item.image && (
        <div className="w-full h-36 rounded-xl overflow-hidden mb-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
          />
        </div>
      )}
      <p className="text-white/40 font-montserrat text-xs mb-1">{categoryName}</p>
      <div className="flex justify-between items-start gap-3 mb-3">
        <h4 className="text-base font-montserrat font-medium text-white group-hover:text-accent transition-colors leading-tight">
          {item.name}
        </h4>
        <span className="text-accent font-semibold whitespace-nowrap text-base shrink-0">₹{item.price}</span>
      </div>
      <button
        onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
        className="mt-auto w-full py-2.5 px-4 bg-transparent border border-accent/50 text-accent font-semibold rounded-xl hover:bg-accent hover:text-black transition-all duration-300 font-montserrat uppercase tracking-wider text-xs cursor-pointer"
      >
        Add+
      </button>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MenuSearch({
  onQueryChange,
  initialData,
}: {
  onQueryChange?: (q: string) => void;
  initialData?: Category[];
}) {
  const [allCategories, setAllCategories] = useState<Category[]>(initialData || []);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(!initialData);

  const handleQuery = (val: string) => {
    setQuery(val);
    onQueryChange?.(val);
  };

  useEffect(() => {
    if (initialData) return;
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => setAllCategories(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [initialData]);

  // ── Filter logic ─────────────────────────────────────────────────────────
  const q = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!q) return [];
    return allCategories
      .map((cat) => {
        const catMatch = cat.name.toLowerCase().includes(q);
        const matchedItems = cat.menuItems.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            (item.description ?? "").toLowerCase().includes(q) ||
            catMatch
        );
        return { ...cat, menuItems: matchedItems };
      })
      .filter((cat) => cat.menuItems.length > 0);
  }, [q, allCategories]);

  const totalMatches = filteredCategories.reduce((n, c) => n + c.menuItems.length, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <div className="relative mb-10">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/60 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
          placeholder="Search for dishes, drinks, or desserts…"
          className="w-full bg-[#1A1A1A] border border-accent/25 hover:border-accent/50 focus:border-accent/70 rounded-2xl pl-14 pr-12 py-4 md:py-5 text-white placeholder-white/30 font-montserrat text-sm md:text-base focus:outline-none transition-all duration-300 shadow-[0_0_30px_rgba(201,162,39,0.04)] focus:shadow-[0_0_30px_rgba(201,162,39,0.12)]"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => handleQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Search results ──────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {q && (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-xl md:text-2xl font-playfair font-bold text-white">Search Results</h2>
              {!loading && (
                <span className="text-white/30 font-montserrat text-sm">
                  {totalMatches} {totalMatches === 1 ? "dish" : "dishes"} found
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-[#1A1A1A] rounded-2xl animate-pulse" />)}
              </div>
            ) : totalMatches === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-4 py-20 text-white/30"
              >
                <UtensilsCrossed className="w-12 h-12 opacity-40" />
                <p className="font-montserrat text-lg">No dishes found.</p>
                <p className="font-montserrat text-sm opacity-60">
                  Try searching for something else — maybe "paneer", "biryani", or "soup".
                </p>
              </motion.div>
            ) : (
              filteredCategories.map((cat) => (
                <div key={cat.id} className="mb-10">
                  {/* Category heading with link */}
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-base font-montserrat font-semibold text-accent">{cat.name}</h3>
                    <div className="flex-1 h-px bg-white/5" />
                    <Link
                      href={`/menu/${cat.id}`}
                      className="text-xs font-montserrat text-white/30 hover:text-accent transition-colors"
                    >
                      View all →
                    </Link>
                  </div>
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  >
                    <AnimatePresence>
                      {cat.menuItems.map((item) => (
                        <ItemCard key={item.id} item={item} categoryName={cat.name} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
