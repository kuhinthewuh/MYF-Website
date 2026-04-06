'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useEffect, useRef } from 'react';
import { Upload, Save, CheckCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ToastState {
  show: boolean;
  message: string;
  isError: boolean;
}

function Toast({ toast }: { toast: ToastState }) {
  if (!toast.show) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-sans font-semibold animate-in slide-in-from-top-2 ${toast.isError ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
      <CheckCircle className="w-4 h-4" />
      {toast.message}
    </div>
  );
}

export default function HeroSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  useEffect(() => {
    registerSaveAction('hero', handleSave);
    return () => unregisterSaveAction('hero');
  });

  const [currentImageUrl, setCurrentImageUrl] = useState<string>('/images/headers/2026-banner.png');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', isError: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showToast(message: string, isError = false) {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3500);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'hero');

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCurrentImageUrl(json.url);
      showToast('Image uploaded! Click "Save Changes" to publish.');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Upload failed', true);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'hero', data: { imagePath: currentImageUrl } }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast('✅ Hero banner updated! Changes are now live.');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save failed', true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} />

      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Hero Header</h2>
        <p className="text-white/40 text-sm font-sans">Replace the banner image that appears at the top of the website.</p>
      </div>

      {/* Current Image Preview */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3 font-sans">Current Banner</p>
        <div className="relative w-full aspect-[21/9] bg-white/5 rounded-xl overflow-hidden border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImageUrl}
            alt="Current hero banner"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <ImageIcon className="w-16 h-16 text-white/10" />
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/20 hover:border-myf-teal/50 bg-white/3 hover:bg-myf-teal/5 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
      >
        <div className="w-14 h-14 bg-white/5 group-hover:bg-myf-teal/10 rounded-2xl flex items-center justify-center transition-all">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-myf-teal animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-white/30 group-hover:text-myf-teal transition-colors" />
          )}
        </div>
        <div className="text-center">
          <p className="text-white/70 font-semibold font-sans">{uploading ? 'Uploading...' : 'Click to Upload New Banner'}</p>
          <p className="text-white/30 text-xs font-sans mt-1">PNG, JPG, WebP — Recommended: 1400×650px</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || uploading}
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-myf-teal to-myf-tealDeep hover:from-myf-teal hover:to-myf-tealDeep disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl font-sans transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-myf-teal/30"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'Publishing...' : 'Save Changes'}
      </button>
    </div>
  );
}
