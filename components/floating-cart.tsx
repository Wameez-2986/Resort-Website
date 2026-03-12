"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useEffect, useState } from "react";

export function FloatingCart() {
  const { totalItems, setDrawerOpen } = useCart();
  const [isBouncing, setIsBouncing] = useState(false);

  // Trigger bounce animation whenever totalItems changes
  useEffect(() => {
    if (totalItems > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  if (totalItems === 0) return null; // Only show cart if there are items

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: isBouncing ? 1.1 : 1,
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 15
      }}
      onClick={() => setDrawerOpen(true)}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] bg-accent text-black p-4 rounded-full shadow-[0_5px_20px_rgba(201,162,39,0.4)] hover:shadow-[0_5px_25px_rgba(201,162,39,0.6)] hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center cursor-pointer"
    >
      <ShoppingBag className="w-6 h-6 md:w-8 md:h-8" />
      
      {/* Badge */}
      <motion.span 
        key={totalItems} // forces re-render of badge animation on count change
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#0F0F0F]"
      >
        {totalItems}
      </motion.span>
    </motion.button>
  );
}
