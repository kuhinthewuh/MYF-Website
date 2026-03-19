'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Image as ImageIcon, Link as LinkIcon, UploadCloud, Trash2, GripVertical, Loader2 } from 'lucide-react';

interface AlumniImage {
  id: string;
  url: string;
  caption: string; // e.g., "Class of 2012"
}

interface ContactAlumniState {
  heading: string;
  description: string;
  surveyUrl: string;
  buttonLabel: string;
  images: AlumniImage[];
}

const DEFAULT_STATE: ContactAlumniState = {
  heading: 'Alumni Corner',
  description: 'Welcome back! Our alumni are the heart of Manteca Youth Focus. Whether you competed 5 years ago or 30 years ago, you are always part of the MYF family.',
  surveyUrl: 'https://docs.google.com/forms/d/e/.../viewform',
  buttonLabel: 'Update Your Contact Info',
  images: []
};

export default function ContactAlumniSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  useEffect(() => {
    registerSaveAction('contact-alumni', handleSave);
    return () => unregisterSaveAction('contact-alumni');
  });

  const [state, setState] = useState<ContactAlumniState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=contact-alumni');
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
        body: JSON.stringify({ id: 'contact-alumni', data: state })
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

  // --- IMAGE UPLOAD & ARRAY ---
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

      const newImage: AlumniImage = {
        id: Math.random().toString(36).substr(2, 9),
        url,
        caption: 'New Memory'
      };

      setState(prev => ({ ...prev, images: [...prev.images, newImage] }));

      // Reset input so they can pick the same file again if they want
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
       console.error(error);
       showToast('❌ Upload failed.', true);
    } finally {
       setIsUploading(false);
    }
  }

  function updateImageCaption(id: string, newCaption: string) {
    setState(prev => ({
      ...prev,
      images: prev.images.map(img => img.id === id ? { ...img, caption: newCaption } : img)
    }));
  }

  function removeImage(id: string) {
    setState(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  }


  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";
  const smallInputClass = "w-full bg-[#0a0f1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">Alumni Corner</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage alumni tracking surveys and the retro photo gallery</p>
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
        <div className="grid md:grid-cols-2 gap-6">
           <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
             <h3 className="text-lg font-bold text-white font-sans">Page Header</h3>
             
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
                 <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Description Paragraph</label>
                 <textarea 
                   value={state.description}
                   onChange={e => setState({ ...state, description: e.target.value })}
                   className={`${inputClass} min-h-[90px] resize-y`}
                 />
               </div>
             </div>
           </section>

           <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 relative overflow-hidden flex flex-col justify-center">
             
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#00B4CC]/20 text-[#00B4CC] rounded-xl flex items-center justify-center">
                   <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white font-sans">Survey / Keep In Touch URL</h3>
                   <p className="text-white/40 text-xs mt-0.5">Link to an external form (Google Forms, SurveyMonkey) where alumni can update their current info.</p>
                </div>
             </div>

             <div className="space-y-4">
               <div>
                 <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans tracking-wide">URL Destination</label>
                 <input 
                   type="url"
                   value={state.surveyUrl}
                   onChange={e => setState({ ...state, surveyUrl: e.target.value })}
                   className={inputClass}
                   placeholder="https://..."
                 />
               </div>
               <div>
                 <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans tracking-wide">Button Label</label>
                 <input 
                   type="text"
                   value={state.buttonLabel}
                   onChange={e => setState({ ...state, buttonLabel: e.target.value })}
                   className={inputClass}
                   placeholder="Update Your Contact Info"
                 />
               </div>
             </div>
           </section>
        </div>

        {/* PHOTO CAROUSEL ARRAY */}
        <section className="space-y-4 border-t border-white/10 pt-6">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-myf-teal" /> Retro Photo Gallery
                 </h3>
                 <p className="text-white/40 text-xs">These pictures will be displayed in an interactive polaroid/retro style carousel.</p>
              </div>

              <div>
                 <input 
                   type="file" 
                   accept="image/*"
                   onChange={handleImageUpload}
                   ref={fileInputRef}
                   className="hidden"
                 />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   disabled={isUploading}
                   className="flex items-center gap-2 text-sm text-white font-semibold transition-colors bg-[#00B4CC] hover:bg-[#00c5e0] px-4 py-2.5 rounded-xl shadow-lg disabled:opacity-50"
                 >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {state.images.map((img, idx) => (
                <div key={img.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group flex flex-col">
                   <div className="relative aspect-square w-full">
                      <img src={img.url} alt="Alumni" className="absolute inset-0 w-full h-full object-cover" />
                      
                      {/* Overlay Controls */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <div className="p-2 bg-black/50 rounded cursor-move text-white/70 hover:text-white">
                           <GripVertical className="w-5 h-5" />
                         </div>
                         <button onClick={() => removeImage(img.id)} className="p-2 bg-red-500/80 rounded text-white hover:bg-red-500 transition-colors">
                           <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                   
                   <div className="p-3 bg-[#0a0f1a] flex-1">
                      <label className="block text-[9px] uppercase font-bold text-white/40 mb-1">Polaroid Caption (Year/Name)</label>
                      <input 
                        value={img.caption} 
                        onChange={e => updateImageCaption(img.id, e.target.value)} 
                        className={smallInputClass} 
                        placeholder="e.g. Class of 2018"
                      />
                   </div>
                </div>
              ))}
              {state.images.length === 0 && (
                <div className="col-span-full py-12 border-2 border-dashed border-white/10 rounded-2xl flex flex-col justify-center items-center text-white/30 italic">
                   <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                   No photos added to the gallery yet. Click 'Upload Photo' above.
                </div>
              )}
           </div>

        </section>

      </div>
    </div>
  );
}
