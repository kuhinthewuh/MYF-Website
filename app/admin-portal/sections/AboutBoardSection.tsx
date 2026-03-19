'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Plus, Trash2, Image as ImageIcon, GripVertical } from 'lucide-react';
import Image from 'next/image';

interface OfficerRecord {
  id: string; // needed for stable keys when dragging/editing
  name: string;
  title: string;
  image: string;
}

interface BoardMemberRecord {
  id: string;
  name: string;
  title: string;
  image: string;
}

interface ProgramDirectorRecord {
  id: string;
  name: string;
  title: string;
  image: string;
  description: string;
}

interface AboutBoardState {
  heroTitle: string;
  heroText: string;
  boardMembersTitle: string;
  programDirectorsTitle: string;
  officers: OfficerRecord[];
  boardMembers: BoardMemberRecord[];
  programDirectors: ProgramDirectorRecord[];
}

const DEFAULT_STATE: AboutBoardState = {
  heroTitle: 'Board of Directors',
  heroText: 'Manteca Youth Focus is proudly managed by an all-volunteer Board of Directors dedicated to community empowerment.',
  boardMembersTitle: 'Board Members',
  programDirectorsTitle: 'Program Directors',
  officers: [],
  boardMembers: [],
  programDirectors: []
};

export default function AboutBoardSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  useEffect(() => {
    registerSaveAction('about-board', handleSave);
    return () => unregisterSaveAction('about-board');
  });

  const [state, setState] = useState<AboutBoardState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=about-board');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const dirs = json.data.programDirectors || [];
          const migratedDirs = dirs.map((d: any) => {
             if (typeof d === 'string') return { id: Date.now().toString() + Math.random(), name: d, title: '', image: '', description: '' };
             return d;
          });
          
          setState({
            ...DEFAULT_STATE,
            ...json.data,
            programDirectors: migratedDirs,
            boardMembersTitle: json.data.boardMembersTitle || DEFAULT_STATE.boardMembersTitle,
            programDirectorsTitle: json.data.programDirectorsTitle || DEFAULT_STATE.programDirectorsTitle
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
        body: JSON.stringify({ id: 'about-board', data: state })
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

  // Generic Image Uploader
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, id: string, arrayType: 'officers' | 'boardMembers' | 'programDirectors') {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingId(id);
    
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
      
      const newArray = [...state[arrayType]] as any[];
      const idx = newArray.findIndex((item: any) => item.id === id);
      if (idx !== -1) {
         newArray[idx].image = url;
         setState(prev => ({ ...prev, [arrayType]: newArray }));
      }
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to upload image.', true);
    } finally {
      setUploadingId(null);
    }
  }

  // --- Officers ---
  function addOfficer() {
    setState(prev => ({
      ...prev,
      officers: [...prev.officers, { id: Date.now().toString(), name: '', title: '', image: '' }]
    }));
  }
  function updateOfficer(id: string, field: keyof OfficerRecord, value: string) {
    setState(prev => ({
      ...prev,
      officers: prev.officers.map(o => o.id === id ? { ...o, [field]: value } : o)
    }));
  }
  function removeOfficer(id: string) {
    setState(prev => ({ ...prev, officers: prev.officers.filter(o => o.id !== id) }));
  }

  // --- Board Members ---
  function addBoardMember() {
    setState(prev => ({
      ...prev,
      boardMembers: [...prev.boardMembers, { id: Date.now().toString(), name: '', title: '', image: '' }]
    }));
  }
  function updateBoardMember(id: string, field: keyof BoardMemberRecord, value: string) {
    setState(prev => ({
      ...prev,
      boardMembers: prev.boardMembers.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  }
  function removeBoardMember(id: string) {
    setState(prev => ({ ...prev, boardMembers: prev.boardMembers.filter(b => b.id !== id) }));
  }

  // --- Program Directors ---
  function addDirector() {
    setState(prev => ({ ...prev, programDirectors: [...prev.programDirectors, { id: Date.now().toString(), name: '', title: '', image: '', description: '' }] }));
  }
  function updateDirector(id: string, field: keyof ProgramDirectorRecord, value: string) {
    setState(prev => ({
      ...prev,
      programDirectors: prev.programDirectors.map(d => d.id === id ? { ...d, [field]: value } : d)
    }));
  }
  function removeDirector(id: string) {
    setState(prev => ({ ...prev, programDirectors: prev.programDirectors.filter(d => d.id !== id) }));
  }

  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">Board of Directors</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage officers, board members, and program directors</p>
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
          <h3 className="text-lg font-bold text-white font-sans flex items-center justify-between">
            Hero Introduction
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Title</label>
              <input 
                value={state.heroTitle}
                onChange={e => setState({ ...state, heroTitle: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Introduction Paragraph</label>
              <textarea 
                value={state.heroText}
                onChange={e => setState({ ...state, heroText: e.target.value })}
                className={`${inputClass} min-h-[80px] resize-y`}
              />
            </div>
          </div>
        </section>

        {/* OFFICERS */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-white font-sans">Executive Officers</h3>
             <button onClick={addOfficer} className="flex items-center gap-1 text-sm text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-3 py-1.5 rounded-lg">
                <Plus className="w-4 h-4" /> Add Officer
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {state.officers.map((officer) => (
                <div key={officer.id} className="bg-[#0a0f1a]/50 border border-white/5 p-4 rounded-xl space-y-4 relative group">
                   <button onClick={() => removeOfficer(officer.id)} className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                     <Trash2 className="w-4 h-4" />
                   </button>

                   {/* Image Upload Area */}
                   {officer.image ? (
                     <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10">
                       <Image src={officer.image} alt="Officer" fill className="object-cover" unoptimized />
                       <button onClick={() => updateOfficer(officer.id, 'image', '')} className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-sm text-white font-semibold">
                         Replace Image
                       </button>
                     </div>
                   ) : (
                     <label className="relative aspect-[3/4] rounded-lg border-2 border-dashed border-white/20 hover:border-[#00B4CC]/50 hover:bg-[#00B4CC]/5 cursor-pointer flex flex-col items-center justify-center transition-all">
                       <input type="file" accept="image/*" onChange={(e) => handleUpload(e, officer.id, 'officers')} className="hidden" disabled={uploadingId === officer.id} />
                       <ImageIcon className="w-6 h-6 text-white/40 mb-2" />
                       <span className="text-xs font-medium text-white/40 font-sans">
                         {uploadingId === officer.id ? 'Uploading...' : 'Upload Photo'}
                       </span>
                     </label>
                   )}

                   <div className="space-y-3">
                     <div>
                       <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-sans">Name</label>
                       <input value={officer.name} onChange={e => updateOfficer(officer.id, 'name', e.target.value)} className={inputClass} placeholder="John Doe" />
                     </div>
                     <div>
                       <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-sans">Title</label>
                       <input value={officer.title} onChange={e => updateOfficer(officer.id, 'title', e.target.value)} className={inputClass} placeholder="President" />
                     </div>
                   </div>
                </div>
             ))}
          </div>
          {state.officers.length === 0 && <p className="text-white/30 text-center italic py-4">No officers added yet.</p>}
        </section>

        {/* BOARD MEMBERS */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex-1 max-w-sm">
                <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Section Title</label>
                <input 
                  value={state.boardMembersTitle}
                  onChange={e => setState({ ...state, boardMembersTitle: e.target.value })}
                  className={inputClass}
                />
             </div>
             <button onClick={addBoardMember} className="flex items-center gap-1 text-sm text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-3 py-1.5 rounded-lg mt-5">
                <Plus className="w-4 h-4" /> Add Board Member
             </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {state.boardMembers.map((member) => (
                <div key={member.id} className="bg-[#0a0f1a]/50 border border-white/5 p-3 rounded-xl space-y-3 relative group">
                   <button onClick={() => removeBoardMember(member.id)} className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 scale-75">
                     <Trash2 className="w-4 h-4" />
                   </button>

                   {/* Image Upload Area */}
                   {member.image ? (
                     <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10">
                       <Image src={member.image} alt="Board Member" fill className="object-cover" unoptimized />
                       <button onClick={() => updateBoardMember(member.id, 'image', '')} className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-white font-semibold">
                         Replace
                       </button>
                     </div>
                   ) : (
                     <label className="relative aspect-[4/3] rounded-lg border-2 border-dashed border-white/20 hover:border-[#00B4CC]/50 hover:bg-[#00B4CC]/5 cursor-pointer flex flex-col items-center justify-center transition-all">
                       <input type="file" accept="image/*" onChange={(e) => handleUpload(e, member.id, 'boardMembers')} className="hidden" disabled={uploadingId === member.id} />
                       <ImageIcon className="w-5 h-5 text-white/40 mb-1" />
                       <span className="text-[10px] font-medium text-white/40 font-sans">
                         {uploadingId === member.id ? '...' : 'Upload'}
                       </span>
                     </label>
                   )}

                   <div className="space-y-1">
                     <input value={member.title} onChange={e => updateBoardMember(member.id, 'title', e.target.value)} className={`${inputClass} px-2 py-1.5 text-center text-[10px] uppercase font-bold text-myf-teal`} placeholder="Title" />
                     <input value={member.name} onChange={e => updateBoardMember(member.id, 'name', e.target.value)} className={`${inputClass} px-2 py-1.5 text-center text-xs`} placeholder="Name" />
                   </div>
                </div>
             ))}
          </div>
          {state.boardMembers.length === 0 && <p className="text-white/30 text-center italic py-4">No board members added yet.</p>}
        </section>

        {/* PROGRAM DIRECTORS */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex-1 max-w-sm">
                <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Section Title</label>
                <input 
                  value={state.programDirectorsTitle}
                  onChange={e => setState({ ...state, programDirectorsTitle: e.target.value })}
                  className={inputClass}
                />
             </div>
             <button onClick={addDirector} className="flex items-center gap-1 text-sm text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-3 py-1.5 rounded-lg mt-5">
                <Plus className="w-4 h-4" /> Add Program Director
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {state.programDirectors.map((director) => (
                <div key={director.id} className="bg-[#0a0f1a]/50 border border-white/5 p-4 rounded-xl space-y-4 relative group">
                   <button onClick={() => removeDirector(director.id)} className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                     <Trash2 className="w-4 h-4" />
                   </button>

                   {/* Image Upload Area */}
                   {director.image ? (
                     <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10">
                       <Image src={director.image} alt="Director" fill className="object-cover" unoptimized />
                       <button onClick={() => updateDirector(director.id, 'image', '')} className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-sm text-white font-semibold">
                         Replace Image
                       </button>
                     </div>
                   ) : (
                     <label className="relative aspect-[3/4] rounded-lg border-2 border-dashed border-white/20 hover:border-[#00B4CC]/50 hover:bg-[#00B4CC]/5 cursor-pointer flex flex-col items-center justify-center transition-all">
                       <input type="file" accept="image/*" onChange={(e) => handleUpload(e, director.id, 'programDirectors')} className="hidden" disabled={uploadingId === director.id} />
                       <ImageIcon className="w-6 h-6 text-white/40 mb-2" />
                       <span className="text-xs font-medium text-white/40 font-sans">
                         {uploadingId === director.id ? 'Uploading...' : 'Upload Photo'}
                       </span>
                     </label>
                   )}

                   <div className="space-y-3">
                     <div>
                       <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-sans">Name</label>
                       <input value={director.name} onChange={e => updateDirector(director.id, 'name', e.target.value)} className={inputClass} placeholder="Jane Doe" />
                     </div>
                     <div>
                       <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-sans">Title</label>
                       <input value={director.title} onChange={e => updateDirector(director.id, 'title', e.target.value)} className={inputClass} placeholder="Director of X" />
                     </div>
                     <div>
                       <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-sans">Description (Supports links [text](url))</label>
                       <textarea value={director.description} onChange={e => updateDirector(director.id, 'description', e.target.value)} className={`${inputClass} min-h-[80px] resize-y`} placeholder="Description..." />
                     </div>
                   </div>
                </div>
             ))}
          </div>
          {state.programDirectors.length === 0 && <p className="text-white/30 text-center italic py-4">No program directors added yet.</p>}
        </section>

      </div>
    </div>
  );
}
