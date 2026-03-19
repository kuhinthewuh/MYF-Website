'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ContestantState {
  heading: string;
  benefits: string[];
  image: string;
  formIframe: string;
}

const DEFAULT_STATE: ContestantState = {
  heading: 'Become A Contestant Today!',
  benefits: ['Earn scholarship money for college', 'Develop public speaking skills', 'Gain lifelong friendships', 'Serve the Manteca community'],
  image: '',
  formIframe: '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSf.../viewform?embedded=true" width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>'
};

export default function ContestantSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  useEffect(() => {
    registerSaveAction('competition-contestant', handleSave);
    return () => unregisterSaveAction('competition-contestant');
  });

  const [state, setState] = useState<ContestantState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=competition-contestant');
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
        body: JSON.stringify({ id: 'competition-contestant', data: state })
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

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'site-images');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const { url } = await res.json();
      setState(prev => ({ ...prev, image: url }));
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to upload image.', true);
    } finally {
      setIsUploading(false);
    }
  }

  function addBenefit() {
    setState(prev => ({ ...prev, benefits: [...prev.benefits, 'New benefit'] }));
  }

  function updateBenefit(index: number, value: string) {
    const newBenefits = [...state.benefits];
    newBenefits[index] = value;
    setState(prev => ({ ...prev, benefits: newBenefits }));
  }

  function removeBenefit(index: number) {
    setState(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  }

  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">Become A Contestant</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage the interest page and form embed</p>
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
        
        {/* TOP SPLIT SECTION */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white font-sans">Top Info Section</h3>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Text & Bullets */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Heading</label>
                <input 
                  value={state.heading}
                  onChange={e => setState({ ...state, heading: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-white/70 font-sans">Benefits (Bulleted List)</label>
                  <button onClick={addBenefit} className="flex items-center gap-1 text-[10px] text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-2 py-1 rounded">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                
                <div className="space-y-2">
                  {state.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <div className="p-1 text-white/20 cursor-move">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <input 
                        value={benefit}
                        onChange={e => updateBenefit(idx, e.target.value)}
                        className={inputClass}
                      />
                      <button onClick={() => removeBenefit(idx)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Image */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2 font-sans">Right-Side Promotional Image</label>
              {state.image ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden group border border-white/10">
                  <Image src={state.image} alt="Promo" fill className="object-cover" unoptimized />
                  <button
                    onClick={() => setState(prev => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity font-semibold shadow-lg text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-white/20 hover:border-[#00B4CC]/50 hover:bg-[#00B4CC]/5 cursor-pointer flex flex-col items-center justify-center transition-all">
                  <input type="file" accept="image/*" onChange={uploadImage} className="hidden" disabled={isUploading} />
                  <ImageIcon className="w-10 h-10 text-white/40 mb-3" />
                  <span className="text-sm font-medium text-white/40 font-sans">
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </label>
              )}
            </div>
          </div>
        </section>

        {/* GOOGLE FORM EMBED */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Bottom Form Embed</h3>
          <p className="text-white/40 text-xs mt-1 max-w-2xl">
            Paste the raw HTML iframe code from Google Forms here. Ensure it starts with <code>&lt;iframe...</code>
          </p>

          <textarea 
            value={state.formIframe}
            onChange={e => setState({ ...state, formIframe: e.target.value })}
            className={`${inputClass} min-h-[150px] resize-y font-mono text-xs text-white/70`}
            placeholder="<iframe src='...' width='100%' height='800'></iframe>"
          />
        </section>

      </div>
    </div>
  );
}
