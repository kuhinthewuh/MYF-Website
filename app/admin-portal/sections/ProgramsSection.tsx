'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useEffect } from 'react';
import { Save, Link, CheckCircle, Loader2, GraduationCap, HeartHandshake, Star } from 'lucide-react';

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

interface ProgramLinks {
  scholarship: string;
  communityService: string;
  alumni: string;
}

const DEFAULT_LINKS: ProgramLinks = {
  scholarship: '#',
  communityService: '#',
  alumni: '#',
};

const PROGRAMS = [
  {
    key: 'scholarship' as keyof ProgramLinks,
    label: 'Scholarship Competition Division',
    description: 'The "I\'m interested" button link',
    icon: GraduationCap,
    color: '#00B4CC',
    placeholder: 'https://forms.google.com/scholarship-signup',
  },
  {
    key: 'communityService' as keyof ProgramLinks,
    label: 'Community Service',
    description: 'The "Join Here" button link',
    icon: HeartHandshake,
    color: '#E8734A',
    placeholder: 'https://forms.google.com/service-team-signup',
  },
  {
    key: 'alumni' as keyof ProgramLinks,
    label: 'Calling All Alumni',
    description: 'The "Connect With Us" button link',
    icon: Star,
    color: '#C8962E',
    placeholder: 'https://forms.google.com/alumni-survey',
  },
];

export default function ProgramsSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  useEffect(() => {
    registerSaveAction('programs', handleSave);
    return () => unregisterSaveAction('programs');
  });

  const [links, setLinks] = useState<ProgramLinks>(DEFAULT_LINKS);
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', isError: false });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/content?section=programs');
        const { data } = await res.json();
        if (data) setLinks({ ...DEFAULT_LINKS, ...data });
      } catch { /* use defaults */ }
      setLoading(false);
    }
    loadData();
  }, []);

  function showToast(message: string, isError = false) {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3500);
  }

  async function handleSave(key: keyof ProgramLinks) {
    setSaving(key);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'programs', data: links }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast('✅ Program link updated and live!');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save failed', true);
    } finally {
      setSaving(null);
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
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Our Programs</h2>
        <p className="text-white/40 text-sm font-sans">Update the sign-up / registration links for each program card on the website.</p>
      </div>

      <div className="space-y-4">
        {PROGRAMS.map(({ key, label, description, icon: Icon, color, placeholder }) => (
          <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sans">{label}</h3>
                <p className="text-white/40 text-xs font-sans">{description}</p>
              </div>
            </div>

            <div className="relative">
              <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="url"
                value={links[key]}
                onChange={(e) => setLinks((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm font-sans focus:outline-none focus:border-myf-teal/50 transition-all"
              />
            </div>

            <button
              onClick={() => handleSave(key)}
              disabled={saving === key}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-myf-teal to-myf-tealDeep hover:from-myf-teal hover:to-myf-tealDeep disabled:opacity-40 text-white font-bold rounded-xl text-sm font-sans transition-all hover:-translate-y-0.5"
            >
              {saving === key ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving === key ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
