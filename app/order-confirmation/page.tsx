"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import confetti from "canvas-confetti";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  const tableNumber = searchParams.get("table");
  const orderId = searchParams.get("id");

  useEffect(() => {
    setMounted(true);
    
    // Trigger subtle confetti burst on load
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C9A227', '#FFFFFF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C9A227', '#FFFFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    // small delay before confetti
    setTimeout(() => {
      frame();
    }, 500);

  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full flex flex-col items-center"
      >
        {/* Animated Checkmark SVG */}
        <div className="w-24 h-24 mb-8">
          <motion.svg
            viewBox="0 0 50 50"
            className="w-full h-full text-accent"
            initial="hidden"
            animate="visible"
          >
            <motion.circle
              cx="25"
              cy="25"
              r="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: { duration: 1, ease: "easeInOut" }
                }
              }}
            />
            <motion.path
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 26 L22 34 L38 16"
              variants={{
                hidden: { pathLength: 0 },
                visible: {
                  pathLength: 1,
                  transition: { duration: 0.8, ease: "easeOut", delay: 0.5 }
                }
              }}
            />
          </motion.svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-2">
          Order Received!
        </h1>
        <p className="text-white/60 font-montserrat text-lg mb-8">
          Thank you for choosing Talav Resort.
        </p>

        <div className="bg-[#1A1A1A] w-full rounded-2xl p-6 border border-white/10 shadow-lg mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-white/50 font-montserrat">Table Number</span>
              <span className="text-xl font-bold text-white">{tableNumber || "N/A"}</span>
            </div>
            {orderId && (
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-white/50 font-montserrat">Order ID</span>
                <span className="text-white/80 font-mono tracking-wider text-sm">{orderId}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="text-white/50 font-montserrat">Estimated Prep Time</span>
              <span className="text-lg font-semibold text-accent">20 - 25 mins</span>
            </div>
          </div>
        </div>

        <Link href="/menu" className="w-full">
          <button className="w-full py-4 bg-transparent border border-accent text-accent font-semibold rounded-xl hover:bg-accent hover:text-black transition-all duration-300 font-montserrat uppercase tracking-wider shadow-[0_0_10px_rgba(201,162,39,0)] hover:shadow-[0_0_15px_rgba(201,162,39,0.3)]">
            Order More
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
