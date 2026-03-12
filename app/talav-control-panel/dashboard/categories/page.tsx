"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Category = {
  id: string;
  name: string;
  image: string | null;
  displayOrder: number;
  _count: { menuItems: number };
};

const DEFAULT_FORM = { name: "", image: "", displayOrder: 0 };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, image: cat.image || "", displayOrder: cat.displayOrder });
    setEditingId(cat.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchCategories();
        setModalOpen(false);
      } else {
        const d = await res.json();
        setError(d.error || "Failed to save");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-white">Categories</h1>
          <p className="text-white/40 font-montserrat text-sm mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all font-montserrat text-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-[#1A1A1A] rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-[#161616] rounded-2xl border border-white/8 overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-16 text-center text-white/30 font-montserrat">No categories yet. Add one above.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-5 py-3 text-white/40 font-montserrat text-xs uppercase tracking-wider">Name</th>
                  <th className="text-center px-4 py-3 text-white/40 font-montserrat text-xs uppercase tracking-wider">Order</th>
                  <th className="text-center px-4 py-3 text-white/40 font-montserrat text-xs uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 text-white font-montserrat font-medium">{cat.name}</td>
                    <td className="px-4 py-4 text-center text-white/50 font-montserrat text-sm">{cat.displayOrder}</td>
                    <td className="px-4 py-4 text-center text-white/50 font-montserrat text-sm">{cat._count.menuItems}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(cat)} className="p-2 text-white/30 hover:text-accent hover:bg-accent/10 rounded-lg transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(cat)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-playfair font-bold text-white">{editingId ? "Edit" : "Add"} Category</h2>
                  <button onClick={() => setModalOpen(false)} className="p-1.5 text-white/30 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5 font-montserrat">Category Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 font-montserrat text-sm" placeholder="e.g. Tandoor Starter (Veg)" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5 font-montserrat">Image URL (optional)</label>
                    <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 font-montserrat text-sm" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5 font-montserrat">Display Order</label>
                    <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 font-montserrat text-sm" />
                  </div>
                  {error && <p className="text-red-400 text-sm font-montserrat">{error}</p>}
                  <button onClick={handleSave} disabled={saving}
                    className="w-full py-3 bg-accent text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all font-montserrat disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? "Saving…" : <><Check className="w-4 h-4" /> Save Category</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-[#1A1A1A] rounded-2xl border border-red-500/20 p-6 w-full max-w-sm shadow-2xl text-center">
                <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-4" />
                <h2 className="text-lg font-playfair font-bold text-white mb-2">Delete Category?</h2>
                <p className="text-white/50 font-montserrat text-sm mb-4">
                  <strong className="text-white">{deleteConfirm.name}</strong> has{" "}
                  <strong className="text-accent">{deleteConfirm._count.menuItems} menu items</strong>.
                  Deleting it will also remove all items inside.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 font-montserrat text-sm hover:bg-white/5 transition-all">Cancel</button>
                  <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-montserrat text-sm hover:bg-red-500/30 transition-all">Delete</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
