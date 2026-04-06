'use client';

import { useState, useEffect } from 'react';
import { useAdminSave } from '../components/AdminSaveContext';
import { Palette, Wand2, Loader2, History, Bookmark } from 'lucide-react';
import chroma from 'chroma-js';
import { useToast, Toast } from '../components/Toast';

// Remove static import to fix webpack bugs
// import ColorThief from 'colorthief';

interface SavedTheme {
  id: string;
  timestamp: string;
  colors: any;
}

export default function ThemeStudioSection() {
  const { registerSaveAction } = useAdminSave();
  
  const [theme, setTheme] = useState<any>({
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#2DD4BF',
    primaryDeep: '#0F766E',
    secondary: '#FB7185',
    secondaryDeep: '#E11D48',
    accent: '#FBBF24',
    textMain: '#1E293B',
    textMuted: '#64748B'
  });
  const [savedTheme, setSavedTheme] = useState<any>(null);
  const [history, setHistory] = useState<SavedTheme[]>([]);
  const [bookmarks, setBookmarks] = useState<SavedTheme[]>([]);

  const { toast, showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch initial theme and history
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
  }, []);

  useEffect(() => {
    registerSaveAction('theme-studio', async () => {
      await fetch('/api/admin/content?id=global-theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'global-theme', data: theme })
      });
      setSavedTheme(theme);
      showToast('✅ Theme applied sitewide!');
    });
  }, [theme, registerSaveAction, showToast]);

  async function pushToHistory(colors: any, source: string) {
     const newTheme = {
       id: `${source}`,
       timestamp: new Date().toLocaleString(),
       colors
     };
     const newHistory = [newTheme, ...history].slice(0, 30); // Keep last 30
     setHistory(newHistory);
     await fetch('/api/admin/content?id=theme-history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'theme-history', data: { history: newHistory } })
     });
  }

  async function generateMLTheme() {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/generate-theme', { method: 'POST' });
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const colors = data.results[0].palette;
        applyGeneratedColors(colors, 'Huemint ML');
      } else {
        throw new Error(data.error || 'Failed to fetch colors from ML Proxy');
      }
    } catch (e: any) {
      setErrorMsg('Failed to reach ML API. ' + e.message);
    }
    setIsLoading(false);
  }

  function applyGeneratedColors(rawHexes: string[], source: string) {
    // Sort by luminance
    const sorted = rawHexes.map(h => chroma(h)).sort((a, b) => b.luminance() - a.luminance());
    
    // Lightest for background, ensuring extremely light
    const bg = sorted[0].luminance(0.95).hex();
    const surface = '#FFFFFF';
    
    // Darkest for text
    const textMain = sorted[5].luminance(0.05).hex();
    const textMuted = sorted[5].luminance(0.3).hex();

    // The rest for primaries
    const primaryRaw = sorted[2];
    const primary = primaryRaw.hex();
    const primaryDeep = primaryRaw.darken(0.8).hex();

    const secondaryRaw = sorted[3];
    const secondary = secondaryRaw.hex();
    const secondaryDeep = secondaryRaw.darken(0.8).hex();

    const accentRaw = sorted[4];
    const accent = accentRaw.hex();

    const newThemeObj = { bg, surface, primary, primaryDeep, secondary, secondaryDeep, accent, textMain, textMuted };
    setTheme(newThemeObj);
    pushToHistory(newThemeObj, source);
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

  function resetToDefault() {
    setTheme(DEFAULT_THEME);
    pushToHistory(DEFAULT_THEME, 'Default Reset');
  }

  async function pushToBookmarks(themeObj: any) {
    // Prevent duplicate bookmarking
    const alreadyExists = bookmarks.some(b => JSON.stringify(b.colors) === JSON.stringify(themeObj));
    if (alreadyExists) return;

    const newBookmark = {
      id: `Bookmark (${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`,
      timestamp: new Date().toLocaleDateString(),
      colors: themeObj
    };
    const newBookmarks = [newBookmark, ...bookmarks].slice(0, 20); // Keep last 20 bookmarks
    setBookmarks(newBookmarks);
    await fetch('/api/admin/content?id=theme-bookmarks', {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ section: 'theme-bookmarks', data: { bookmarks: newBookmarks } })
    });
  }

  const isLive = savedTheme && JSON.stringify(theme) === JSON.stringify(savedTheme);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <Toast toast={toast} />
       <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
          <Palette className="w-6 h-6 text-myf-teal" />
          Theme Studio
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Automate design choices using Machine Learning or extracted palette extraction. <br/>
          Click <b className="text-white">Save All Changes</b> in the top right to apply globally.
        </p>
      </div>

      <div className="flex gap-4">
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

      {errorMsg && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold">{errorMsg}</div>}

      {/* HISTORY & BOOKMARKS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {history.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-white/50" />
              Previous Themes
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x pr-8">
              {history.map((h, i) => (
                 <button 
                   key={i} 
                   onClick={() => setTheme(h.colors)}
                   className="flex-shrink-0 w-64 p-4 rounded-xl border border-white/10 bg-[#0d1117] hover:border-myf-teal/50 hover:bg-white/5 transition-all text-left snap-start group"
                 >
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
              <Bookmark className="w-4 h-4" />
              Bookmarked Themes
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x pr-8">
              {bookmarks.map((h, i) => (
                 <button 
                   key={i} 
                   onClick={() => setTheme(h.colors)}
                   className="flex-shrink-0 w-64 p-4 rounded-xl border border-blue-500/20 bg-[#0d1117] hover:border-blue-400/50 hover:bg-white/5 transition-all text-left snap-start group"
                 >
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
          <button 
            onClick={() => pushToBookmarks(theme)} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-bold transition-all hover:scale-105"
          >
            <Bookmark className="w-4 h-4" />
            Bookmark Theme
          </button>
        </div>
        <div className="rounded-2xl p-8 relative overflow-hidden transition-colors duration-1000 border border-black/10 shadow-2xl" style={{ backgroundColor: theme.bg }}>
           {isLoading && (
              <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                 <Loader2 className="w-10 h-10 animate-spin" style={{ color: theme.primary }} />
              </div>
           )}
           <div className="max-w-xl mx-auto space-y-6">
              <h1 className="text-4xl font-bold font-heading transition-colors duration-1000" style={{ color: theme.textMain }}>
                 Developing Tomorrow's Leaders
              </h1>
              <p className="text-lg transition-colors duration-1000" style={{ color: theme.textMuted }}>
                 Manteca Youth Focus provides community service and leadership opportunities for young men and women.
              </p>
              <div className="flex gap-4 pt-4">
                 <button className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105" style={{ backgroundColor: theme.primary, boxShadow: `0 4px 14px 0 ${theme.primary}80` }}>
                    Get Involved
                 </button>
                 <button className="px-6 py-3 rounded-xl font-bold transition-all border-2 bg-transparent/20" style={{ borderColor: theme.secondary, color: theme.secondary }}>
                    Donate Today
                 </button>
              </div>
              <div className="pt-8 w-full flex items-center gap-4">
                 <div className="flex-1 h-32 rounded-xl flex items-center justify-center border shadow-sm transition-colors duration-1000" style={{ backgroundColor: theme.surface, borderColor: theme.primaryDeep }}>
                    <p style={{ color: theme.textMain }} className="font-semibold text-sm">Surface Example 1</p>
                 </div>
                 <div className="flex-1 h-32 rounded-xl flex items-center justify-center border shadow-sm transition-colors duration-1000" style={{ backgroundColor: theme.surface, borderColor: theme.accent }}>
                    <p style={{ color: theme.textMain }} className="font-semibold text-sm">Surface Example 2</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
