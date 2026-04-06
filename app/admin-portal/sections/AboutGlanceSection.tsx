'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

interface ProgramLink {
  url: string;
  displayText: string;
}

interface ProgramCard {
  title: string;
  description: string;
  align?: 'left' | 'center' | 'right';
  iconName: string; // 'star', 'users', 'music'
  buttonLink: string;
  customLinks?: ProgramLink[];
}

interface AboutGlanceState {
  carouselImages: string[];
  beliefsTitle: string;
  beliefsIconName: string;
  beliefsText: string;
  beliefsAlign?: 'left' | 'center' | 'right';
  missionTitle: string;
  missionText: string;
  missionAlign?: 'left' | 'center' | 'right';
  missionImage: string;
  programs: ProgramCard[];
}

const renderAlignToggle = (current: 'left' | 'center' | 'right' = 'left', onChange: (val: 'left'|'center'|'right') => void) => (
  <div className="flex gap-1 bg-black/20 p-1 rounded-lg w-fit mt-1">
    {(['left', 'center', 'right'] as const).map(align => {
      const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight;
      return (
        <button
          key={align}
          onClick={(e) => { e.preventDefault(); onChange(align); }}
          title={`Align ${align}`}
          className={`p-1.5 rounded-md transition-colors ${current === align ? 'bg-myf-teal text-white' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
        >
          <Icon className="w-4 h-4" />
        </button>
      );
    })}
  </div>
);

const DEFAULT_STATE: AboutGlanceState = {
  carouselImages: [],
  beliefsTitle: 'What We Believe',
  beliefsIconName: 'star',
  beliefsText: 'Empowering youth through scholarships, fostering community service, and building future leaders.',
  missionTitle: 'Our Mission',
  missionText: 'To provide educational opportunities and personal growth experiences for the youth of Manteca.',
  missionImage: '',
  programs: [
    { title: 'Scholarship Competition', description: 'Annual scholarship program for youth.', iconName: 'star', buttonLink: '/competition/contestant' },
    { title: 'Community Service', description: 'Giving back to our local community.', iconName: 'users', buttonLink: '/service-team/join' },
    { title: 'Entertainment Division', description: 'Showcasing local talent.', iconName: 'music', buttonLink: '#' },
  ]
};

export default function AboutGlanceSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  useEffect(() => {
    registerSaveAction('about-glance', handleSave);
    return () => unregisterSaveAction('about-glance');
  });

  const [state, setState] = useState<AboutGlanceState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=about-glance');
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
        body: JSON.stringify({ id: 'about-glance', data: state })
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
      setState(prev => ({
        ...prev,
        carouselImages: [...prev.carouselImages, url]
      }));
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to upload image.', true);
    } finally {
      setIsUploading(false);
    }
  }

  async function uploadMissionImage(e: React.ChangeEvent<HTMLInputElement>) {
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
      setState(prev => ({ ...prev, missionImage: url }));
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to upload image.', true);
    } finally {
      setIsUploading(false);
    }
  }

  function removeImage(index: number) {
    setState(prev => ({
      ...prev,
      carouselImages: prev.carouselImages.filter((_, i) => i !== index)
    }));
  }

  function updateProgram(index: number, field: keyof ProgramCard, value: string) {
    const newPrograms = [...state.programs];
    newPrograms[index] = { ...newPrograms[index], [field]: value };
    setState(prev => ({ ...prev, programs: newPrograms }));
  }

  // Helper for input styles
  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-myf-teal focus:ring-1 focus:ring-myf-teal transition-all font-sans";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">MYF At A Glance</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage the top-level About Us page</p>
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
        {/* CAROUSEL IMAGES */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-myf-teal" />
            Hero Carousel Images
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {state.carouselImages.map((img, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group border border-white/10">
                <Image src={img} alt="Carousel" fill className="object-cover" unoptimized />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <label className="relative aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-myf-teal/50 hover:bg-myf-teal/5 cursor-pointer flex flex-col items-center justify-center transition-all">
              <input type="file" accept="image/*" onChange={uploadImage} className="hidden" disabled={isUploading} />
              <Plus className="w-8 h-8 text-white/40 mb-2" />
              <span className="text-sm font-medium text-white/40 font-sans">
                {isUploading ? 'Uploading...' : 'Add Image'}
              </span>
            </label>
          </div>
        </section>

        {/* BELIEFS (TEXT & ICON) */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans flex items-center justify-between">
            <span>What We Believe</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Section Title</label>
              <input 
                value={state.beliefsTitle}
                onChange={e => setState({ ...state, beliefsTitle: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Graphic Icon</label>
              <select 
                value={state.beliefsIconName}
                onChange={e => setState({ ...state, beliefsIconName: e.target.value })}
                className={inputClass}
              >
                <option value="star">Star (Competition)</option>
                <option value="users">Group (Community)</option>
                <option value="music">Music Notes (Entertainment)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white/70 font-sans">Beliefs Text (Supports markdown links [text](url))</label>
                {renderAlignToggle(state.beliefsAlign || 'left', (val) => setState({ ...state, beliefsAlign: val }))}
              </div>
              <textarea 
                value={state.beliefsText}
                onChange={e => setState({ ...state, beliefsText: e.target.value })}
                className={`${inputClass} ${state.beliefsAlign === 'center' ? 'text-center' : state.beliefsAlign === 'right' ? 'text-right' : 'text-left'} min-h-[100px] resize-y`}
              />
            </div>
          </div>
        </section>

        {/* MISSION SECTION */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-sans">Our Mission</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Section Title</label>
              <input 
                value={state.missionTitle}
                onChange={e => setState({ ...state, missionTitle: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white/70 font-sans">Mission Text (Supports markdown links [text](url))</label>
                {renderAlignToggle(state.missionAlign || 'left', (val) => setState({ ...state, missionAlign: val }))}
              </div>
              <textarea 
                value={state.missionText}
                onChange={e => setState({ ...state, missionText: e.target.value })}
                className={`${inputClass} ${state.missionAlign === 'center' ? 'text-center' : state.missionAlign === 'right' ? 'text-right' : 'text-left'} min-h-[120px] resize-y`}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Mission Image Upload</label>
              {state.missionImage ? (
                <div className="relative aspect-video max-w-sm rounded-xl overflow-hidden border border-white/10 group">
                   <Image src={state.missionImage} alt="Mission" fill className="object-cover" unoptimized />
                   <button onClick={() => setState({ ...state, missionImage: '' })} className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              ) : (
                <label className="relative aspect-video max-w-sm rounded-xl border-2 border-dashed border-white/20 hover:border-myf-teal/50 hover:bg-myf-teal/5 cursor-pointer flex flex-col items-center justify-center transition-all">
                  <input type="file" accept="image/*" onChange={uploadMissionImage} className="hidden" disabled={isUploading} />
                  <ImageIcon className="w-8 h-8 text-white/40 mb-2" />
                  <span className="text-sm font-medium text-white/40 font-sans">
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </label>
              )}
            </div>
          </div>
        </section>

        {/* PROGRAMS GRID */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white font-sans">Programs Grid (3 Cards)</h3>
          
          {state.programs.map((prog, idx) => (
            <div key={idx} className="bg-[#0a0f1a]/50 border border-white/5 p-4 rounded-xl space-y-4">
              <h4 className="text-white/60 text-sm font-bold uppercase tracking-wider">Card {idx + 1}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Title</label>
                  <input 
                    value={prog.title}
                    onChange={e => updateProgram(idx, 'title', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Icon (star, users, music)</label>
                  <select 
                    value={prog.iconName}
                    onChange={e => updateProgram(idx, 'iconName', e.target.value)}
                    className={inputClass}
                  >
                    <option value="star">Star (Competition)</option>
                    <option value="users">Group (Service)</option>
                    <option value="music">Music Notes (Entertainment)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-white/70 font-sans">Description (Supports shift+enter and markdown links)</label>
                    {renderAlignToggle(prog.align || 'left', (val) => updateProgram(idx, 'align', val as string))}
                  </div>
                  <textarea 
                    value={prog.description}
                    onChange={e => updateProgram(idx, 'description', e.target.value)}
                    className={`${inputClass} ${prog.align === 'center' ? 'text-center' : prog.align === 'right' ? 'text-right' : 'text-left'} min-h-[100px] resize-y`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Button Link</label>
                  <input 
                    value={prog.buttonLink}
                    onChange={e => updateProgram(idx, 'buttonLink', e.target.value)}
                    className={inputClass}
                  />
                </div>
                
                {/* CUSTOM LINKS UI */}
                <div className="md:col-span-2 bg-black/20 p-4 rounded-lg border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                     <label className="block text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                        <LinkIcon className="w-3.5 h-3.5" /> Additional Custom Links
                     </label>
                     <button 
                       onClick={(e) => {
                         e.preventDefault();
                         const newPrograms = [...state.programs];
                         newPrograms[idx].customLinks = [...(newPrograms[idx].customLinks || []), { displayText: 'New Link', url: '#' }];
                         setState(prev => ({ ...prev, programs: newPrograms }));
                       }}
                       className="text-xs flex items-center gap-1 text-myf-teal hover:text-white transition-colors"
                     >
                        <Plus className="w-3 h-3" /> Add Link
                     </button>
                  </div>
                  
                  {(!prog.customLinks || prog.customLinks.length === 0) ? (
                    <p className="text-[10px] text-white/30 italic">No extra links added.</p>
                  ) : (
                    <div className="space-y-2">
                      {prog.customLinks.map((link, linkIdx) => (
                        <div key={linkIdx} className="flex items-center gap-2 bg-[#161b22] border border-white/10 p-2 rounded-lg">
                          <input 
                            className="bg-transparent text-xs text-white flex-1 min-w-0 outline-none placeholder:text-white/20" 
                            placeholder="Display Text" 
                            value={link.displayText} 
                            onChange={e => {
                               const newPrograms = [...state.programs];
                               newPrograms[idx].customLinks![linkIdx].displayText = e.target.value;
                               setState(prev => ({ ...prev, programs: newPrograms }));
                            }} 
                          />
                          <div className="w-[1px] h-4 bg-white/10" />
                          <input 
                            className="bg-transparent text-xs text-white flex-1 min-w-0 outline-none placeholder:text-white/20" 
                            placeholder="URL (target='_blank')" 
                            value={link.url} 
                            onChange={e => {
                               const newPrograms = [...state.programs];
                               newPrograms[idx].customLinks![linkIdx].url = e.target.value;
                               setState(prev => ({ ...prev, programs: newPrograms }));
                            }} 
                          />
                          <button 
                            onClick={(e) => {
                               e.preventDefault();
                               const newPrograms = [...state.programs];
                               newPrograms[idx].customLinks!.splice(linkIdx, 1);
                               setState(prev => ({ ...prev, programs: newPrograms }));
                            }}
                            className="p-1 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
