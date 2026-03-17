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
};

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('hero');

  const ActiveComponent = SECTION_COMPONENTS[activeSection];

  return (
    <div className="flex bg-[#0d1117] h-screen overflow-hidden">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-[#0d1117]/90 backdrop-blur-xl border-b border-white/8 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg font-sans leading-tight">Website Manager</h1>
            <p className="text-white/30 text-xs font-sans">Changes publish instantly to the live site</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold font-sans">Live</span>
          </div>
        </header>

        {/* Section Content */}
        <div className="p-8 max-w-4xl pb-32">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
