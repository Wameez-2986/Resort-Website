"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UtensilsCrossed } from "lucide-react";

type Category = {
  id: string;
  name: string;
  image: string | null;
  displayOrder: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] md:aspect-square rounded-2xl bg-[#1E1E1E] animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-white/30">
          <UtensilsCrossed className="w-12 h-12 opacity-40" />
          <p className="font-montserrat text-lg">Menu categories coming soon…</p>
          <p className="font-montserrat text-sm opacity-60">
            Our team is preparing an extraordinary dining experience for you.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
      >
        {categories.map((category) => (
          // Route uses the DB id so the item page can fetch exactly the right items
          <Link key={category.id} href={`/menu/${category.id}`}>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(201,162,39,0.3)] transition-shadow duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-[#1E1E1E]">
                <img
                  src={category.image || "/interior/img 6.png"}
                  alt={category.name}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/interior/img 6.png";
                  }}
                />
              </div>

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                <h3 className="text-white font-montserrat font-semibold text-sm md:text-base lg:text-lg leading-tight group-hover:text-accent transition-colors duration-300">
                  {category.name}
                </h3>
                <div className="w-8 h-0.5 bg-accent mt-3 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
