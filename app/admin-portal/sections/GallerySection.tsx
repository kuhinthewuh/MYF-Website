'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, Plus, CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react';

interface ToastState { show: boolean; message: string; isError: boolean; }

function Toast({ toast }: { toast: ToastState }) {
  if (!toast.show) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-sans font-semibold ${toast.isError ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
      <CheckCircle className="w-4 h-4" />
      {toast.message}
    </div>
  );
}

export default function GallerySection() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', isError: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch('/api/admin/content?section=gallery');
        const { data } = await res.json();
        if (data?.images) setImages(data.images);
        else {
          // Seed with default images
          setImages([
            '/images/gallery/placeholder-1.png',
            '/images/gallery/placeholder-2.png',
            '/images/gallery/placeholder-3.png',
            '/images/gallery/placeholder-4.png',
          ]);
        }
      } catch { /* use defaults */ }
      setLoading(false);
    }
    loadGallery();
  }, []);

  function showToast(message: string, isError = false) {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3500);
  }

  async function saveGallery(newImages: string[]) {
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'gallery', data: { images: newImages } }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
  }

  async function handleAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery');

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      const newImages = [...images, json.url];
      setImages(newImages);
      await saveGallery(newImages);
      showToast('✅ Image added to gallery and is now live!');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Upload failed', true);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(url: string) {
    const newImages = images.filter((img) => img !== url);
    try {
      setImages(newImages);
      await saveGallery(newImages);
      showToast('Image removed from gallery.');
    } catch (err: unknown) {
      setImages(images); // revert
      showToast(err instanceof Error ? err.message : 'Delete failed', true);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} />

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Photo Gallery</h2>
          <p className="text-white/40 text-sm font-sans">
            {images.length} image{images.length !== 1 ? 's' : ''} in the slideshow. Add or remove images below.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#00B4CC] to-[#0090a8] hover:from-[#00c4de] hover:to-[#00a0bc] disabled:opacity-40 text-white font-bold rounded-xl text-sm font-sans transition-all hover:-translate-y-0.5"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Add Image'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAddImage}
        />
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 hover:border-[#00B4CC]/40 rounded-2xl p-16 flex flex-col items-center gap-3 cursor-pointer transition-all group"
        >
          <ImageIcon className="w-12 h-12 text-white/20 group-hover:text-[#00B4CC]/40 transition-colors" />
          <p className="text-white/40 font-semibold font-sans">No gallery images yet. Click to add the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((url, idx) => (
            <div key={url} className="relative group rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                <span className="text-white/70 text-xs font-sans">Slide {idx + 1}</span>
                <button
                  onClick={() => handleDelete(url)}
                  className="w-9 h-9 bg-red-500/80 hover:bg-red-500 rounded-xl flex items-center justify-center transition-colors"
                  title="Remove from gallery"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}

          {/* Add More Tile */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video border-2 border-dashed border-white/15 hover:border-[#00B4CC]/40 bg-white/3 hover:bg-[#00B4CC]/5 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-[#00B4CC] animate-spin" />
            ) : (
              <>
                <Upload className="w-5 h-5 text-white/20 group-hover:text-[#00B4CC]/50 transition-colors" />
                <p className="text-white/25 text-xs font-sans">Add More</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
