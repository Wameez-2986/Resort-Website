"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import confetti from "canvas-confetti";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<string>("Pending");
  const [connected, setConnected] = useState(false);
  
  const tableNumber = searchParams.get("table");
  const orderId = searchParams.get("id");

  useEffect(() => {
    setMounted(true);
    
    // Trigger subtle confetti burst on load
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5, angle: 60, spread: 55,
        origin: { x: 0 }, colors: ['#C9A227', '#FFFFFF']
      });
      confetti({
        particleCount: 5, angle: 120, spread: 55,
        origin: { x: 1 }, colors: ['#C9A227', '#FFFFFF']
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };
    
    setTimeout(() => { frame(); }, 500);
  }, []);

  // ── SSE Live Status ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!orderId) return;

    const es = new EventSource(`/api/order/status/${orderId}`);

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    es.addEventListener("initial-status", (e) => {
      const data = JSON.parse(e.data);
      setStatus(data.status);
    });

    es.addEventListener("status-change", (e) => {
      const data = JSON.parse(e.data);
      setStatus(data.status);
      
      // Joyful feedback on progress
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A227', '#FFFFFF']
      });
    });

    return () => es.close();
  }, [orderId]);

  if (!mounted) return null;

  const steps = ["Pending", "Preparing", "Ready", "Served"];
  const currentStepIndex = steps.indexOf(status);

  return (
    <>
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center p-6 text-center transition-all duration-700">
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
              className="w-full h-full text-[#C9A227]"
              initial="hidden"
              animate="visible"
            >
              <motion.circle
                cx="25" cy="25" r="23"
                fill="none" stroke="currentColor" strokeWidth="2"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1, opacity: 1,
                    transition: { duration: 1, ease: "easeInOut" }
                  }
                }}
              />
              <motion.path
                fill="none" stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
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
            {status === "Served" ? "Enjoy Your Meal!" : status === "Ready" ? "Order Ready!" : "Order Received!"}
          </h1>
          <p className="text-white/60 font-montserrat text-lg mb-8">
            {status === "Served" 
              ? "We hope you have a wonderful experience." 
              : status === "Ready" 
                ? "Your order is ready for collection/service."
                : "Thank you for choosing Talav Resort."}
          </p>

          {/* Status Stepper */}
          <div className="w-full mb-8 px-2">
            <div className="flex justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0" />
              {/* Active Progress Line */}
              <motion.div 
                className="absolute top-1/2 left-0 h-0.5 bg-[#C9A227] -translate-y-1/2 z-0"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              
              {steps.map((s, i) => {
                const isActive = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                
                return (
                  <div key={s} className="relative z-10 flex flex-col items-center">
                    <motion.div 
                      animate={{ 
                        scale: isCurrent ? 1.2 : 1,
                        backgroundColor: isActive ? "#C9A227" : "#1A1A1A",
                        borderColor: isActive ? "#C9A227" : "rgba(255,255,255,0.1)"
                      }}
                      className="w-4 h-4 rounded-full border-2 transition-colors duration-500"
                    >
                      {isCurrent && (
                        <motion.div 
                          className="w-full h-full rounded-full bg-[#C9A227] animate-ping opacity-40"
                        />
                      )}
                    </motion.div>
                    <span className={`text-[10px] uppercase tracking-tighter mt-2 font-montserrat font-bold transition-colors duration-500 ${isActive ? "text-white" : "text-white/20"}`}>
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#1A1A1A] w-full rounded-2xl p-6 border border-white/10 shadow-lg mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-white/50 font-montserrat">Table Number</span>
                <span className="text-xl font-bold text-white">{tableNumber || "N/A"}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-white/50 font-montserrat">Current Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-montserrat border ${
                  status === "Pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                  status === "Preparing" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  status === "Ready" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                  "bg-white/10 text-white/40 border-white/10"
                }`}>
                  {status}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-white/50 font-montserrat">
                  {status === "Pending" ? "Estimated Prep Time" : "Estimated Completion"}
                </span>
                <span className="text-lg font-semibold text-[#C9A227]">
                  {status === "Pending" ? "20 - 25 mins" : 
                   status === "Preparing" ? "10 - 15 mins" :
                   status === "Ready" ? "Available Now" : "Order Completed"}
                </span>
              </div>
            </div>
          </div>

          <Link href="/menu" className="w-full">
            <button className="w-full py-4 bg-transparent border border-[#C9A227] text-[#C9A227] font-semibold rounded-xl hover:bg-[#C9A227] hover:text-black transition-all duration-300 font-montserrat uppercase tracking-wider shadow-[0_0_10px_rgba(201,162,39,0)] hover:shadow-[0_0_15px_rgba(201,162,39,0.3)]">
              Order More
            </button>
          </Link>
          
          {!connected && orderId && (
            <p className="mt-4 text-[10px] text-white/20 font-montserrat animate-pulse">
              Reconnecting for live updates...
            </p>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
