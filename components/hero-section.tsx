"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

const IMAGES = [
  "/exterior/img 1.png",
  "/exterior/img 2.png",
  "/exterior/img 3.png",
  "/exterior/img 4.png",
  "/exterior/img 5.png",
];



export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5500); // 5.5 seconds
    return () => clearInterval(timer);
  }, []);

  const scrollToMenu = () => {
    // Add smooth scroll to menu section logic later
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background Image Slider with Ken Burns Effect */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 6, ease: "linear" }, // Ken Burns slow zoom
          }}
          className="absolute inset-0"
        >
          <img
            src={IMAGES[currentIndex]}
            alt={`Talav Resort view ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
        
        {/* Resort Name */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-playfair font-semibold text-white mb-4 drop-shadow-lg"
        >
          Talav Resort
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-2xl md:text-3xl font-playfair text-accent italic mb-3 drop-shadow-md"
        >
          A Taste of Luxury
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-white/80 font-montserrat tracking-wide max-w-sm"
        >
          Curated Flavors for Your Experience
        </motion.p>

        {/* Explore CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-12"
        >
          <Link
            href="/menu"
            className="inline-block px-8 py-3 bg-accent text-black font-semibold rounded-full hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(201,162,39,0.5)] transition-all duration-300 font-montserrat"
          >
            Explore Menu
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
