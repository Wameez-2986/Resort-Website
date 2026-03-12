"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const { isDrawerOpen, setDrawerOpen, items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!tableNumber.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableNumber,
          items,
          notes,
          totalPrice
        }),
      });

      const data = await response.json();

      if (response.ok) {
        clearCart();
        setDrawerOpen(false);
        // Redirect to confirmation page with params
        router.push(`/order-confirmation?table=${encodeURIComponent(tableNumber)}&id=${encodeURIComponent(data.orderId)}`);
      } else {
        alert(data.error || "Failed to place order.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSubmitting && setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#121212] border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-[80] flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3 text-white">
                <ShoppingBag className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-playfair font-semibold">Your Order</h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                disabled={isSubmitting}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 hide-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/40">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                  <p className="font-montserrat">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 pb-6 border-b border-white/5">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-white font-medium font-montserrat">{item.name}</h4>
                      <button 
                        onClick={() => removeItem(item.id)}
                        disabled={isSubmitting}
                        className="text-white/30 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-accent font-semibold">₹{item.price * item.quantity}</span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-full border border-white/10 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={isSubmitting}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white min-w-[20px] text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={isSubmitting}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Order Info Fields */}
              {items.length > 0 && (
                <div className="flex flex-col gap-4 mt-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2 font-montserrat">Table Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 12"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2 font-montserrat">Order Notes (Optional)</label>
                    <textarea
                      placeholder="Spicy, no onions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors min-h-[100px] resize-none disabled:opacity-50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-[#121212] border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/70 font-montserrat">Total Amount</span>
                  <span className="text-2xl font-bold text-accent">₹{totalPrice}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={!tableNumber.trim() || isSubmitting}
                  className="w-full py-4 bg-accent text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all duration-300 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(201,162,39,0.2)] flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    tableNumber.trim() ? "Place Order" : "Enter Table Number"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
