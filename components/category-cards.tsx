"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  displayOrder: number;
};

// ── Image map from public/categories ────────────────────────────────────────
const CATEGORY_IMAGES: Record<string, string> = {
  "tandoor starter(veg)":             "/categories/tandoor starter(veg).png",
  "tandoor starter(non-veg)":         "/categories/tandoor starter(non-veg).png",
  "chineese noodles & rice(veg)":     "/categories/chinese starter & rice(veg).png",
  "chineese noodles & rice(non-veg)": "/categories/chinese starter & rice(non-veg).png",
  "chinese noodles & rice(veg)":      "/categories/chinese starter & rice(veg).png",
  "chinese noodles & rice(non-veg)":  "/categories/chinese starter & rice(non-veg).png",
  "chineese starter(veg)":            "/categories/chinese starter & rice(veg).png",
  "chineese starter(non-veg)":        "/categories/chinese starter & rice(non-veg).png",
  "chinese starter(veg)":             "/categories/chinese starter & rice(veg).png",
  "chinese starter(non-veg)":         "/categories/chinese starter & rice(non-veg).png",
  "kofta khajana":                    "/categories/kofta khajana.png",
  "kaju flavor":                      "/categories/Kaju flavor.png",
  "chicken main course":              "/categories/chicken main course.png",
  "fish main course":                 "/categories/fish.png",
  "fish":                             "/categories/fish.png",
  "sizzler(veg)":                     "/categories/sizzler(veg).png",
  "sizzler(non-veg)":                 "/categories/sizzler(non-veg).png",
  "veg main course":                  "/categories/veg main course.png",
  "paneer main course":               "/categories/paneer main course.png",
};

const DEFAULT_CAT_IMAGE = "/categories/kofta khajana.png";

function getCategoryImage(cat: { name: string; image: string | null }): string {
  if (cat.image) return cat.image;
  return CATEGORY_IMAGES[cat.name.toLowerCase().trim()] ?? DEFAULT_CAT_IMAGE;
}

// ── Animation variants ───────────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any } },
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-3xl bg-[#1A1A1A] animate-pulse" />
        ))}
      </div>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function CategoryCards({ initialCategories }: { initialCategories?: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [loading, setLoading] = useState(!initialCategories);

  useEffect(() => {
    if (initialCategories) return;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [initialCategories]);

  if (loading) return <Skeleton />;

  if (categories.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col items-center justify-center gap-4 py-28 text-white/20">
          <UtensilsCrossed className="w-14 h-14" />
          <p className="font-montserrat text-base tracking-widest uppercase">Menu coming soon</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

      {/* Section header */}
      <div className="flex flex-col items-center mb-12">
        <p className="text-accent font-montserrat text-xs tracking-[0.3em] uppercase mb-3">
          Our Offerings
        </p>
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white text-center mb-4">
          Explore the Menu
        </h2>
        <div className="flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/60" />
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
      >
        {categories.map((category) => (
          <motion.div key={category.id} variants={cardVariant}>
            <Link href={`/menu/${category.slug}`} className="block group">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/5 group-hover:ring-accent/40 transition-all duration-500">

                {/* Photo */}
                <img
                  src={getCategoryImage(category)}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_CAT_IMAGE; }}
                />

                {/* Base dark scrim */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Gold shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Gold top line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                  <h3 className="text-white font-montserrat font-semibold text-sm md:text-base leading-snug drop-shadow-lg group-hover:text-accent transition-colors duration-300">
                    {category.name}
                  </h3>

                  {/* Animated CTA */}
                  <div className="flex items-center gap-1.5 mt-2 overflow-hidden h-5">
                    <span className="text-accent/0 group-hover:text-accent text-[11px] font-montserrat tracking-widest uppercase translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      Explore
                    </span>
                    <ArrowRight className="w-3 h-3 text-accent/0 group-hover:text-accent translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
