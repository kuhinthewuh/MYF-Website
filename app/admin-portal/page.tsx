'use client';

import { useState } from 'react';
import AdminSidebar, { Section } from './components/AdminSidebar';
import HeroSection from './sections/HeroSection';
import EventsSection from './sections/EventsSection';
import GallerySection from './sections/GallerySection';
import ProgramsSection from './sections/ProgramsSection';
import AboutGlanceSection from './sections/AboutGlanceSection';
import AboutHistorySection from './sections/AboutHistorySection';
import AboutBoardSection from './sections/AboutBoardSection';
import ContestantSection from './sections/ContestantSection';
import ContestantFormsSection from './sections/ContestantFormsSection';
import ContestantHandbookSection from './sections/ContestantHandbookSection';
import JudgingCriteriaSection from './sections/JudgingCriteriaSection';
import RequestScholarshipSection from './sections/RequestScholarshipSection';
import ServiceJoinSection from './sections/ServiceJoinSection';
import SponsorSection from './sections/SponsorSection';
import DonateSection from './sections/DonateSection';
import ContactReachSection from './sections/ContactReachSection';
import ContactAlumniSection from './sections/ContactAlumniSection';
import GlobalFooterSection from './sections/GlobalFooterSection';
import { AdminSaveProvider, useAdminSave } from './components/AdminSaveContext';
import { Save, Loader2, Menu } from 'lucide-react';

import ThemeStudioSection from './sections/ThemeStudioSection';

// Placeholder/Stub components for the upcoming 12 sections
const PlaceholderSection = ({ title }: { title: string }) => (
  <div className="p-8 text-white/50 font-sans">
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p>Admin panel for this section is currently under construction.</p>
  </div>
);

const SECTION_COMPONENTS: Record<Section, React.ComponentType> = {
  // Originals
  'hero': HeroSection,
  'events': EventsSection,
  'gallery': GallerySection,
  'programs': ProgramsSection,
  
  // Stubs for the 12 new pages
  'about-glance': AboutGlanceSection,
  'about-history': AboutHistorySection,
  'about-board': AboutBoardSection,
  'competition-contestant': ContestantSection,
  'competition-forms': ContestantFormsSection,
  'competition-handbook': ContestantHandbookSection,
  'competition-judging': JudgingCriteriaSection,
  'competition-request': RequestScholarshipSection,
  'service-join': ServiceJoinSection,
  'sponsor': SponsorSection,
  'donate': DonateSection,
  'contact-reach': ContactReachSection,
  'contact-alumni': ContactAlumniSection,
  'global-footer': GlobalFooterSection,
  'theme-studio': ThemeStudioSection,
  // Dummies for the nextjs routes to satisfy the Record type
  'analytics': () => null,
  'privacy-policy': () => null,
};

export default function AdminDashboard() {
  return (
    <AdminSaveProvider>
      <AdminDashboardContent />
    </AdminSaveProvider>
  );
}

function AdminDashboardContent() {
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { saveAll, isSavingAll } = useAdminSave();
  
  // To avoid fetching all sections data instantly on load, we only mount sections
  // once the user clicks on them. Then they stay mounted forever, hidden via CSS.
  const [mountedSections, setMountedSections] = useState<Set<Section>>(new Set<Section>(['hero']));

  const handleSectionChange = (s: Section) => {
    setActiveSection(s);
    setMountedSections(prev => {
      const next = new Set<Section>(prev);
      next.add(s);
      return next;
    });
  };

  return (
    <div className="flex bg-[#0d1117] h-screen overflow-hidden relative">
      {/* Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex md:hidden sticky top-0 z-20 bg-[#0d1117] border-b border-white/8 px-4 py-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-white/70 hover:text-white p-1"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-white font-bold text-base font-sans">Admin Portal</span>
          </div>
          <button
            onClick={saveAll}
            disabled={isSavingAll}
            className="flex items-center gap-2 px-3 py-1.5 bg-myf-teal hover:bg-myf-tealDeep text-white text-xs font-bold rounded-lg shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSavingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>

        {/* Desktop Top Bar */}
        <header className="hidden md:flex sticky top-0 z-20 bg-[#0d1117]/90 backdrop-blur-xl border-b border-white/8 px-8 py-4 items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg font-sans leading-tight">Website Manager</h1>
            <p className="text-white/30 text-xs font-sans">Changes publish instantly to the live site</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={saveAll}
              disabled={isSavingAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-myf-teal hover:bg-myf-tealDeep text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSavingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSavingAll ? 'Saving All...' : 'Save All Changes'}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold font-sans">Live</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-5xl pb-32">
          {Object.entries(SECTION_COMPONENTS).map(([id, Component]) => {
            if (!mountedSections.has(id as Section)) return null;
            return (
              <div key={id} style={{ display: activeSection === id ? 'block' : 'none' }}>
                <Component />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
