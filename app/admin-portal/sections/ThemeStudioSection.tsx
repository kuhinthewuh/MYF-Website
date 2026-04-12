'use client';

import { useState, useEffect } from 'react';
import { useAdminSave } from '../components/AdminSaveContext';
import { Palette, Wand2, Loader2, History, Bookmark, X } from 'lucide-react';
import chroma from 'chroma-js';
import { useToast, Toast } from '../components/Toast';

interface SavedTheme {
  id: string;
  timestamp: string;
  colors: any;
}

const DEFAULT_THEME = {
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  primary: '#2DD4BF',
  primaryDeep: '#0F766E',
  secondary: '#FB7185',
  secondaryDeep: '#E11D48',
  accent: '#FBBF24',
  textMain: '#1E293B',
  textMuted: '#64748B'
};

const ELEMENT_MAP = [
  { id: 'bg', label: 'Site Background' },
  { id: 'surface', label: 'Card / Surface' },
  { id: 'primary', label: 'Primary Button / Link' },
  { id: 'primaryDeep', label: 'Primary Hover (Deep)' },
  { id: 'secondary', label: 'Secondary Accent' },
  { id: 'secondaryDeep', label: 'Secondary Hover (Deep)' },
  { id: 'accent', label: 'Tertiary Accent (Gold)' },
  { id: 'textMain', label: 'Main Text (Dark / Light)' },
  { id: 'textMuted', label: 'Muted Text' }
];

const REQUIRED_MANUAL_KEYS = ['bg', 'surface', 'primary', 'textMain', 'textMuted'];

export default function ThemeStudioSection() {
  const { registerSaveAction } = useAdminSave();
  
  const [theme, setTheme] = useState<any>(DEFAULT_THEME);
  const [savedTheme, setSavedTheme] = useState<any>(null);
  const [history, setHistory] = useState<SavedTheme[]>([]);
  const [bookmarks, setBookmarks] = useState<SavedTheme[]>([]);

  // Manual Builder State
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [manualThemeDraft, setManualThemeDraft] = useState<any>({});
  const [pickedColor, setPickedColor] = useState('#000000');
  const [selectedElementId, setSelectedElementId] = useState('bg');

  const { toast, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/content?id=global-theme').then(res => res.json()).then(d => {
        if (d?.data) {
          setTheme({ ...theme, ...d.data });
          setSavedTheme({ ...theme, ...d.data });
        }
    });
    fetch('/api/admin/content?id=theme-history').then(res => res.json()).then(d => {
        if (d?.data?.history) setHistory(d.data.history);
    });
    fetch('/api/admin/content?id=theme-bookmarks').then(res => res.json()).then(d => {
        if (d?.data?.bookmarks) setBookmarks(d.data.bookmarks);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isManualComplete = REQUIRED_MANUAL_KEYS.every(k => !!manualThemeDraft[k]);

  useEffect(() => {
    registerSaveAction('theme-studio', async () => {
      if (activeTab === 'manual' && !isManualComplete) {
         showToast('❌ Manual Theme is incomplete. Map all required elements first!', true);
         throw new Error('Incomplete theme');
      }

      const finalTheme = activeTab === 'manual' 
        ? { ...DEFAULT_THEME, ...theme, ...manualThemeDraft,
            primaryDeep: manualThemeDraft.primaryDeep || (manualThemeDraft.primary ? chroma(manualThemeDraft.primary).darken(0.8).hex() : theme.primaryDeep),
            secondaryDeep: manualThemeDraft.secondaryDeep || (manualThemeDraft.secondary ? chroma(manualThemeDraft.secondary).darken(0.8).hex() : theme.secondaryDeep)
          } 
        : theme;

      await fetch('/api/admin/content?id=global-theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'global-theme', data: finalTheme })
      });
      setTheme(finalTheme);
      setSavedTheme(finalTheme);
      showToast('✅ Theme applied sitewide!');
    });
  }, [theme, manualThemeDraft, activeTab, isManualComplete, registerSaveAction, showToast]);

  async function pushToHistory(colors: any, source: string) {
     const newTheme = { id: `${source}`, timestamp: new Date().toLocaleString(), colors };
     const newHistory = [newTheme, ...history].slice(0, 30);
     setHistory(newHistory);
     await fetch('/api/admin/content?id=theme-history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'theme-history', data: { history: newHistory } })
     });
  }

  async function pushToBookmarks(themeObj: any) {
    const alreadyExists = bookmarks.some(b => JSON.stringify(b.colors) === JSON.stringify(themeObj));
    if (alreadyExists) return;
    const newBookmark = { id: `Bookmark (${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`, timestamp: new Date().toLocaleDateString(), colors: themeObj };
    const newBookmarks = [newBookmark, ...bookmarks].slice(0, 20);
    setBookmarks(newBookmarks);
    await fetch('/api/admin/content?id=theme-bookmarks', {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ section: 'theme-bookmarks', data: { bookmarks: newBookmarks } })
    });
  }

  async function generateMLTheme() {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/generate-theme', { method: 'POST' });
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        applyGeneratedColors(data.results[0].palette, 'Huemint ML');
      } else throw new Error(data.error || 'Failed to fetch colors');
    } catch (e: any) {
      setErrorMsg('Failed to reach ML API. ' + e.message);
    }
    setIsLoading(false);
  }

  function applyGeneratedColors(rawHexes: string[], source: string) {
    const sorted = rawHexes.map(h => chroma(h)).sort((a, b) => b.luminance() - a.luminance());
    const bg = sorted[0].luminance(0.95).hex();
    const surface = '#FFFFFF';
    const textMain = sorted[5].luminance(0.05).hex();
    const textMuted = sorted[5].luminance(0.3).hex();
    const primary = sorted[2].hex();
    const primaryDeep = sorted[2].darken(0.8).hex();
    const secondary = sorted[3].hex();
    const secondaryDeep = sorted[3].darken(0.8).hex();
    const accent = sorted[4].hex();
    const newThemeObj = { bg, surface, primary, primaryDeep, secondary, secondaryDeep, accent, textMain, textMuted };
    setTheme(newThemeObj);
    pushToHistory(newThemeObj, source);
  }

  function resetToDefault() {
    setTheme(DEFAULT_THEME);
    pushToHistory(DEFAULT_THEME, 'Default Reset');
  }

  function mapColorToElement() {
     setManualThemeDraft((prev: any) => ({ ...prev, [selectedElementId]: pickedColor }));
  }

  function unmapElement(id: string) {
     setManualThemeDraft((prev: any) => {
        const next = { ...prev };
        delete next[id];
        return next;
     });
  }

  async function saveManualTheme() {
    if (!isManualComplete) return;
    const finalTheme = {
      ...DEFAULT_THEME,
      ...theme, 
      ...manualThemeDraft,
      primaryDeep: manualThemeDraft.primaryDeep || (manualThemeDraft.primary ? chroma(manualThemeDraft.primary).darken(0.8).hex() : theme.primaryDeep),
      secondaryDeep: manualThemeDraft.secondaryDeep || (manualThemeDraft.secondary ? chroma(manualThemeDraft.secondary).darken(0.8).hex() : theme.secondaryDeep)
    };
    setIsLoading(true);
    try {
      await fetch('/api/admin/content?id=global-theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'global-theme', data: finalTheme })
      });
      setTheme(finalTheme);
      setSavedTheme(finalTheme);
      showToast('✅ Manual Theme applied sitewide!');
      pushToHistory(finalTheme, 'Manual Builder');
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to save manual theme.');
    }
    setIsLoading(false);
  }

  const displayTheme = activeTab === 'manual' ? { ...theme, ...manualThemeDraft } : theme;
  // Deep comparison of the keys we care about
  const currentSig = savedTheme ? JSON.stringify(Object.keys(DEFAULT_THEME).map(k => (displayTheme as any)[k])) : null;
  const savedSig = savedTheme ? JSON.stringify(Object.keys(DEFAULT_THEME).map(k => savedTheme[k])) : null;
  const isLive = currentSig && savedSig && currentSig === savedSig;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <Toast toast={toast} />
       <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
          <Palette className="w-6 h-6 text-myf-teal" />
          Theme Studio
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Automate design choices using Machine Learning or explicitly map variables manually. <br/>
          Click <b className="text-white">Save All Changes</b> to apply your active tab globally.
        </p>
      </div>

       <div className="flex flex-col sm:flex-row gap-4 border-b border-white/10 pb-2">
         <button 
           onClick={() => setActiveTab('ai')}
           className={`pb-2 font-bold uppercase tracking-wider text-sm border-b-2 px-4 transition-colors ${activeTab === 'ai' ? 'text-white border-purple-500' : 'text-white/40 border-transparent hover:text-white/70'}`}
         >
           AI Generation Studio
         </button>
         <button 
           onClick={() => setActiveTab('manual')}
           className={`pb-2 font-bold uppercase tracking-wider text-sm border-b-2 px-4 transition-colors ${activeTab === 'manual' ? 'text-white border-blue-500' : 'text-white/40 border-transparent hover:text-white/70'}`}
         >
           Manual Theme Builder
         </button>
       </div>

      {errorMsg && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold">{errorMsg}</div>}

      {activeTab === 'ai' ? (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={generateMLTheme} disabled={isLoading} className="flex-1 p-6 bg-[#0d1117] border border-white/10 hover:border-purple-400/50 hover:bg-white/5 rounded-2xl flex items-center gap-4 transition-all group disabled:opacity-50 text-left cursor-pointer">
               <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                 {isLoading ? <Loader2 className="w-6 h-6 text-purple-400 animate-spin" /> : <Wand2 className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />}
               </div>
               <div>
                 <h3 className="text-white font-bold font-sans">Generate Random AI Theme</h3>
                 <p className="text-white/40 text-sm">Uses Huemint AI model via proxy</p>
               </div>
            </button>
            <button onClick={resetToDefault} disabled={isLoading} className="flex-1 p-6 bg-[#0d1117] border border-white/10 hover:border-blue-500/50 hover:bg-white/5 rounded-2xl flex items-center gap-4 transition-all group disabled:opacity-50 text-left cursor-pointer">
               <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                 <History className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
               </div>
               <div>
                 <h3 className="text-white font-bold font-sans">Reset To Default</h3>
                 <p className="text-white/40 text-sm">Restores original global MYF palette</p>
               </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {history.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 text-white/50" /> Previous Themes
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x pr-8">
                  {history.map((h, i) => (
                     <button key={i} onClick={() => setTheme(h.colors)} className="flex-shrink-0 w-64 p-4 rounded-xl border border-white/10 bg-[#0d1117] hover:border-myf-teal/50 hover:bg-white/5 transition-all text-left snap-start group">
                       <div className="flex gap-2 mb-3">
                         <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: h.colors.primary }} />
                         <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: h.colors.secondary }} />
                         <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: h.colors.accent }} />
                         <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: h.colors.bg }} />
                       </div>
                       <p className="text-white font-bold text-sm group-hover:text-myf-teal transition-colors">{h.id}</p>
                       <p className="text-white/40 text-xs mt-1">{h.timestamp}</p>
                     </button>
                  ))}
                </div>
              </div>
            )}
            {bookmarks.length > 0 && (
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6">
                <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                  <Bookmark className="w-4 h-4" /> Bookmarked Themes
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x pr-8">
                  {bookmarks.map((h, i) => (
                     <button key={i} onClick={() => setTheme(h.colors)} className="flex-shrink-0 w-64 p-4 rounded-xl border border-blue-500/20 bg-[#0d1117] hover:border-blue-400/50 hover:bg-white/5 transition-all text-left snap-start group">
                       <div className="flex gap-2 mb-3">
                         <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: h.colors.primary }} />
                         <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: h.colors.secondary }} />
                         <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: h.colors.accent }} />
                         <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: h.colors.bg }} />
                       </div>
                       <p className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">{h.id}</p>
                       <p className="text-white/40 text-xs mt-1">{h.timestamp}</p>
                     </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-6 bg-[#0d1117] border border-white/10 rounded-2xl space-y-6">
           <h2 className="text-xl font-bold font-sans text-white">Element Mapper</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
               <label className="block text-sm text-white/50 mb-2">1. Pick a Color</label>
               <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
                  <input type="color" value={pickedColor} onChange={e => setPickedColor(e.target.value)} className="w-16 h-12 rounded cursor-pointer border-0 bg-transparent p-0" />
                  <div className="font-mono text-lg text-white font-bold">{pickedColor.toUpperCase()}</div>
               </div>
             </div>
             <div>
               <label className="block text-sm text-white/50 mb-2">2. Select UI Element</label>
               <select value={selectedElementId} onChange={e => setSelectedElementId(e.target.value)} className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-4 text-white hover:bg-white/5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans">
                 {ELEMENT_MAP.map(el => (
                   <option key={el.id} value={el.id} className="bg-[#161b22] text-white">
                     {el.label} {REQUIRED_MANUAL_KEYS.includes(el.id) ? '*' : ''}
                   </option>
                 ))}
               </select>
             </div>
             <div className="flex items-end">
               <button onClick={mapColorToElement} className="w-full py-4 bg-blue-500/20 hover:bg-blue-500 border border-blue-500/50 hover:border-transparent text-white rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm">
                 + Map Color to Element
               </button>
             </div>
           </div>

           <div className="border-t border-white/10 pt-6 mt-6">
              <h3 className="text-sm font-bold text-white/50 mb-4 uppercase tracking-widest flex items-center gap-2">Mapped Variables <span className="text-red-400 lowercase font-medium tracking-normal">(* required elements strongly enforced)</span></h3>
              <div className="flex flex-wrap gap-3">
                 {ELEMENT_MAP.map(el => {
                    const isMapped = !!manualThemeDraft[el.id];
                    const color = isMapped ? manualThemeDraft[el.id] : 'transparent';
                    const isRequired = REQUIRED_MANUAL_KEYS.includes(el.id);
                    return (
                      <div key={el.id} className={`flex items-center gap-2 bg-[#161b22] border transition-all ${isMapped ? 'border-blue-500/50 text-white pl-2 pr-1 py-1' : 'border-white/10 text-white/40 p-2 pr-4 hover:border-white/20'} rounded-full text-xs font-semibold`}>
                        <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center overflow-hidden text-xs shrink-0 transition-colors" style={{ backgroundColor: color }}>
                          {(!isMapped && isRequired) && <span className="text-red-500 font-bold">*</span>}
                        </span>
                        <span className={isMapped ? 'pl-1' : ''}>{el.label}</span>
                        {isMapped && (
                           <button onClick={() => unmapElement(el.id)} className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors ml-1" title={`Remove ${el.label} mapping`}>
                              <X className="w-3 h-3" />
                           </button>
                        )}
                      </div>
                    )
                 })}
              </div>
           </div>
           
           <div className="border-t border-white/10 pt-6 flex justify-end">
             <button onClick={saveManualTheme} disabled={!isManualComplete || isLoading} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:grayscale flex items-center gap-2">
               {isLoading && <Loader2 className="w-4 h-4 animate-spin" />} Save &amp; Set as Live Theme
             </button>
           </div>
        </div>
      )}

      {/* LIVE MOCKUP PREVIEW */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold flex items-center gap-2">
            Live Mockup Preview 
            {isLive ? (
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider hover:bg-emerald-500/30 transition-colors">Live Site Identity</span>
            ) : (
              <span className="bg-white/10 text-white/50 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Unsaved Preview</span>
            )}
          </h3>
          {activeTab === 'ai' && (
            <button onClick={() => pushToBookmarks(displayTheme)} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-bold transition-all hover:scale-105">
              <Bookmark className="w-4 h-4" /> Bookmark Theme
            </button>
          )}
        </div>
        <div className="rounded-2xl p-8 relative overflow-hidden transition-colors duration-1000 border border-black/10 shadow-2xl" style={{ backgroundColor: displayTheme.bg }}>
           {isLoading && <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin" style={{ color: displayTheme.primary }} /></div>}
           <div className="max-w-xl mx-auto space-y-6">
              <h1 className="text-4xl font-bold font-heading transition-colors duration-1000" style={{ color: displayTheme.textMain }}>
                 Developing Tomorrow&apos;s Leaders
              </h1>
              <p className="text-lg transition-colors duration-1000" style={{ color: displayTheme.textMuted }}>
                 Manteca Youth Focus provides community service and leadership opportunities for young men and women.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <button className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105" style={{ backgroundColor: displayTheme.primary, boxShadow: `0 4px 14px 0 ${(displayTheme.primary || '#000000')}80` }}>
                    Get Involved
                 </button>
                 <button className="px-6 py-3 rounded-xl font-bold transition-all border-2 bg-transparent/20" style={{ borderColor: displayTheme.secondary, color: displayTheme.secondary }}>
                    Donate Today
                 </button>
              </div>
              <div className="pt-8 w-full flex flex-col sm:flex-row items-center gap-4">
                 <div className="flex-1 w-full h-32 rounded-xl flex items-center justify-center border shadow-sm transition-colors duration-1000" style={{ backgroundColor: displayTheme.surface, borderColor: displayTheme.primaryDeep }}>
                    <p style={{ color: displayTheme.textMain }} className="font-semibold text-sm">Surface Example 1</p>
                 </div>
                 <div className="flex-1 h-32 rounded-xl flex items-center justify-center border shadow-sm transition-colors duration-1000" style={{ backgroundColor: displayTheme.surface, borderColor: displayTheme.accent }}>
                    <p style={{ color: displayTheme.textMain }} className="font-semibold text-sm">Surface Example 2</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
