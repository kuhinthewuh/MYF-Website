'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Plus, Trash2, GripVertical, UploadCloud } from 'lucide-react';

interface LinkItem {
  platform?: string; // For Socials
  label?: string; // For Quick Links
  url: string;
}

interface GlobalFooterState {
  logoUrl: string;
  description: string;
  socialLinks: LinkItem[];
  quickLinks: LinkItem[];
  copyright: string;
}

const DEFAULT_STATE: GlobalFooterState = {
  logoUrl: '',
  description: 'Empowering the youth of Manteca through leadership, scholarship, and community service.',
  socialLinks: [{ platform: 'Facebook', url: '#' }, { platform: 'Instagram', url: '#' }],
  quickLinks: [
    { label: 'About Us', url: '/about/at-a-glance' },
    { label: 'Competition', url: '/competition/contestant' },
    { label: 'Become a Sponsor', url: '/sponsor' },
    { label: 'Contact', url: '/contact/reach-out' }
  ],
  copyright: '© 2024 Manteca Youth Focus. All rights reserved.'
};

export default function GlobalFooterSection() {
  const [state, setState] = useState<GlobalFooterState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=global-footer');
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
        body: JSON.stringify({ id: 'global-footer', data: state })
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
      setState(prev => ({ ...prev, logoUrl: url }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
       console.error(error);
       showToast('❌ Logo upload failed.', true);
    } finally {
       setIsUploading(false);
    }
  }

  function addSocialLink() {
    setState(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'New Social', url: 'https://' }]
    }));
  }
  function updateSocialLink(idx: number, field: keyof LinkItem, value: string) {
    const newLinks = [...state.socialLinks];
    newLinks[idx] = { ...newLinks[idx], [field]: value };
    setState(prev => ({ ...prev, socialLinks: newLinks }));
  }
  function removeSocialLink(idx: number) {
    const newLinks = [...state.socialLinks];
    newLinks.splice(idx, 1);
    setState(prev => ({ ...prev, socialLinks: newLinks }));
  }

  function addQuickLink() {
    setState(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { label: 'New Link', url: '/' }]
    }));
  }
  function updateQuickLink(idx: number, field: keyof LinkItem, value: string) {
    const newLinks = [...state.quickLinks];
    newLinks[idx] = { ...newLinks[idx], [field]: value };
    setState(prev => ({ ...prev, quickLinks: newLinks }));
  }
  function removeQuickLink(idx: number) {
    const newLinks = [...state.quickLinks];
    newLinks.splice(idx, 1);
    setState(prev => ({ ...prev, quickLinks: newLinks }));
  }

  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";
  const smallInputClass = "w-full bg-[#0a0f1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">Global Footer</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage the bottom footer displayed on all public pages</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#00B4CC] to-[#0092a6] hover:from-[#00c5e0] hover:to-[#00a3b8] text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50">
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid gap-6">
        
        {/* LEFT COLUMN: BRANDING & COPYRIGHT */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Branding & Identity</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-white/50 mb-1 font-sans uppercase">Footer Description</label>
                  <textarea value={state.description} onChange={e => setState({ ...state, description: e.target.value })} className={`${inputClass} min-h-[90px] resize-y`} />
               </div>
               <div>
                  <label className="block text-xs font-bold text-white/50 mb-1 font-sans uppercase">Copyright Text</label>
                  <input value={state.copyright} onChange={e => setState({ ...state, copyright: e.target.value })} className={inputClass} />
               </div>
             </div>
             
             <div>
                <label className="block text-xs font-bold text-white/50 mb-2 font-sans uppercase">Footer Logo Override (Optional)</label>
                {state.logoUrl ? (
                  <div className="bg-[#0a0f1a]/50 border border-[#00B4CC]/20 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[160px]">
                     <img src={state.logoUrl} alt="Footer Logo" className="max-h-24 w-auto object-contain brightness-0 invert opacity-70" />
                     <button onClick={() => setState(prev => ({ ...prev, logoUrl: '' }))} className="absolute top-2 right-2 p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                ) : (
                  <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl hover:border-[#00B4CC]/50 hover:bg-[#00B4CC]/5 cursor-pointer transition-all h-full min-h-[160px]">
                     <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" disabled={isUploading} />
                     <UploadCloud className="w-8 h-8 text-white/30 mb-2" />
                     <p className="text-sm font-semibold text-white/60 text-center">
                        {isUploading ? 'Uploading...' : 'Upload White Logo'}
                     </p>
                  </label>
                )}
             </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
           {/* QUICK LINKS ARRAY */}
           <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white font-sans">Quick Links</h3>
                 <button onClick={addQuickLink} className="flex items-center gap-1 text-[10px] text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-2 py-1 rounded">
                    <Plus className="w-3 h-3" /> Add Link
                 </button>
              </div>
              <div className="space-y-3 mt-4">
                 {state.quickLinks.map((link, idx) => (
                   <div key={idx} className="flex gap-2 items-center bg-[#0a0f1a] p-3 rounded-lg border border-white/10 group">
                      <div className="p-1 text-white/20 cursor-move">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-2">
                         <input value={link.label} onChange={e => updateQuickLink(idx, 'label', e.target.value)} className={smallInputClass} placeholder="Link Label (e.g. About Us)" />
                         <input value={link.url} onChange={e => updateQuickLink(idx, 'url', e.target.value)} className={smallInputClass} placeholder="/path or https://" />
                      </div>
                      <button onClick={() => removeQuickLink(idx)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                 ))}
              </div>
           </section>

           {/* SOCIAL LINKS ARRAY */}
           <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white font-sans">Social Links</h3>
                 <button onClick={addSocialLink} className="flex items-center gap-1 text-[10px] text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-2 py-1 rounded">
                    <Plus className="w-3 h-3" /> Add Social
                 </button>
              </div>
              <div className="space-y-3 mt-4">
                 {state.socialLinks.map((social, idx) => (
                   <div key={idx} className="flex gap-2 items-center bg-[#0a0f1a] p-3 rounded-lg border border-white/10 group">
                      <div className="p-1 text-white/20 cursor-move">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-2">
                         <input value={social.platform} onChange={e => updateSocialLink(idx, 'platform', e.target.value)} className={smallInputClass} placeholder="Platform Name" />
                         <input value={social.url} onChange={e => updateSocialLink(idx, 'url', e.target.value)} className={smallInputClass} placeholder="Profile URL" />
                      </div>
                      <button onClick={() => removeSocialLink(idx)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                 ))}
              </div>
           </section>
        </div>

      </div>
    </div>
  );
}
