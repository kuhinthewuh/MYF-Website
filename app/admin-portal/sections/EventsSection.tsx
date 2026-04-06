'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useRef, useEffect } from 'react';
import { Upload, Save, Link, Loader2, CheckCircle, Image as ImageIcon, Type, Palette } from 'lucide-react';

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

interface WidgetState {
  imagePath: string;
  registrationLink: string;
  headerText: string;
  headerColor: string;
  enabled?: boolean;
}

function EventWidget({
  title,
  widgetKey,
  state,
  onChange,
  onSave,
  onUpload,
  uploading,
  saving,
}: {
  title: string;
  widgetKey: string;
  state: WidgetState;
  onChange: (key: string, field: keyof WidgetState, value: string) => void;
  onSave: (key: string) => void;
  onUpload: (key: string, file: File) => void;
  uploading: string | null;
  saving: string | null;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-myf-teal to-myf-gold rounded-full" />
          <h3 className="text-lg font-bold text-white font-sans">{title}</h3>
        </div>

        {/* Toggle Widget Visibility */}
        <label className="flex items-center cursor-pointer gap-2 group">
          <span className="text-sm font-sans font-bold text-white/50">{state.enabled !== false ? 'Enabled' : 'Disabled'}</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only"
              checked={state.enabled !== false} 
              onChange={(e) => onChange(widgetKey, 'enabled', e.target.checked as any)} 
            />
            <div className={`block w-11 h-6 rounded-full transition-colors ${state.enabled !== false ? 'bg-myf-teal' : 'bg-white/20'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${state.enabled !== false ? 'transform translate-x-5' : ''}`}></div>
          </div>
        </label>
      </div>

      {/* ── Header Text ── */}
      <div>
        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block font-sans">
          Widget Header Text
        </label>
        <div className="relative">
          <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={state.headerText}
            onChange={(e) => onChange(widgetKey, 'headerText', e.target.value)}
            placeholder="e.g. Current Events"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm font-sans focus:outline-none focus:border-myf-teal/50 transition-all"
          />
        </div>
      </div>

      {/* ── Header Font Color ── */}
      <div>
        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block font-sans">
          Header Font Color
        </label>
        <div className="flex items-center gap-3">
          {/* Native color swatch */}
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0 cursor-pointer">
            <input
              type="color"
              value={state.headerColor}
              onChange={(e) => onChange(widgetKey, 'headerColor', e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Pick header color"
            />
            <div
              className="w-full h-full rounded-xl"
              style={{ backgroundColor: state.headerColor }}
            />
            <Palette className="absolute bottom-0.5 right-0.5 w-3 h-3 text-white/60 drop-shadow" />
          </div>
          {/* Hex value display / manual input */}
          <input
            type="text"
            value={state.headerColor}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                onChange(widgetKey, 'headerColor', val);
              }
            }}
            maxLength={7}
            placeholder="#1E3354"
            className="w-36 bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-3 py-3 text-sm font-mono focus:outline-none focus:border-myf-teal/50 transition-all"
          />
          {/* Live preview */}
          <span
            className="text-base font-bold font-sans flex-1 truncate"
            style={{ color: state.headerColor }}
          >
            {state.headerText || 'Preview'}
          </span>
        </div>
        <p className="text-white/25 text-xs font-sans mt-1.5">
          Click the swatch to open the color picker, or type a hex value directly.
        </p>
      </div>

      {/* ── Image Preview & Upload ── */}
      <div>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 font-sans">Flyer / Image</p>
        <div className="flex gap-4 items-start">
          <div className="relative w-24 h-24 flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {state.imagePath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={state.imagePath} alt={title} className="w-full h-full object-contain p-1" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="w-8 h-8 text-white/20" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading === widgetKey}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white/80 hover:text-white rounded-xl text-sm font-semibold font-sans transition-all disabled:opacity-40"
            >
              {uploading === widgetKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploading === widgetKey ? 'Uploading...' : 'Upload New Image'}
            </button>
            <p className="text-white/25 text-xs font-sans mt-1.5">Horizontal, vertical, or square — all work</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(widgetKey, file);
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Registration Link ── */}
      <div>
        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block font-sans">
          "Register Now" Button Link
        </label>
        <div className="relative">
          <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="url"
            value={state.registrationLink}
            onChange={(e) => onChange(widgetKey, 'registrationLink', e.target.value)}
            placeholder="https://forms.google.com/..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm font-sans focus:outline-none focus:border-myf-teal/50 transition-all"
          />
        </div>
      </div>

      {/* ── Save Button ── */}
      <button
        onClick={() => onSave(widgetKey)}
        disabled={saving === widgetKey || uploading === widgetKey}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-myf-teal to-myf-tealDeep hover:from-myf-teal hover:to-myf-tealDeep disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm font-sans transition-all hover:-translate-y-0.5"
      >
        {saving === widgetKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        {saving === widgetKey ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

const DEFAULT_STATE: Record<string, WidgetState> = {
  currentEvents: {
    imagePath: '/images/events/current-event-placeholder.png',
    registrationLink: '#',
    headerText: 'Current Events',
    headerColor: '#1E3354',
    enabled: true,
  },
  contestantWidget: {
    imagePath: '/images/events/current-event-placeholder.png',
    registrationLink: '#',
    headerText: 'Become a Contestant',
    headerColor: '#1a2b3c',
    enabled: true,
  },
};

export default function EventsSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  
  const [widgets, setWidgets] = useState(DEFAULT_STATE);
  const widgetsRef = useRef(widgets);
  useEffect(() => {
    widgetsRef.current = widgets;
  }, [widgets]);

  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', isError: false });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saveAll = async () => {
      setSaving('all');
      try {
        const getRes = await fetch('/api/admin/content?section=events', { cache: 'no-store' });
        const { data: existing } = await getRes.json();
        const merged = { ...(existing || {}), ...widgetsRef.current };

        const res = await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: 'events', data: merged }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        showToast('✅ All Changes saved!');
      } catch (err: unknown) {
        showToast(err instanceof Error ? err.message : 'Save failed', true);
      } finally {
        setSaving(null);
      }
    };
    registerSaveAction('events', saveAll);
    return () => unregisterSaveAction('events');
  }, [registerSaveAction, unregisterSaveAction]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/content?section=events', { cache: 'no-store' });
        const { data } = await res.json();
        if (data) {
          setWidgets((prev) => ({
            currentEvents: { ...prev.currentEvents, ...data.currentEvents },
            contestantWidget: { ...prev.contestantWidget, ...data.contestantWidget },
          }));
        }
      } catch { /* use defaults */ }
      setLoaded(true);
    }
    loadData();
  }, []);

  function showToast(message: string, isError = false) {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3500);
  }

  function handleChange(key: string, field: keyof WidgetState, value: string) {
    setWidgets((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  async function handleUpload(key: string, file: File) {
    setUploading(key);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'events');
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setWidgets((prev) => ({ ...prev, [key]: { ...prev[key], imagePath: json.url } }));
      showToast('Image uploaded! Click Save Changes to publish.');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Upload failed', true);
    } finally {
      setUploading(null);
    }
  }

  async function handleSave(key: string) {
    setSaving(key);
    try {
      const getRes = await fetch('/api/admin/content?section=events', { cache: 'no-store' });
      const { data: existing } = await getRes.json();
      const merged = { ...(existing || {}), [key]: widgetsRef.current[key] };

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'events', data: merged }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast('✅ Changes saved and live!');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save failed', true);
    } finally {
      setSaving(null);
    }
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} />
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Current Events</h2>
        <p className="text-white/40 text-sm font-sans">Manage both event widgets independently — header text, color, flyer image, and register link.</p>
      </div>

      <EventWidget
        title="Current Events Widget"
        widgetKey="currentEvents"
        state={widgets.currentEvents}
        onChange={handleChange}
        onSave={handleSave}
        onUpload={handleUpload}
        uploading={uploading}
        saving={saving}
      />

      <EventWidget
        title="Become a Contestant Widget"
        widgetKey="contestantWidget"
        state={widgets.contestantWidget}
        onChange={handleChange}
        onSave={handleSave}
        onUpload={handleUpload}
        uploading={uploading}
        saving={saving}
      />
    </div>
  );
}
