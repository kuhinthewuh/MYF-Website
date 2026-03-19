'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Plus, Trash2, GripVertical, FileText, UploadCloud, ChevronDown } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string; // e.g. "$500" or "$1,000+"
  description: string;
  isPopular?: boolean;
  perks: string[];
}

interface SponsorState {
  heading: string;
  description: string;
  deckPdfUrl: string;
  tiers: PricingTier[];
}

const DEFAULT_STATE: SponsorState = {
  heading: 'Become A Sponsor',
  description: 'Your generous support empowers the youth of Manteca to reach their full potential. Explore our sponsorship tiers below and partner with us to make a lasting impact.',
  deckPdfUrl: '',
  tiers: [
    {
      name: 'Competition Sponsor',
      price: '$100',
      description: 'Ideal starting tier for supporting local scholarships.',
      isPopular: false,
      perks: ['Name listed in competition program', 'Mentioned on social media']
    },
    {
      name: 'Bronze Sponsor',
      price: '$250',
      description: 'Perfect for small businesses entering the community.',
      isPopular: false,
      perks: ['Business card ad in program guide', 'Name listed on our website', '1 VIP ticket']
    },
    {
      name: 'Silver Sponsor',
      price: '$500',
      description: 'Establishing a stronger community presence.',
      isPopular: false,
      perks: ['1/4 page ad in the program guide', 'Logo placement on our website', '2 VIP tickets', 'Verbal recognition']
    },
    {
      name: 'Gold Sponsor',
      price: '$1,000',
      description: 'Our most popular tier for establishing brand presence.',
      isPopular: true,
      perks: ['1/2 page ad in the program guide', 'Premium logo placement on our website', '4 VIP tickets', 'Verbal recognition during the event']
    },
    {
      name: 'Platinum Sponsor',
      price: '$2,500+',
      description: 'The ultimate partnership level for maximum visibility.',
      isPopular: false,
      perks: ['Full page ad in the program guide', 'Home page logo spotlight', '8 VIP tickets', 'Opportunity to present an award on stage', 'Featured spotlight on all social channels']
    }
  ]
};

export default function SponsorSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  useEffect(() => {
    registerSaveAction('sponsor', handleSave);
    return () => unregisterSaveAction('sponsor');
  });

  const [state, setState] = useState<SponsorState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedTier, setExpandedTier] = useState<number | null>(0);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=sponsor');
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
        body: JSON.stringify({ id: 'sponsor', data: state })
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

  async function uploadPdf(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'site-images'); // Using existing bucket logic

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const { url } = await res.json();
      setState(prev => ({ ...prev, deckPdfUrl: url }));
    } catch (error) {
      console.error(error);
      alert('Failed to upload PDF document.');
    } finally {
      setIsUploading(false);
    }
  }

  // --- TIERS ---
  function addTier() {
    setState(prev => ({
      ...prev,
      tiers: [...prev.tiers, { name: 'New Tier', price: '$0', description: '', isPopular: false, perks: [] }]
    }));
    setExpandedTier(state.tiers.length);
  }

  function updateTier(idx: number, field: keyof PricingTier, value: any) {
    const newTiers = [...state.tiers];
    newTiers[idx] = { ...newTiers[idx], [field]: value };
    setState(prev => ({ ...prev, tiers: newTiers }));
  }

  function removeTier(idx: number) {
    const newTiers = [...state.tiers];
    newTiers.splice(idx, 1);
    setState(prev => ({ ...prev, tiers: newTiers }));
    if (expandedTier === idx) setExpandedTier(null);
  }

  // --- PERKS ---
  function addPerk(tierIdx: number) {
    const newTiers = [...state.tiers];
    newTiers[tierIdx].perks.push('New perk feature');
    setState(prev => ({ ...prev, tiers: newTiers }));
  }

  function updatePerk(tierIdx: number, pIdx: number, value: string) {
    const newTiers = [...state.tiers];
    newTiers[tierIdx].perks[pIdx] = value;
    setState(prev => ({ ...prev, tiers: newTiers }));
  }

  function removePerk(tierIdx: number, pIdx: number) {
    const newTiers = [...state.tiers];
    newTiers[tierIdx].perks.splice(pIdx, 1);
    setState(prev => ({ ...prev, tiers: newTiers }));
  }

  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";
  const smallInputClass = "w-full bg-[#0a0f1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">Become A Sponsor</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage pricing tiers, perks, and the sponsorship deck</p>
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
          
          <div className="grid md:grid-cols-2 gap-6 items-start">
             <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-white/50 mb-1 font-sans uppercase">Title Heading</label>
                  <input value={state.heading} onChange={e => setState({ ...state, heading: e.target.value })} className={inputClass} />
               </div>
               <div>
                  <label className="block text-xs font-bold text-white/50 mb-1 font-sans uppercase">Description</label>
                  <textarea value={state.description} onChange={e => setState({ ...state, description: e.target.value })} className={`${inputClass} min-h-[90px] resize-y`} />
               </div>
             </div>

             <div>
               <label className="block text-xs font-bold text-white/50 mb-2 font-sans uppercase">Sponsor Deck PDF (Optional)</label>
               {state.deckPdfUrl ? (
                 <div className="bg-[#0a0f1a]/50 border border-[#00B4CC]/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-[#00B4CC]/10 text-[#00B4CC] rounded-lg">
                          <FileText className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-semibold text-white text-sm">Sponsorship Deck Uploaded</h4>
                          <a href={state.deckPdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00B4CC] hover:underline truncate block w-40">
                             View File
                          </a>
                       </div>
                    </div>
                    <button onClick={() => setState(prev => ({ ...prev, deckPdfUrl: '' }))} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ) : (
                 <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl hover:border-[#00B4CC]/50 hover:bg-[#00B4CC]/5 cursor-pointer transition-all h-full min-h-[160px]">
                    <input type="file" accept="application/pdf" onChange={uploadPdf} className="hidden" disabled={isUploading} />
                    <UploadCloud className="w-8 h-8 text-white/30 mb-2" />
                    <p className="text-sm font-semibold text-white/60 text-center">
                       {isUploading ? 'Uploading...' : 'Upload Sponsor Deck (PDF)'}
                    </p>
                 </label>
               )}
             </div>
          </div>
        </section>

        {/* PRICING TIERS ARRAY */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-white font-sans">Sponsorship Tiers</h3>
             <button onClick={addTier} className="flex items-center gap-1 text-sm text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-3 py-1.5 rounded-lg">
                <Plus className="w-4 h-4" /> Add Tier
             </button>
          </div>
          
          <div className="grid gap-4 lg:grid-cols-2 items-start">
            {state.tiers.map((tier, tIdx) => (
              <div key={tIdx} className={`bg-white/5 border rounded-2xl overflow-hidden transition-colors ${tier.isPopular ? 'border-[#00B4CC]/50 shadow-[0_0_15px_rgba(0,180,204,0.1)]' : 'border-white/10'}`}>
                <button 
                  onClick={() => setExpandedTier(expandedTier === tIdx ? null : tIdx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
                >
                  <div>
                     <span className="font-bold text-white font-sans text-lg block">{tier.name}</span>
                     <span className="text-[#00B4CC] font-mono font-bold text-sm block">{tier.price}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${expandedTier === tIdx ? 'rotate-180' : ''}`} />
                </button>

                {expandedTier === tIdx && (
                  <div className="p-4 border-t border-white/10 bg-[#0a0f1a]/50 space-y-6">
                    
                    <div className="flex justify-between items-center">
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={tier.isPopular || false} 
                            onChange={(e) => updateTier(tIdx, 'isPopular', e.target.checked)}
                            className="w-4 h-4 rounded text-[#00B4CC] bg-white/10 border-white/20 focus:ring-[#00B4CC] focus:ring-offset-gray-900"
                          />
                          <span className="text-sm text-white/70 font-semibold uppercase tracking-wider">Highlight as Popular</span>
                       </label>

                       <button onClick={() => removeTier(tIdx)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                          <Trash2 className="w-3 h-3" /> Delete Tier
                       </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                       <div>
                         <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans">Tier Name</label>
                         <input value={tier.name} onChange={e => updateTier(tIdx, 'name', e.target.value)} className={inputClass} />
                       </div>
                       <div>
                         <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans">Price / Contribution</label>
                         <input value={tier.price} onChange={e => updateTier(tIdx, 'price', e.target.value)} className={inputClass} placeholder="$500" />
                       </div>
                       <div className="md:col-span-2">
                         <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans">Short Description</label>
                         <textarea value={tier.description} onChange={e => updateTier(tIdx, 'description', e.target.value)} className={`${inputClass} min-h-[60px] resize-y text-xs`} />
                       </div>
                    </div>

                    {/* Bullet Points Nested Array */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                         <h4 className="text-sm font-bold text-white font-sans">Included Perks</h4>
                         <button onClick={() => addPerk(tIdx)} className="flex items-center gap-1 text-[10px] text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-2 py-1 rounded">
                            <Plus className="w-3 h-3" /> Add Perk
                         </button>
                      </div>

                      <div className="space-y-2">
                         {tier.perks.map((perk, pIdx) => (
                           <div key={pIdx} className="flex gap-2 items-center group">
                             <div className="p-1 text-white/20 cursor-move">
                               <GripVertical className="w-3 h-3" />
                             </div>
                             <input value={perk} onChange={e => updatePerk(tIdx, pIdx, e.target.value)} className={smallInputClass} />
                             <button onClick={() => removePerk(tIdx, pIdx)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                         ))}
                         {tier.perks.length === 0 && <p className="text-white/30 text-xs italic">No perks added to this tier.</p>}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            ))}
            {state.tiers.length === 0 && <p className="text-white/30 italic col-span-2">No tiers created yet.</p>}
          </div>
        </section>

      </div>
    </div>
  );
}
