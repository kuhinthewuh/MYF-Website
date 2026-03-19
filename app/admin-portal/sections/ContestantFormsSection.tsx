'use client';
import { useAdminSave } from '../components/AdminSaveContext';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react';

interface FormButton {
  label: string;
  url: string;
  type: 'solid' | 'outline';
}

interface StepNode {
  title: string;
  instructions: string;
  buttons: FormButton[];
}

interface StepRecord {
  nodes: StepNode[];
}

interface ContestantFormsState {
  heading: string;
  steps: StepRecord[];
}

const DEFAULT_STATE: ContestantFormsState = {
  heading: 'Contestant Forms & Deadlines',
  steps: [
    { nodes: [{ title: 'Step 1: Become a Contestant', instructions: 'Complete the interest form to begin your journey.', buttons: [{ label: 'Interest Form', url: '/competition/contestant', type: 'solid' }] }] },
    { nodes: [{ title: 'Step 2: Due April 1st', instructions: 'Submit your headshot and biography.', buttons: [{ label: 'Upload Headshot', url: '#', type: 'outline' }] }] },
    { nodes: [{ title: 'Step 3: Due April 15th', instructions: 'Submit final paperwork based on your division.', buttons: [{ label: 'Younger Division', url: '#', type: 'solid' }, { label: 'Upper Division', url: '#', type: 'solid' }] }] },
    { nodes: [{ title: 'Step 4: Due May 1st', instructions: 'Ad pages and ticket sales are due.', buttons: [] }] },
    { nodes: [{ title: 'Step 5: Due June 1st', instructions: 'Final rehearsal schedule and talent music submission.', buttons: [] }] },
  ]
};

export default function ContestantFormsSection() {
  const { registerSaveAction, unregisterSaveAction } = useAdminSave();
  useEffect(() => {
    registerSaveAction('competition-forms', handleSave);
    return () => unregisterSaveAction('competition-forms');
  });

  const [state, setState] = useState<ContestantFormsState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=competition-forms');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const fetchedSteps = json.data.steps || [];
          const migratedSteps = fetchedSteps.map((s: any) => {
            if (s.nodes) return s; // already new format
            return {
              nodes: [
                { title: s.title || '', instructions: s.instructions || '', buttons: s.buttons || [] }
              ]
            };
          });
          setState({ heading: json.data.heading || DEFAULT_STATE.heading, steps: migratedSteps });
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
        body: JSON.stringify({ id: 'competition-forms', data: state })
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

  // --- STEPS ---
  function addStep() {
    setState(prev => ({ ...prev, steps: [...prev.steps, { nodes: [{ title: 'New Step', instructions: '', buttons: [] }] }] }));
  }
  function removeStep(stepIndex: number) {
    const newSteps = [...state.steps];
    newSteps.splice(stepIndex, 1);
    setState(prev => ({ ...prev, steps: newSteps }));
    if (expandedStep === stepIndex) setExpandedStep(null);
  }

  // --- NODES ---
  function addNode(stepIndex: number) {
    const newSteps = [...state.steps];
    newSteps[stepIndex].nodes.push({ title: 'New Node', instructions: '', buttons: [] });
    setState(prev => ({ ...prev, steps: newSteps }));
  }
  function removeNode(stepIndex: number, nodeIndex: number) {
    const newSteps = [...state.steps];
    newSteps[stepIndex].nodes.splice(nodeIndex, 1);
    setState(prev => ({ ...prev, steps: newSteps }));
  }
  function updateNode(stepIndex: number, nodeIndex: number, field: keyof StepNode, value: string) {
    const newSteps = [...state.steps];
    newSteps[stepIndex].nodes[nodeIndex] = { ...newSteps[stepIndex].nodes[nodeIndex], [field]: value };
    setState(prev => ({ ...prev, steps: newSteps }));
  }

  // --- BUTTONS ---
  function addButton(stepIndex: number, nodeIndex: number) {
    const newSteps = [...state.steps];
    newSteps[stepIndex].nodes[nodeIndex].buttons.push({ label: 'New Button', url: '', type: 'outline' });
    setState(prev => ({ ...prev, steps: newSteps }));
  }

  function updateButton(stepIndex: number, nodeIndex: number, btnIndex: number, field: keyof FormButton, value: string) {
    const newSteps = [...state.steps];
    newSteps[stepIndex].nodes[nodeIndex].buttons[btnIndex] = { ...newSteps[stepIndex].nodes[nodeIndex].buttons[btnIndex], [field]: value };
    setState(prev => ({ ...prev, steps: newSteps }));
  }

  function removeButton(stepIndex: number, nodeIndex: number, btnIndex: number) {
    const newSteps = [...state.steps];
    newSteps[stepIndex].nodes[nodeIndex].buttons.splice(btnIndex, 1);
    setState(prev => ({ ...prev, steps: newSteps }));
  }

  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";
  const smallInputClass = "w-full bg-[#0a0f1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-xs";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">Contestant Forms</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage the chronological stepper and forms</p>
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
          <label className="block text-sm font-bold text-white font-sans">Page Heading</label>
          <input 
            value={state.heading}
            onChange={e => setState({ ...state, heading: e.target.value })}
            className={inputClass}
          />
        </section>

        {/* STEPPER ARRAY EDITOR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-sans">Stepper Timeline</h3>
            <button onClick={addStep} className="flex items-center gap-1 text-sm text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-3 py-1.5 rounded-lg">
               <Plus className="w-4 h-4" /> Add Step Segment
            </button>
          </div>
          
          <div className="space-y-4">
            {state.steps.map((step, sIdx) => (
              <div key={sIdx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative">
                
                <button 
                  onClick={() => setExpandedStep(expandedStep === sIdx ? null : sIdx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors pr-12"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#00B4CC]/20 text-[#00B4CC] flex items-center justify-center font-bold font-sans shrink-0">
                      {sIdx + 1}
                    </div>
                    <span className="font-bold text-white font-sans text-left truncate">
                      {step.nodes && step.nodes.length > 0 ? step.nodes[0].title : 'Empty Step'} 
                      {step.nodes && step.nodes.length > 1 && ` (+${step.nodes.length - 1} more nodes)`}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${expandedStep === sIdx ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeStep(sIdx); }} 
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors z-10"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {expandedStep === sIdx && (
                  <div className="p-4 border-t border-white/10 bg-[#0a0f1a]/50 space-y-8">
                    
                    <div className="flex items-center justify-between">
                       <h4 className="text-sm font-bold text-white/60 uppercase tracking-widest font-sans">Nodes in this Step</h4>
                       <button onClick={() => addNode(sIdx)} className="flex items-center gap-1 text-[10px] text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-2 py-1 rounded">
                          <Plus className="w-3 h-3" /> Add Node
                       </button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                       {step.nodes && step.nodes.map((node, nIdx) => (
                          <div key={nIdx} className="bg-white/5 border border-[#00B4CC]/20 rounded-xl p-4 space-y-4 relative">
                             <button onClick={() => removeNode(sIdx, nIdx)} className="absolute top-2 right-2 text-white/30 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                             <div>
                               <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans">Node Title</label>
                               <input value={node.title} onChange={e => updateNode(sIdx, nIdx, 'title', e.target.value)} className={inputClass} />
                             </div>
                             <div>
                               <label className="block text-[10px] uppercase font-bold text-white/50 mb-1 font-sans">Instructions (Text - Shift+Enter for newline)</label>
                               <textarea value={node.instructions} onChange={e => updateNode(sIdx, nIdx, 'instructions', e.target.value)} className={`${inputClass} min-h-[60px] resize-y`} />
                             </div>

                             {/* Step Buttons Array */}
                             <div className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-4">
                               <div className="flex items-center justify-between">
                                  <h5 className="text-[11px] font-bold text-white/70 font-sans">Action Buttons</h5>
                                  <button onClick={() => addButton(sIdx, nIdx)} className="flex items-center gap-1 text-[10px] text-[#00B4CC] hover:text-white transition-colors bg-[#00B4CC]/10 px-2 py-1 rounded">
                                     <Plus className="w-3 h-3" /> Add Btn
                                  </button>
                               </div>

                               <div className="space-y-3">
                                  {node.buttons && node.buttons.map((btn, bIdx) => (
                                    <div key={bIdx} className="flex flex-col gap-3 items-start bg-white/5 p-3 rounded-lg border border-white/10 relative group">
                                      <div className="flex-1 w-full relative drop-shadow-sm">
                                        <label className="block text-[9px] uppercase font-bold text-myf-teal mb-1">Label</label>
                                        <input value={btn.label} onChange={e => updateButton(sIdx, nIdx, bIdx, 'label', e.target.value)} className={smallInputClass} />
                                      </div>
                                      <div className="flex-1 w-full relative drop-shadow-sm">
                                        <label className="block text-[9px] uppercase font-bold text-myf-teal mb-1">URL / Link</label>
                                        <input value={btn.url} onChange={e => updateButton(sIdx, nIdx, bIdx, 'url', e.target.value)} className={smallInputClass} />
                                      </div>
                                      <div className="w-full relative drop-shadow-sm flex items-end gap-3">
                                        <div className="flex-1">
                                           <label className="block text-[9px] uppercase font-bold text-myf-teal mb-1">Button Style</label>
                                           <select value={btn.type} onChange={e => updateButton(sIdx, nIdx, bIdx, 'type', e.target.value)} className={smallInputClass}>
                                              <option value="solid">Solid Teal</option>
                                              <option value="outline">Ghost / Outline</option>
                                           </select>
                                        </div>
                                        <button onClick={() => removeButton(sIdx, nIdx, bIdx)} className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/20">
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  {(!node.buttons || node.buttons.length === 0) && <p className="text-white/30 text-xs italic">No buttons.</p>}
                               </div>
                             </div>
                          </div>
                       ))}
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
