'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface DivisionState {
  name: string;
  winnersText: string;
}

interface CategoryState {
  title: string;
  accentColor: string; // Tailwind class like 'bg-blue-500'
  divisions: DivisionState[];
}

interface AboutHistoryState {
  heroTitle: string;
  heroImage: string;
  categories: CategoryState[];
  memorialTitle: string;
  memorialText: string;
  memorialImage: string;
  memorialWinners: string;
}

const DEFAULT_CATEGORIES: CategoryState[] = [
  { title: 'The City Titles', accentColor: 'blue', divisions: [] },
  { title: 'The Pumpkin Fair Titles', accentColor: 'orange', divisions: [] },
  { title: 'Watermelon Street Fair Titleholders', accentColor: 'red', divisions: [] },
  { title: 'Winter Fest Titleholders', accentColor: 'cyan', divisions: [] },
];

const DEFAULT_STATE: AboutHistoryState = {
  heroTitle: 'History of Excellence',
  heroImage: '',
  categories: DEFAULT_CATEGORIES,
  memorialTitle: 'Breanne Wigginton Memorial Award',
  memorialText: 'Awarded to those who show exceptional dedication.',
  memorialImage: '',
  memorialWinners: ''
};

// Map color names to hex for the Admin UI visuals
const COLOR_MAP: Record<string, string> = {
  blue: '#3b82f6',
  orange: '#f97316',
  red: '#ef4444',
  cyan: '#06b6d4',
  amber: '#f59e0b'
};

export default function AboutHistorySection() {
  const [state, setState] = useState<AboutHistoryState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Track which category accordion is open in the admin panel
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=about-history');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const mergedCategories = DEFAULT_CATEGORIES.map((cat) => {
            const existingCat = json.data.categories?.find((c: any) => c.title === cat.title);
            if (existingCat) {
              // Backward compatibility: Convert old winners array into a single division if needed
              let divs = existingCat.divisions || [];
              if (divs.length === 0 && existingCat.winners && existingCat.winners.length > 0) {
                 divs = [{ name: 'General', winnersText: existingCat.winners.map((w: any) => `${w.year} - ${w.names}`).join('\n') }];
              }
              return { ...cat, divisions: divs };
            }
            return cat;
          });
          
          let memWinners = json.data.memorialWinners || DEFAULT_STATE.memorialWinners;
          // Look for old Breanne Wigginton data to migrate automatically
          const oldBreanne = json.data.categories?.find((c: any) => c.title === 'Breanne Wigginton Memorial Award');
          if (oldBreanne && oldBreanne.winners && !json.data.memorialWinners) {
            memWinners = oldBreanne.winners.map((w: any) => `${w.year} - ${w.names}`).join('\n');
          }

          setState({
            heroTitle: json.data.heroTitle || DEFAULT_STATE.heroTitle,
            heroImage: json.data.heroImage || '',
            categories: mergedCategories,
            memorialTitle: json.data.memorialTitle || DEFAULT_STATE.memorialTitle,
            memorialText: json.data.memorialText || DEFAULT_STATE.memorialText,
            memorialImage: json.data.memorialImage || '',
            memorialWinners: memWinners
          });
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
        body: JSON.stringify({ id: 'about-history', data: state })
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

  async function uploadHeroImage(e: React.ChangeEvent<HTMLInputElement>) {
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
      setState(prev => ({ ...prev, heroImage: url }));
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to upload image.', true);
    } finally {
      setIsUploading(false);
    }
  }

  async function uploadMemorialImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'site-images');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      setState(prev => ({ ...prev, memorialImage: url }));
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to upload image.', true);
    } finally {
      setIsUploading(false);
    }
  }

  function addDivision(categoryIndex: number) {
    const newCategories = [...state.categories];
    newCategories[categoryIndex].divisions.push({ name: 'New Division', winnersText: '' });
    setState(prev => ({ ...prev, categories: newCategories }));
  }

  function updateDivision(categoryIndex: number, divIndex: number, field: 'name' | 'winnersText', value: string) {
    const newCategories = [...state.categories];
    newCategories[categoryIndex].divisions[divIndex][field] = value;
    setState(prev => ({ ...prev, categories: newCategories }));
  }

  function removeDivision(categoryIndex: number, divIndex: number) {
    const newCategories = [...state.categories];
    newCategories[categoryIndex].divisions.splice(divIndex, 1);
    setState(prev => ({ ...prev, categories: newCategories }));
  }

  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">History of Excellence</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage past winners and the hero section</p>
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
        {/* HERO SECTION */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Hero Section</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Hero Title</label>
              <input 
                value={state.heroTitle}
                onChange={e => setState({ ...state, heroTitle: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Hero Background Image</label>
              {state.heroImage ? (
                <div className="relative aspect-video rounded-xl overflow-hidden group border border-white/10">
                  <Image src={state.heroImage} alt="Hero" fill className="object-cover" unoptimized />
                  <button
                    onClick={() => setState(prev => ({ ...prev, heroImage: '' }))}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="relative aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-[#00B4CC]/50 hover:bg-[#00B4CC]/5 cursor-pointer flex flex-col items-center justify-center transition-all">
                  <input type="file" accept="image/*" onChange={uploadHeroImage} className="hidden" disabled={isUploading} />
                  <ImageIcon className="w-8 h-8 text-white/40 mb-2" />
                  <span className="text-sm font-medium text-white/40 font-sans">
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </label>
              )}
            </div>
          </div>
        </section>

        {/* WINNERS ARRAYS */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Winner Categories</h3>
          <p className="text-white/40 text-sm mb-4">Click a category to expand and add winners.</p>

          <div className="space-y-3">
            {state.categories.map((cat, catIdx) => (
              <div key={catIdx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenCategory(openCategory === catIdx ? null : catIdx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_MAP[cat.accentColor] }} />
                    <span className="font-bold text-white font-sans">{cat.title}</span>
                    <span className="text-white/30 text-xs px-2 py-0.5 bg-white/5 rounded-full">{cat.divisions.length} divisions</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${openCategory === catIdx ? 'rotate-180' : ''}`} />
                </button>

                {openCategory === catIdx && (
                  <div className="p-4 border-t border-white/10 bg-[#0a0f1a]/50">
                    <div className="flex justify-end mb-4">
                      <button 
                        onClick={() => addDivision(catIdx)}
                        className="flex items-center gap-1 text-sm text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-3 py-1.5 rounded-lg font-semibold"
                      >
                        <Plus className="w-4 h-4" /> Add Age Division
                      </button>
                    </div>

                    {cat.divisions.length === 0 ? (
                      <div className="text-center py-8 text-white/30 text-sm italic">
                        No age divisions added to this category yet.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {cat.divisions.map((div, divIdx) => (
                          <div key={divIdx} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-4">
                            <div className="flex gap-4 items-center justify-between">
                              <div className="flex-1 max-w-sm">
                                <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Division Name (e.g. Miss Manteca)</label>
                                <input 
                                  value={div.name}
                                  onChange={e => updateDivision(catIdx, divIdx, 'name', e.target.value)}
                                  className={inputClass}
                                />
                              </div>
                              <button 
                                onClick={() => removeDivision(catIdx, divIdx)} 
                                className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all self-end"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Winners (Paste bullets, newlines will be rendered as lists)</label>
                              <textarea 
                                value={div.winnersText}
                                onChange={e => updateDivision(catIdx, divIdx, 'winnersText', e.target.value)}
                                className={`${inputClass} min-h-[150px] resize-y`}
                                placeholder={"2023 - Jane Doe\n2022 - Jill Smith"}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* MEMORIAL SECTION */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
            Breanne Wigginton Memorial Award
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Section Title</label>
                <input 
                  value={state.memorialTitle}
                  onChange={e => setState({ ...state, memorialTitle: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Description Paragraph</label>
                <textarea 
                  value={state.memorialText}
                  onChange={e => setState({ ...state, memorialText: e.target.value })}
                  className={`${inputClass} min-h-[100px] resize-y`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Winners (Paste as bullets/newlines)</label>
                <textarea 
                  value={state.memorialWinners}
                  onChange={e => setState({ ...state, memorialWinners: e.target.value })}
                  className={`${inputClass} min-h-[150px] resize-y`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Award Banner Image</label>
              {state.memorialImage ? (
                <div className="relative aspect-video rounded-xl overflow-hidden group border border-white/10">
                  <Image src={state.memorialImage} alt="Memorial" fill className="object-cover" unoptimized />
                  <button
                    onClick={() => setState(prev => ({ ...prev, memorialImage: '' }))}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="relative aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-[#00B4CC]/50 hover:bg-[#00B4CC]/5 cursor-pointer flex flex-col items-center justify-center transition-all">
                  <input type="file" accept="image/*" onChange={uploadMemorialImage} className="hidden" disabled={isUploading} />
                  <ImageIcon className="w-8 h-8 text-white/40 mb-2" />
                  <span className="text-sm font-medium text-white/40 font-sans">
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </label>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
