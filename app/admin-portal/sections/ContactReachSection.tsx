'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useToast, Toast } from '../components/Toast';
import { Save, Map, Mail, Phone, MapPin, Share2 } from 'lucide-react';

interface ContactReachState {
  heading: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  mapEmbed: string;
  instagramUrl: string;
  facebookUrl: string;
}

const DEFAULT_STATE: ContactReachState = {
  heading: 'Get In Touch',
  description: 'Have questions about our programs, scholarships, or upcoming events? We would love to hear from you. Reach out to our team using the contact information below.',
  email: 'info@mantecayouthfocus.org',
  phone: '(209) 555-0198',
  address: '123 Main Street, Suite 100\nManteca, CA 95336',
  mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15764.492572230718!2d-121.228514!3d37.79679195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8090141f235d97a9%3A0xe5429ef9bf872e42!2sManteca%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  instagramUrl: 'https://instagram.com/mantecayouthfocus',
  facebookUrl: 'https://facebook.com/mantecayouthfocus'
};

export default function ContactReachSection() {
  const [state, setState] = useState<ContactReachState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast, showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/admin/content?id=contact-reach');
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
        body: JSON.stringify({ id: 'contact-reach', data: state })
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

  const inputClass = "w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";
  const smallInputClass = "w-full bg-[#0a0f1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] transition-all font-sans text-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">Reach Out</h2>
          <p className="text-white/40 text-sm font-sans mt-1">Manage contact information, social links, and physical map locations</p>
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

      <div className="grid md:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
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
                 <label className="block text-xs font-medium text-white/70 mb-1 font-sans">Description Paragraph</label>
                 <textarea 
                   value={state.description}
                   onChange={e => setState({ ...state, description: e.target.value })}
                   className={`${inputClass} min-h-[90px] resize-y`}
                 />
               </div>
             </div>
           </section>

           <section className="bg-white/5 border border-[#00B4CC]/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#00B4CC]/20 text-[#00B4CC] rounded-xl">
                   <Map className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white font-sans">Google Maps Embed</h3>
                   <p className="text-white/40 text-xs mt-0.5">Go to Google Maps ➔ Share ➔ Embed a map ➔ Copy HTML</p>
                </div>
             </div>

             <textarea 
               value={state.mapEmbed}
               onChange={e => setState({ ...state, mapEmbed: e.target.value })}
               className={`${inputClass} min-h-[120px] resize-y font-mono text-xs`}
               placeholder="<iframe src='...' ...></iframe>"
             />
           </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
           <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white font-sans">Contact Information</h3>
              <p className="text-white/40 text-xs">This data will populate the contact card displayed on the page.</p>

              <div className="space-y-4 mt-4">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 shrink-0">
                       <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-bold text-white/40 mb-1">Email Address</label>
                      <input value={state.email} onChange={e => setState({ ...state, email: e.target.value })} className={smallInputClass} />
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 shrink-0">
                       <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-bold text-white/40 mb-1">Phone Number</label>
                      <input value={state.phone} onChange={e => setState({ ...state, phone: e.target.value })} className={smallInputClass} />
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 shrink-0">
                       <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-bold text-white/40 mb-1">Physical Address</label>
                      <textarea value={state.address} onChange={e => setState({ ...state, address: e.target.value })} className={`${smallInputClass} min-h-[60px]`} />
                    </div>
                 </div>
              </div>

           </section>

           <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                 <Share2 className="w-5 h-5 text-[#00B4CC]" />
                 <h3 className="text-lg font-bold text-white font-sans">Social Links</h3>
              </div>

              <div className="space-y-4 mt-2">
                 <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-1">Instagram URL</label>
                    <input type="url" value={state.instagramUrl} onChange={e => setState({ ...state, instagramUrl: e.target.value })} className={smallInputClass} />
                 </div>
                 <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-1">Facebook URL</label>
                    <input type="url" value={state.facebookUrl} onChange={e => setState({ ...state, facebookUrl: e.target.value })} className={smallInputClass} />
                 </div>
              </div>
           </section>
        </div>

      </div>
    </div>
  );
}
