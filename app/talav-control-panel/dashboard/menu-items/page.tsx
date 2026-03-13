"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight } from "lucide-react";

type Category = { id: string; name: string };
type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  available: boolean;
  categoryId: string;
  category: { id: string; name: string };
};

const DEFAULT_FORM = { name: "", description: "", price: "", image: "", categoryId: "", available: true };

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<MenuItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const fetchData = async () => {
    const [itemsRes, catsRes] = await Promise.all([
      fetch("/api/admin/menu-items"),
      fetch("/api/admin/categories"),
    ]);
    if (itemsRes.ok) setItems(await itemsRes.json());
    if (catsRes.ok) setCategories(await catsRes.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setForm({ name: item.name, description: item.description || "", price: String(item.price), image: item.image || "", categoryId: item.categoryId, available: item.available });
    setEditingId(item.id);
    setError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.categoryId) { setError("Name, price and category are required"); return; }
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/admin/menu-items/${editingId}` : "/api/admin/menu-items";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { await fetchData(); setModalOpen(false); }
      else { const d = await res.json(); setError(d.error || "Failed to save"); }
    } finally { setSaving(false); }
  };

  const toggleAvailability = async (item: MenuItem) => {
    const res = await fetch(`/api/admin/menu-items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    if (res.ok) setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, available: !i.available } : i));
  };

  const handleDelete = async (item: MenuItem) => {
    const res = await fetch(`/api/admin/menu-items/${item.id}`, { method: "DELETE" });
    if (res.ok) { setItems((prev) => prev.filter((i) => i.id !== item.id)); setDeleteConfirm(null); }
  };

  const filtered = filterCat === "all" ? items : items.filter((i) => i.categoryId === filterCat);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-white">Menu Items</h1>
          <p className="text-white/40 font-montserrat text-sm mt-1">{items.length} items</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all font-montserrat text-sm">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        <button onClick={() => setFilterCat("all")} className={`px-3 py-1.5 rounded-full font-montserrat text-xs whitespace-nowrap transition-all ${filterCat === "all" ? "bg-accent text-black font-semibold" : "bg-white/5 text-white/50 hover:text-white"}`}>All</button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setFilterCat(cat.id)} className={`px-3 py-1.5 rounded-full font-montserrat text-xs whitespace-nowrap transition-all ${filterCat === cat.id ? "bg-accent text-black font-semibold" : "bg-white/5 text-white/50 hover:text-white"}`}>{cat.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-[#1A1A1A] rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-[#161616] rounded-2xl border border-white/8 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-16 text-center text-white/30 font-montserrat">No items found. Add some above.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-5 py-3 text-white/40 font-montserrat text-xs uppercase tracking-wider">Item</th>
                  <th className="text-left px-4 py-3 text-white/40 font-montserrat text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-right px-4 py-3 text-white/40 font-montserrat text-xs uppercase tracking-wider">Price</th>
                  <th className="text-center px-4 py-3 text-white/40 font-montserrat text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-white font-montserrat font-medium text-sm">{item.name}</p>
                      {item.description && <p className="text-white/30 text-xs mt-0.5 line-clamp-1">{item.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-white/50 font-montserrat text-sm hidden md:table-cell">{item.category.name}</td>
                    <td className="px-4 py-3 text-right text-accent font-semibold text-sm">₹{item.price}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleAvailability(item)} className="transition-all">
                        {item.available
                          ? <ToggleRight className="w-6 h-6 text-green-400 mx-auto" />
                          : <ToggleLeft className="w-6 h-6 text-white/20 mx-auto" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 text-white/30 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(item)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div key="menu-item-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 bg-[#1A1A1A] rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-playfair font-bold text-white">{editingId ? "Edit" : "Add"} Menu Item</h2>
                <button onClick={() => setModalOpen(false)} className="p-1.5 text-white/30 hover:text-white rounded-lg hover:bg-white/10 transition-all"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Item Name *", key: "name", placeholder: "e.g. Paneer Tikka" },
                  { label: "Price (₹) *", key: "price", placeholder: "320" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-white/60 text-sm mb-1.5 font-montserrat">{label}</label>
                    <input
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      type={key === "price" ? "number" : "text"}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 font-montserrat text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-white/60 text-sm mb-1.5 font-montserrat">Category *</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 font-montserrat text-sm">
                    <option value="">Select category…</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between py-2">
                  <label className="font-montserrat text-sm text-white/60">Available</label>
                  <button onClick={() => setForm({ ...form, available: !form.available })} className="transition-colors">
                    {form.available ? <ToggleRight className="w-7 h-7 text-green-400" /> : <ToggleLeft className="w-7 h-7 text-white/20" />}
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm font-montserrat">{error}</p>}
                <button onClick={handleSave} disabled={saving}
                  className="w-full py-3 bg-accent text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all font-montserrat disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? "Saving…" : <><Check className="w-4 h-4" /> Save Item</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div key="delete-item-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setDeleteConfirm(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 bg-[#1A1A1A] rounded-2xl border border-red-500/20 p-6 w-full max-w-sm shadow-2xl text-center">
              <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg font-playfair font-bold text-white mb-2">Delete Item?</h2>
              <p className="text-white/50 font-montserrat text-sm mb-6">Delete <strong className="text-white">{deleteConfirm.name}</strong>?</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 font-montserrat text-sm hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-montserrat text-sm hover:bg-red-500/30 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
