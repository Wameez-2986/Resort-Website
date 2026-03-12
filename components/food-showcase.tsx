"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const FOOD_IMAGES = [
  "/interior/img 6.png",
  "/interior/img 7.png",
  "/interior/img 8.png",
  "/interior/img 9.png",
  "/interior/img 10.png",
];

export function FoodShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FOOD_IMAGES.length);
    }, 4500); // 4.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-[#0F0F0F] overflow-hidden flex flex-col items-center justify-center">
      
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative text-center px-4 z-10"
      >
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-accent mb-6 drop-shadow-2xl">
          Our Signature Menu
        </h2>
        <div className="w-32 h-1 bg-accent/80 mx-auto rounded-full drop-shadow-lg" />
      </motion.div>

      {/* Image Carousel */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={FOOD_IMAGES[currentIndex]}
            alt={`Signature dish ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 4.5, ease: "linear" }, // Slow subtle zoom
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0F0F0F] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#0F0F0F]/80 to-transparent pointer-events-none" />
      </div>

    </section>
  );
}
