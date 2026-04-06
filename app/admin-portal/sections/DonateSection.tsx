'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Plus, Trash2, GripVertical, Link as LinkIcon } from 'lucide-react';

interface ImpactStat {
  value: string; // e.g. "$12,000+"
  label: string; // e.g. "Awarded Annually"
}

interface DonateState {
  heading: string;
  description: string;
  donateUrl: string;
  stats: ImpactStat[];
}

const DEFAULT_STATE: DonateState = {
  heading: 'Support Our Mission',
  description: 'Your contribution directly funds educational scholarships and empowers the youth of Manteca to become tomorrow\'s leaders. Every donation makes a difference.',
  donateUrl: 'https://paypal.com/donate',
  stats: [
    { value: '$10,000+', label: 'Awarded Annually' },
    { value: '500+', label: 'Community Hours' },
    { value: '100%', label: 'Volunteer Driven' }
  ]
};

export default function DonateSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  useEffect(() => {
    registerSaveAction('donate', handleSave);
    return () => unregisterSaveAction('donate');
  });

  const [state, setState] = useState<DonateState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=donate');
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
        body: JSON.stringify({ id: 'donate', data: state })
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

  // --- STATS ---
  function addStat() {
    setState(prev => ({
      ...prev,
      stats: [...prev.stats, { value: 'New Value', label: 'New Label' }]
    }));
  }

  function updateStat(idx: number, field: keyof ImpactStat, value: string) {
    const newStats = [...state.stats];
    newStats[idx] = { ...newStats[idx], [field]: value };
    setState(prev => ({ ...prev, stats: newStats }));
  }

  function removeStat(idx: number) {
    const newStats = [...state.stats];
    newStats.splice(idx, 1);
    setState(prev => ({ ...prev, stats: newStats }));
  }


  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-myf-teal focus:ring-1 focus:ring-myf-teal transition-all font-sans text-sm";
  const smallInputClass = "w-full bg-[#0a0f1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-myf-teal focus:ring-1 focus:ring-myf-teal transition-all font-sans text-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">Donate Page</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage donation links and trust-building impact stats</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-myf-teal to-myf-tealDeep hover:from-myf-teal hover:to-myf-tealDeep text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: HERO & LINK */}
        <div className="md:col-span-2 space-y-6">
           <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
             <h3 className="text-lg font-bold text-white font-sans">Page Details</h3>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Headline</label>
                 <input 
                   value={state.heading}
                   onChange={e => setState({ ...state, heading: e.target.value })}
                   className={inputClass}
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Mission / Impact Description</label>
                 <textarea 
                   value={state.description}
                   onChange={e => setState({ ...state, description: e.target.value })}
                   className={`${inputClass} min-h-[90px] resize-y`}
                 />
               </div>
             </div>
           </section>

           <section className="bg-white/5 border border-myf-teal/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
             
             <div className="absolute top-0 right-0 w-32 h-32 bg-myf-teal/10 blur-3xl rounded-full" />

             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-myf-teal/20 text-myf-teal rounded-xl">
                   <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white font-sans">External Donation Link</h3>
                   <p className="text-white/40 text-xs mt-0.5">Where should the main "Donate Now" button redirect to? (e.g. PayPal, GoFundMe)</p>
                </div>
             </div>

             <div>
               <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans tracking-wide">URL Destination</label>
               <input 
                 type="url"
                 value={state.donateUrl}
                 onChange={e => setState({ ...state, donateUrl: e.target.value })}
                 className={inputClass}
                 placeholder="https://..."
               />
             </div>
           </section>
        </div>

        {/* RIGHT COLUMN: STATS */}
        <div className="space-y-6">
           <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white font-sans">Impact Stats</h3>
                 <button onClick={addStat} className="flex items-center gap-1 text-[10px] text-myf-teal hover:text-white transition-colors bg-myf-teal/10 px-2 py-1.5 rounded-lg border border-myf-teal/20">
                    <Plus className="w-3 h-3" /> Add Stat
                 </button>
              </div>
              <p className="text-white/40 text-xs">These display as large trust-building numbers below the hero.</p>

              <div className="space-y-3 mt-4">
                 {state.stats.map((stat, idx) => (
                   <div key={idx} className="bg-[#0a0f1a]/50 border border-white/5 p-3 rounded-xl space-y-3 relative group">
                      
                      <button onClick={() => removeStat(idx)} className="absolute top-2 right-2 p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100">
                         <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                         <GripVertical className="w-4 h-4 text-white/20 cursor-move shrink-0" />
                         <div className="w-full space-y-2">
                            <div>
                               <label className="block text-[9px] uppercase font-bold text-white/40 mb-1">Value (Large)</label>
                               <input value={stat.value} onChange={e => updateStat(idx, 'value', e.target.value)} className={smallInputClass} placeholder="$10k+" />
                            </div>
                            <div>
                               <label className="block text-[9px] uppercase font-bold text-white/40 mb-1">Label</label>
                               <input value={stat.label} onChange={e => updateStat(idx, 'label', e.target.value)} className={smallInputClass} placeholder="Awarded" />
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
                 {state.stats.length === 0 && <p className="text-white/30 text-xs italic text-center py-4">No impact stats added.</p>}
              </div>

           </section>
        </div>

      </div>
    </div>
  );
}
