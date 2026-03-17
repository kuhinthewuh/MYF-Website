'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save } from 'lucide-react';

interface RequestScholarshipState {
  heading: string;
  description: string;
  formEmbed: string;
}

const DEFAULT_STATE: RequestScholarshipState = {
  heading: 'Request Your Scholarship Funds',
  description: 'Congratulations on your achievements! Please complete the form below to request the disbursement of your earned scholarship funds to your educational institution.',
  formEmbed: '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSf.../viewform?embedded=true" width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>'
};

export default function RequestScholarshipSection() {
  const [state, setState] = useState<RequestScholarshipState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=competition-request');
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
        body: JSON.stringify({ id: 'competition-request', data: state })
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
          <h2 className="text-2xl font-bold text-white font-sans">Request Your Scholarship</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage the scholarship disbursement form</p>
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
        
        {/* HEADER SECTION */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Page Header</h3>
          
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

        {/* EMBED CODE */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Form Embed Code</h3>
          <p className="text-white/40 text-xs mt-1 max-w-2xl">
            Paste the HTML iframe code for the scholarship disbursement form (e.g. Google Forms, JotForm).
          </p>

          <textarea 
            value={state.formEmbed}
            onChange={e => setState({ ...state, formEmbed: e.target.value })}
            className={`${inputClass} min-h-[150px] resize-y font-mono text-xs text-white/70`}
            placeholder="<iframe src='...' width='100%' height='800'></iframe>"
          />
        </section>

      </div>
    </div>
  );
}
