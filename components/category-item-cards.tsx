"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/cart-context";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  available: boolean;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CategoryItemCards({ items }: { items: MenuItem[] }) {
  const { addItem } = useCart();

  return (
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
  );
}
