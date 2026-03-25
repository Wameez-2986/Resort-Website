"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Delete } from "lucide-react";

const KEYPAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"] as const;

export default function AdminLoginPage() {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const MAX_PIN = 6;

  const handleKey = (key: typeof KEYPAD[number]) => {
    if (key === null) return;
    if (key === "del") {
      setPin((prev) => prev.slice(0, -1));
      setError("");
      return;
    }
    if (pin.length >= MAX_PIN) return;
    const newPin = pin + String(key);
    setPin(newPin);
    setError("");

    // Auto-submit on 6 digits
    if (newPin.length === MAX_PIN) {
      submitPin(newPin);
    }
  };

  // Allow typing on physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return;
      if (e.key === "Backspace") {
        handleKey("del");
      } else if (/^[0-9]$/.test(e.key)) {
        handleKey(Number(e.key) as any);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, loading]);

  const submitPin = async (pinToSubmit: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinToSubmit }),
      });

      if (res.ok) {
        router.push("/talav-control-panel/dashboard/orders");
      } else {
        setShake(true);
        setError("Invalid PIN. Please try again.");
        setPin("");
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError("Connection error. Please try again.");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm flex flex-col items-center gap-8"
      >
        {/* Header */}
        <div className="text-center">
          <p className="text-accent/70 font-montserrat text-xs tracking-[0.3em] uppercase mb-3">
            Staff Only
          </p>
          <h1 className="text-3xl font-playfair font-bold text-white">
            Talav Resort
          </h1>
          <p className="text-white/40 font-montserrat text-sm mt-2">
            Admin Access
          </p>
        </div>

        {/* PIN Dots */}
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="flex gap-4"
        >
          {Array.from({ length: MAX_PIN }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: pin.length === i + 1 ? [1, 1.3, 1] : 1,
                backgroundColor: i < pin.length ? "#C9A227" : "transparent",
              }}
              transition={{ duration: 0.2 }}
              className="w-4 h-4 rounded-full border-2 border-accent/50"
            />
          ))}
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-sm font-montserrat text-center -mt-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {KEYPAD.map((key, i) => {
            if (key === null) {
              return <div key={i} />;
            }
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.92 }}
                onClick={() => !loading && handleKey(key)}
                disabled={loading}
                className={`
                  h-16 rounded-2xl font-semibold text-xl transition-all duration-150
                  ${key === "del"
                    ? "text-white/50 bg-white/5 hover:bg-white/10"
                    : "text-white bg-[#1A1A1A] hover:bg-[#222] border border-white/10 hover:border-accent/30"
                  }
                  disabled:opacity-50
                `}
              >
                {key === "del" ? <Delete className="w-5 h-5 mx-auto" /> : key}
              </motion.button>
            );
          })}
        </div>

        {loading && (
          <p className="text-accent text-sm font-montserrat animate-pulse">
            Verifying…
          </p>
        )}
      </motion.div>
    </div>
  );
}
