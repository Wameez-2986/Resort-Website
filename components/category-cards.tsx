"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const CATEGORIES = [
  { name: "Tandoor Starter(Veg)", slug: "tandoor-starter-veg" },
  { name: "Tandoor Starter(Non-Veg)", slug: "tandoor-starter-non-veg" },
  { name: "Chineese Noodles & Rice(Veg)", slug: "chineese-noodles-rice-veg" },
  { name: "Chineese Noodles & Rice(Non-Veg)", slug: "chineese-noodles-rice-non-veg" },
  { name: "Kofta Khajana", slug: "kofta-khajana" },
  { name: "Kaju Flavor", slug: "kaju-flavor" },
  { name: "Chicken Main Course", slug: "chicken-main-course" },
  { name: "Fish Main Course", slug: "fish-main-course" },
  { name: "Sizzler(Veg)", slug: "sizzler-veg" },
  { name: "Sizzler(Non-Veg)", slug: "sizzler-non-veg" },
  { name: "Veg Main Course", slug: "veg-main-course" },
  { name: "Paneer Main Course", slug: "paneer-main-course" },
  { name: "Mushroom Flavor", slug: "mushroom-flavor" },
  { name: "Dal", slug: "dal" },
  { name: "Soups(Veg)", slug: "soups-veg" },
  { name: "Soups(Non-Veg)", slug: "soups-non-veg" },
  { name: "Chineese Starter(Veg)", slug: "chineese-starter-veg" },
  { name: "Chineese Starter(Non-Veg)", slug: "chineese-starter-non-veg" },
  { name: "Beverages", slug: "beverages" },
  { name: "Appetizer", slug: "appetizer" },
  { name: "Indian Snacks(Veg)", slug: "indian-snacks-veg" },
  { name: "Indian Snacks(Non-Veg)", slug: "indian-snacks-non-veg" },
  { name: "Raita & Curd", slug: "raita-curd" },
  { name: "Biryani & Pulav", slug: "biryani-pulav" },
  { name: "Biryani", slug: "biryani" },
  { name: "Desert", slug: "desert" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CategoryCards() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
      >
        {CATEGORIES.map((category) => (
          <Link key={category.slug} href={`/menu/${category.slug}`}>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(201,162,39,0.3)] transition-shadow duration-300"
            >
              {/* Background Image Placeholder */}
              {/* Replace src with dynamic category images in the future */}
              <div className="absolute inset-0 bg-[#1E1E1E]">
                <img
                  src="/interior/img 6.png" 
                  alt={category.name}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 ease-in-out"
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
