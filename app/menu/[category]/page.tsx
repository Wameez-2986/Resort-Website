"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/context/cart-context";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  available: boolean;
};

type CategoryData = {
  category: { id: string; name: string };
  items: MenuItem[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addItem } = useCart();

  // Resolve params
  useEffect(() => {
    params.then((p) => setCategoryId(p.category));
  }, [params]);

  // Fetch category + items
  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    fetch(`/api/categories/${categoryId}`)
      .then(async (res) => {
        if (res.status === 404) { setNotFound(true); return; }
        setData(await res.json());
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white/30">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="font-montserrat text-sm">Loading menu…</p>
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6 text-white/40">
        <UtensilsCrossed className="w-16 h-16 opacity-30" />
        <p className="font-montserrat text-center">This category doesn't exist.</p>
        <Link href="/menu" className="text-accent font-montserrat text-sm hover:underline">
          ← Back to Menu
        </Link>
      </div>
    );
  }

  const { category, items } = data;

  return (
    <div className="w-full flex flex-col min-h-screen pb-32">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0F0F0F]/90 backdrop-blur-md border-b border-white/10 px-4 py-4 md:px-8 flex flex-col gap-4">
        <div className="flex items-center w-full max-w-5xl mx-auto">
          <Link
            href="/menu"
            className="p-2 -ml-2 text-white/70 hover:text-accent transition-colors flex items-center justify-center rounded-full hover:bg-white/5"
            aria-label="Back to Menu"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>

        {/* Category Title */}
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-accent text-center mb-1">
            {category.name}
          </h2>
          <div className="w-12 h-0.5 bg-accent/50 rounded-full" />
        </div>
      </header>

      {/* Menu Items */}
      <main className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 flex-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-white/30">
            <UtensilsCrossed className="w-12 h-12 opacity-40" />
            <p className="font-montserrat text-lg">No items in this category yet.</p>
            <p className="font-montserrat text-sm opacity-60">
              Check back soon — our chefs are working on it!
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-[#1A1A1A] rounded-2xl p-6 shadow-lg border border-white/5 hover:border-accent/30 transition-colors duration-300 flex flex-col h-full group"
              >
                {item.image && (
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                    />
                  </div>
                )}

                <div className="flex justify-between items-start mb-3 gap-4">
                  <h4 className="text-lg font-montserrat font-medium text-white group-hover:text-accent transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-accent font-semibold whitespace-nowrap text-lg">
                    ₹{item.price}
                  </span>
                </div>

                {item.description && (
                  <p className="text-white/50 text-sm leading-relaxed font-montserrat flex-1 mb-6">
                    {item.description}
                  </p>
                )}

                <button
                  onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                  className="mt-auto w-full py-3 px-4 bg-transparent border border-accent/50 text-accent font-semibold rounded-xl hover:bg-accent hover:text-black transition-all duration-300 font-montserrat uppercase tracking-wider text-sm cursor-pointer"
                >
                  Add+
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
