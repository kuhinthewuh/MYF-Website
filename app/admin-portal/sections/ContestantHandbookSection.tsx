'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Trash2, FileText, UploadCloud } from 'lucide-react';

interface ContestantHandbookState {
  heading: string;
  description: string;
  pdfUrl: string; // Legacy
  flipbookUrl: string;
}

const DEFAULT_STATE: ContestantHandbookState = {
  heading: 'Official Contestant Handbook',
  description: 'Review the rules, expectations, and guidelines for the upcoming Manteca Youth Focus scholarship competitions.',
  pdfUrl: '',
  flipbookUrl: ''
};

export default function ContestantHandbookSection() {
  const [state, setState] = useState<ContestantHandbookState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=competition-handbook');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setState(prev => ({ ...prev, ...json.data }));
        }
      }
    }
    loadData();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'competition-handbook', data: state })
      });
      if (!res.ok) throw new Error('Failed to save');
      showToast('✅ Changes saved and live!');
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to save changes.', true);
    } finally {
      setIsSaving(false);
    }
  }



  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">Contestant Handbook</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage the core guidelines document PDF viewer</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#00B4CC] to-[#0092a6] hover:from-[#00c5e0] hover:to-[#00a3b8] text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid gap-6">
        
        {/* HEADER INFORMATION */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Header Info</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Heading</label>
              <input 
                value={state.heading}
                onChange={e => setState({ ...state, heading: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Description Paragraph</label>
              <textarea 
                value={state.description}
                onChange={e => setState({ ...state, description: e.target.value })}
                className={`${inputClass} min-h-[80px] resize-y`}
              />
            </div>
          </div>
        </section>

        {/* HEYZINE FLIPBOOK EMBED */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Flipbook Embed</h3>
          
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Heyzine Flipbook URL (e.g., https://heyzine.com/flip-book/096ffbbde6.html)</label>
            <input 
              value={state.flipbookUrl || state.pdfUrl || ''}
              onChange={e => setState({ ...state, flipbookUrl: e.target.value, pdfUrl: '' })}
              className={inputClass}
              placeholder="https://heyzine.com/flip-book/..."
            />
            <p className="text-xs text-white/40 mt-2">Simply paste the direct URL to your Heyzine flipbook and it will seamlessly embed into the page viewer.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
