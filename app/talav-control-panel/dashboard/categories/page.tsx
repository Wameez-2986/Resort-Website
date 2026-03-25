"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, ImagePlus, ImageIcon, Loader2, Image as ImageIcon2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

type Category = {
  id: string;
  name: string;
  image        : string | null;
  imageKey     : string | null;
  displayOrder : number;
  _count       : { menuItems: number };
};

const DEFAULT_FORM = { name: "", image: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        setImageUrl(res[0].ufsUrl);
        setImageKey(res[0].key);
      }
      setUploading(false);
    },
    onUploadError: (error) => {
      setError(`Upload Error: ${error.message}`);
      setUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
    setUploading(true);

    // Start upload
    await startUpload([file]);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setImageUrl("");
    setImageKey("");
    setError("");
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, image: cat.image || "" });
    setEditingId(cat.id);
    setImageUrl(cat.image || "");
    setImageKey(cat.imageKey || "");
    setError("");
    setModalOpen(true);
  };



  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }

    // --- Optimistic UI Update ---
    const isEditing = !!editingId;
    const optimisticCategory: Category = {
      id: editingId || `temp-${Date.now()}`,
      name: form.name,
      image: imageUrl || null,
      imageKey: imageKey || null,
      displayOrder: categories.length,
      _count: { menuItems: 0 },
    };

    if (isEditing) {
      // Find old items count for the edit to avoid flashing 0
      const oldCat = categories.find(c => c.id === editingId);
      optimisticCategory._count = oldCat?._count || { menuItems: 0 };
      setCategories((prev) => prev.map((c) => (c.id === editingId ? optimisticCategory : c)));
    } else {
      setCategories((prev) => [...prev, optimisticCategory]);
    }

    setModalOpen(false); // Instantly close the modal
    // ---------------------------

    setSaving(true);
    setError("");
    try {
      // 2. Save category
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrl, imageKey: imageKey }),
      });
      
      if (res.ok) {
        // Silently sync the newly created ID/image to the interface
        fetchCategories();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to save category");
        fetchCategories(); // Revert on failure
      }
    } catch (e: any) {
      alert(e.message || "An error occurred while saving");
      fetchCategories();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    setCategories((prev) => prev.filter((c) => c.id !== cat.id)); // Optimistic delete
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    if (!res.ok) {
      await fetchCategories(); // Revert on failure
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
                        <button onClick={() => handleDelete(cat)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
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

                {/* Custom Upload Dropzone */}
                <div>
                  <label className="block text-white/60 text-sm mb-1.5 font-montserrat">Category Image</label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    
                    {imageUrl ? (
                      <div className="relative rounded-2xl overflow-hidden group border border-white/10">
                        <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-2xl" />
                        {isUploading || uploading ? (
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Loader2 className="w-8 h-8 animate-spin text-accent" />
                           </div>
                        ) : (
                          <button
                            onClick={() => { setImageUrl(""); setImageKey(""); }}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-accent/30 hover:bg-white/5 transition-all h-40 bg-white/[0.02]"
                      >
                        <ImageIcon className="w-10 h-10 text-white/20" />
                        <span className="text-white/40 text-sm font-montserrat text-center">
                          {isUploading || uploading ? "Uploading..." : "Tap to select from gallery or files"}
                        </span>
                        {(isUploading || uploading) && <Loader2 className="w-5 h-5 animate-spin text-accent" />}
                      </div>
                    )}
                  </div>
                </div>



                {error && <p className="text-red-400 text-sm font-montserrat">{error}</p>}

                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-accent text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all font-montserrat flex items-center justify-center gap-2"
                >
                  <><Check className="w-4 h-4" /> Save Category</>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
