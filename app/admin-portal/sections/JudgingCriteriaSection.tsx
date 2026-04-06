'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react';

interface AgeDivisionRow {
  division: string;
  ages: string;
}

interface JudgingCategory {
  title: string;
  weight: string; // e.g. "30%"
  description: string;
  bullets: string[];
}

interface JudgingCriteriaState {
  heading: string;
  description: string;
  ageDivisionsTitle: string;
  categoriesTitle: string;
  ageDivisions: AgeDivisionRow[];
  categories: JudgingCategory[];
}

const DEFAULT_STATE: JudgingCriteriaState = {
  heading: 'Judging Criteria & Scoring',
  description: 'Contestants are evaluated across multiple categories, each designed to highlight their confidence, speaking ability, and overall presence.',
  ageDivisionsTitle: 'Age Divisions',
  categoriesTitle: 'In-Depth Criteria',
  ageDivisions: [
    { division: 'Young Woman / Young Man', ages: '16-20' },
    { division: 'Teen', ages: '13-15' },
    { division: 'Pre-Teen', ages: '10-12' }
  ],
  categories: [
    {
      title: 'Personal Interview',
      weight: '30%',
      description: 'A private panel interview with the judges where contestants share their goals, achievements, and answer impromptu questions.',
      bullets: ['Communication skills', 'Personality and authenticity', 'Ability to articulate thoughts under pressure']
    },
    {
      title: 'Talent / Speech',
      weight: '25%',
      description: 'Contestants may perform a talent of their choice or deliver a prepared speech.',
      bullets: ['Entertainment value', 'Technical skill', 'Stage presence']
    }
  ]
};

export default function JudgingCriteriaSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  useEffect(() => {
    registerSaveAction('competition-judging', handleSave);
    return () => unregisterSaveAction('competition-judging');
  });

  const [state, setState] = useState<JudgingCriteriaState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=competition-judging');
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
        body: JSON.stringify({ id: 'competition-judging', data: state })
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

  // --- AGE DIVISIONS ---
  function addAgeDivision() {
    setState(prev => ({
      ...prev,
      ageDivisions: [...(prev.ageDivisions || []), { division: 'New Division', ages: 'Age Range' }]
    }));
  }
  function updateAgeDivision(idx: number, field: keyof AgeDivisionRow, value: string) {
    const newDivs = [...(state.ageDivisions || [])];
    newDivs[idx] = { ...newDivs[idx], [field]: value };
    setState(prev => ({ ...prev, ageDivisions: newDivs }));
  }
  function removeAgeDivision(idx: number) {
    const newDivs = [...(state.ageDivisions || [])];
    newDivs.splice(idx, 1);
    setState(prev => ({ ...prev, ageDivisions: newDivs }));
  }

  // --- CATEGORIES ---
  function addCategory() {
    setState(prev => ({
      ...prev,
      categories: [...prev.categories, { title: 'New Category', weight: '0%', description: '', bullets: [] }]
    }));
    setExpandedCategory(state.categories.length);
  }

  function updateCategory(catIdx: number, field: keyof JudgingCategory, value: string) {
    const newCats = [...state.categories];
    newCats[catIdx] = { ...newCats[catIdx], [field]: value };
    setState(prev => ({ ...prev, categories: newCats }));
  }

  function removeCategory(catIdx: number) {
    const newCats = [...state.categories];
    newCats.splice(catIdx, 1);
    setState(prev => ({ ...prev, categories: newCats }));
    if (expandedCategory === catIdx) setExpandedCategory(null);
  }

  // --- BULLETS ---
  function addBullet(catIdx: number) {
    const newCats = [...state.categories];
    newCats[catIdx].bullets.push('New specific criteria');
    setState(prev => ({ ...prev, categories: newCats }));
  }

  function updateBullet(catIdx: number, bulIdx: number, value: string) {
    const newCats = [...state.categories];
    newCats[catIdx].bullets[bulIdx] = value;
    setState(prev => ({ ...prev, categories: newCats }));
  }

  function removeBullet(catIdx: number, bulIdx: number) {
    const newCats = [...state.categories];
    newCats[catIdx].bullets.splice(bulIdx, 1);
    setState(prev => ({ ...prev, categories: newCats }));
  }

  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-myf-teal focus:ring-1 focus:ring-myf-teal transition-all font-sans text-sm";
  const smallInputClass = "w-full bg-[#0a0f1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-myf-teal focus:ring-1 focus:ring-myf-teal transition-all font-sans text-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">Judging Criteria</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage scoring breakdown categories and specifics</p>
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

      <div className="grid gap-6">
        
        {/* HEADER SECTION */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Page Header</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Title</label>
              <input value={state.heading} onChange={e => setState({ ...state, heading: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Description Array</label>
              <textarea value={state.description} onChange={e => setState({ ...state, description: e.target.value })} className={`${inputClass} min-h-[80px]`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Age Divisions Title</label>
                <input value={state.ageDivisionsTitle || ''} onChange={e => setState({ ...state, ageDivisionsTitle: e.target.value })} className={inputClass} placeholder="Age Divisions" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Specific Categories Title</label>
                <input value={state.categoriesTitle || ''} onChange={e => setState({ ...state, categoriesTitle: e.target.value })} className={inputClass} placeholder="In-Depth Criteria" />
              </div>
            </div>
          </div>
        </section>

        {/* AGE DIVISIONS LIST */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-sans">Age Divisions</h3>
            <button onClick={addAgeDivision} className="flex items-center gap-1 text-[10px] text-myf-teal hover:text-white transition-colors bg-myf-teal/10 px-2 py-1 rounded">
              <Plus className="w-3 h-3" /> Add Division
            </button>
          </div>
          <div className="space-y-3">
            {(state.ageDivisions || []).map((div, dIdx) => (
              <div key={dIdx} className="flex gap-3 items-center bg-[#0a0f1a] p-3 rounded-lg border border-white/10 group">
                <div className="flex-1">
                  <input value={div.division} onChange={e => updateAgeDivision(dIdx, 'division', e.target.value)} className={smallInputClass} placeholder="Division Name" />
                </div>
                <div className="w-32">
                  <input value={div.ages} onChange={e => updateAgeDivision(dIdx, 'ages', e.target.value)} className={smallInputClass} placeholder="Ages" />
                </div>
                <button onClick={() => removeAgeDivision(dIdx)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!state.ageDivisions || state.ageDivisions.length === 0) && <p className="text-white/30 text-xs italic">No age divisions added.</p>}
          </div>
        </section>


        {/* SCORING CATEGORIES ARRAY (In-Depth Dropdowns) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-white font-sans">Scoring Categories</h3>
             <button onClick={addCategory} className="flex items-center gap-1 text-sm text-myf-teal hover:text-white transition-colors bg-myf-teal/10 px-3 py-1.5 rounded-lg">
                <Plus className="w-4 h-4" /> Add Category
             </button>
          </div>
          
          <div className="space-y-4">
            {state.categories.map((cat, catIdx) => (
              <div key={catIdx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setExpandedCategory(expandedCategory === catIdx ? null : catIdx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-myf-teal/20 text-myf-teal flex flex-col items-center justify-center font-bold font-sans text-xs">
                      {cat.weight}
                    </div>
                    <span className="font-bold text-white font-sans uppercase tracking-wide">{cat.title}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${expandedCategory === catIdx ? 'rotate-180' : ''}`} />
                </button>

                {expandedCategory === catIdx && (
                  <div className="p-4 border-t border-white/10 bg-[#0a0f1a]/50 space-y-6">
                    
                    <div className="flex justify-end">
                       <button onClick={() => removeCategory(catIdx)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                          <Trash2 className="w-3 h-3" /> Delete Category
                       </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-start">
                       <div className="lg:col-span-1">
                         <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans">Weight (e.g. 30%)</label>
                         <input value={cat.weight} onChange={e => updateCategory(catIdx, 'weight', e.target.value)} className={inputClass} />
                       </div>
                       <div className="lg:col-span-3">
                         <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans">Title</label>
                         <input value={cat.title} onChange={e => updateCategory(catIdx, 'title', e.target.value)} className={inputClass} />
                       </div>
                       <div className="md:col-span-2 lg:col-span-4">
                         <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans">Description</label>
                         <textarea value={cat.description} onChange={e => updateCategory(catIdx, 'description', e.target.value)} className={`${inputClass} min-h-[60px] resize-y`} />
                       </div>
                    </div>

                    {/* Bullet Points Nested Array */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                         <h4 className="text-sm font-bold text-white font-sans">Specific Evaluation Criteria</h4>
                         <button onClick={() => addBullet(catIdx)} className="flex items-center gap-1 text-[10px] text-myf-teal hover:text-white transition-colors bg-myf-teal/10 px-2 py-1 rounded">
                            <Plus className="w-3 h-3" /> Add Bullet
                         </button>
                      </div>

                      <div className="space-y-2">
                         {cat.bullets.map((bullet, bIdx) => (
                           <div key={bIdx} className="flex gap-2 items-center group">
                             <div className="p-2 text-white/20 cursor-move">
                               <GripVertical className="w-4 h-4" />
                             </div>
                             <input value={bullet} onChange={e => updateBullet(catIdx, bIdx, e.target.value)} className={smallInputClass} />
                             <button onClick={() => removeBullet(catIdx, bIdx)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                         ))}
                         {cat.bullets.length === 0 && <p className="text-white/30 text-xs italic">No specific bullets added.</p>}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            ))}
            {state.categories.length === 0 && <p className="text-white/30 italic">No categories created yet.</p>}
          </div>
        </section>

      </div>
    </div>
  );
}
