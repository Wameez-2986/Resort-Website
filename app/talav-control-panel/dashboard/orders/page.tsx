"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, Wifi, WifiOff } from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menuItem: { id: string; name: string };
};

type Order = {
  id: string;
  tableNumber: string;
  status: "Pending" | "Preparing" | "Ready" | "Served";
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_META = {
  Pending:   { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", dot: "bg-yellow-400", label: "Pending",   next: "Mark Preparing" },
  Preparing: { color: "bg-blue-500/20   text-blue-400   border-blue-500/30",   dot: "bg-blue-400",   label: "Preparing", next: "Mark Ready" },
  Ready:     { color: "bg-green-500/20  text-green-400  border-green-500/30",  dot: "bg-green-400",  label: "Ready",     next: "Mark Served" },
  Served:    { color: "bg-gray-500/20   text-gray-400   border-gray-500/30",   dot: "bg-gray-400",   label: "Served",    next: null },
};

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // ── Initial load ──────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── SSE live stream ───────────────────────────────────────────────────────
  useEffect(() => {
    const es = new EventSource("/api/admin/orders/stream");

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    // New order placed by a guest
    es.onmessage = (e) => {
      const order: Order = JSON.parse(e.data);
      setOrders((prev) => {
        const exists = prev.find((o) => o.id === order.id);
        if (exists) return prev.map((o) => (o.id === order.id ? order : o));
        return [order, ...prev]; // prepend so newest is first
      });
    };

    // Status changed by kitchen staff
    es.addEventListener("status-change", (e: MessageEvent) => {
      const updated: Order = JSON.parse(e.data);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    });

    return () => es.close();
  }, []);

  // ── Status advance ────────────────────────────────────────────────────────
  const advanceStatus = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "PATCH" });
      if (res.ok) {
        const updated: Order = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-white">Orders Board</h1>
          <p className="text-white/40 font-montserrat text-sm mt-1">Kitchen Display System</p>
        </div>

        {/* Live / disconnected indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-montserrat font-medium border ${connected ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-white/30 border-white/10"}`}>
          {connected
            ? <><Wifi className="w-3.5 h-3.5" /> Live</>
            : <><WifiOff className="w-3.5 h-3.5" /> Connecting…</>}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-[#1A1A1A] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-white/30 font-montserrat">
          No orders yet. Waiting for guests…
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {orders.map((order) => {
              const meta = STATUS_META[order.status];
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-[#161616] rounded-2xl border border-white/8 p-5 flex flex-col gap-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/40 text-xs font-montserrat">Table</p>
                      <p className="text-3xl font-playfair font-bold text-white leading-none mt-0.5">
                        {order.tableNumber}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${meta.color}`}>
                      <span className={`w-2 h-2 rounded-full ${meta.dot} ${order.status !== "Served" ? "animate-pulse" : ""}`} />
                      <span className="text-xs font-montserrat font-medium">{meta.label}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col gap-1.5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-white/70 font-montserrat">
                          <span className="text-white font-semibold">{item.quantity}×</span>{" "}
                          {item.menuItem.name}
                        </span>
                        <span className="text-white/40">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-white/30 text-xs font-montserrat">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(order.createdAt)}
                    </div>
                    <span className="text-accent font-semibold text-sm">₹{order.totalPrice}</span>
                  </div>

                  {/* Advance button */}
                  {meta.next && (
                    <button
                      onClick={() => advanceStatus(order.id)}
                      disabled={updatingId === order.id}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-accent/15 hover:text-accent text-white/60 text-sm font-montserrat font-medium transition-all border border-white/5 hover:border-accent/30 disabled:opacity-50"
                    >
                      {updatingId === order.id ? "Updating…" : meta.next}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
