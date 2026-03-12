"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { use } from "react";
import { useCart } from "@/context/cart-context";

// Mock data generator for items
const generateMockItems = (category: string) => {
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `${category}-item-${i}`,
    name: `${category.replace(/-/g, " ")} Special ${i + 1}`,
    description: "A rich, flavorful dish prepared with authentic spices and fresh ingredients, perfectly curated for your luxury dining experience.",
    price: Math.floor(Math.random() * (1200 - 300) + 300),
  }));
};

const formatCategoryName = (slug: string) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("Veg", "(Veg)")
    .replace("Non", "Non-Veg")
    .replace("(Veg) Non-Veg", "(Non-Veg)"); // Simple formatting fix
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = use(params);
  const items = generateMockItems(resolvedParams.category);
  const { addItem, setDrawerOpen } = useCart();

  return (
    <div className="w-full flex flex-col min-h-screen pb-32">
      {/* Structural Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0F0F0F]/90 backdrop-blur-md border-b border-white/10 px-4 py-4 md:px-8 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
          <Link
            href="/menu"
            className="p-2 -ml-2 text-white/70 hover:text-accent transition-colors flex items-center justify-center rounded-full hover:bg-white/5"
            aria-label="Back to Menu"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          
          <h1 className="text-xl md:text-2xl font-playfair font-bold text-white tracking-wider absolute left-1/2 -translate-x-1/2">
            TALAV RESORT
          </h1>
          
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Category Title */}
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-accent capitalize text-center mb-1">
            {formatCategoryName(resolvedParams.category)}
          </h2>
          <div className="w-12 h-0.5 bg-accent/50 rounded-full" />
        </div>
      </header>

      {/* Menu Items Grid */}
      <main className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 flex-1">
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
              <div className="flex justify-between items-start mb-3 gap-4">
                <h4 className="text-lg font-montserrat font-medium text-white group-hover:text-accent transition-colors">
                  {item.name}
                </h4>
                <span className="text-accent font-semibold whitespace-nowrap text-lg">
                  ₹{item.price}
                </span>
              </div>
              
              <p className="text-white/50 text-sm leading-relaxed font-montserrat flex-1 mb-6">
                {item.description}
              </p>
              
              <button 
                onClick={() => {
                  addItem({ id: item.id, name: item.name, price: item.price });
                }}
                className="w-full py-3 px-4 bg-transparent border border-accent/50 text-accent font-semibold rounded-xl hover:bg-accent hover:text-black transition-all duration-300 font-montserrat uppercase tracking-wider text-sm shadow-[0_0_10px_rgba(201,162,39,0)] hover:shadow-[0_0_15px_rgba(201,162,39,0.3)] cursor-pointer"
              >
                Add+
              </button>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
