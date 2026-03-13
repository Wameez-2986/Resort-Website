"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, ImagePlus } from "lucide-react";

type Category = {
  id: string;
  name: string;
  image: string | null;
  displayOrder: number;
  _count: { menuItems: number };
};

const DEFAULT_FORM = { name: "", image: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setForm(DEFAULT_FORM);
    setPreview("");
    setEditingId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, image: cat.image || "" });
    setPreview(cat.image || "");
    setEditingId(cat.id);
    setError("");
    setModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setForm((prev) => ({ ...prev, image: url }));
      } else {
        setError("Image upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (uploading) { setError("Please wait, image is still uploading…"); return; }
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
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
                  <th className="text-center px-4 py-3 text-white/40 font-montserrat text-xs uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 flex items-center gap-3">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <ImagePlus className="w-4 h-4 text-white/20" />
                        </div>
                      )}
                      <span className="text-white font-montserrat font-medium">{cat.name}</span>
                    </td>
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
          <motion.div key="category-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 bg-[#1A1A1A] rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-playfair font-bold text-white">{editingId ? "Edit" : "Add"} Category</h2>
                <button onClick={() => setModalOpen(false)} className="p-1.5 text-white/30 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Category Name */}
                <div>
                  <label className="block text-white/60 text-sm mb-1.5 font-montserrat">Category Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 font-montserrat text-sm"
                    placeholder="e.g. Tandoor Starter (Veg)"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-white/60 text-sm mb-1.5 font-montserrat">Category Image</label>

                  {/* Hidden native file input */}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Preview / Picker button */}
                  {preview ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                      {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/70 text-white text-xs font-montserrat rounded-lg hover:bg-black transition-all"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full h-28 rounded-xl border-2 border-dashed border-white/10 hover:border-accent/40 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-accent transition-all"
                    >
                      <ImagePlus className="w-6 h-6" />
                      <span className="text-xs font-montserrat">Tap to select from gallery or files</span>
                    </button>
                  )}
                </div>

                {error && <p className="text-red-400 text-sm font-montserrat">{error}</p>}

                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="w-full py-3 bg-accent text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all font-montserrat disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? "Saving…" : uploading ? "Uploading image…" : <><Check className="w-4 h-4" /> Save Category</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div key="delete-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setDeleteConfirm(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 bg-[#1A1A1A] rounded-2xl border border-red-500/20 p-6 w-full max-w-sm shadow-2xl text-center">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
