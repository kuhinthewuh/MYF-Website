'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Link as LinkIcon } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminPrivacyPolicy() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/content?id=privacy-policy')
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.text) {
          setContent(json.data.text);
        }
      })
      .catch(e => {
        console.error('Failed to load privacy policy:', e);
        setError('Failed to load current content.');
      })
      .finally(() => setIsLoaded(true));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'privacy-policy',
          data: { text: content }
        })
      });

      if (!res.ok) {
        throw new Error('Failed to save changes');
      }

    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex bg-[#0d1117] h-screen overflow-hidden text-white">
        <AdminSidebar activeSection={"privacy-policy" as any} />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00B4CC]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-[#0d1117] h-screen overflow-hidden text-white">
      <AdminSidebar activeSection={"privacy-policy" as any} />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-[#0d1117]/90 backdrop-blur-xl border-b border-white/8 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg font-sans leading-tight">Website Manager</h1>
            <p className="text-white/30 text-xs font-sans">Global Setup</p>
          </div>
        </header>

        <div className="p-8 max-w-4xl pb-32">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-white">Privacy Policy Content</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Update the legal text displayed on the public privacy policy page.
                </p>
              </div>
        
        <div className="flex gap-3">
          <a
            href="/privacy-policy"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-myf-charcoal"
          >
            <LinkIcon className="w-4 h-4" />
            View Public Page
          </a>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00B4CC] hover:bg-[#0092a6] text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-[#161b22] rounded-xl shadow-sm border border-white/10 p-6">
        <label className="block text-sm font-bold text-white mb-4">
          Policy Text (HTML supported)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={25}
          className="w-full p-4 border border-white/10 rounded-xl bg-[#0d1117] text-gray-300 focus:border-[#00B4CC] focus:ring-1 focus:ring-[#00B4CC] outline-none transition-all resize-y font-mono text-sm leading-relaxed"
          placeholder="<h1>Privacy Policy</h1>&#10;<p>Your text here...</p>"
        />
        <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
          Hint: You can use HTML tags like &lt;h1&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;b&gt;, &lt;ul&gt;, and &lt;li&gt; here for rich formatting.
        </p>
      </div>
          </div>
        </div>
      </main>
    </div>
  );
}
