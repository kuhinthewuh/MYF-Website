'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
  Image as ImageIcon,
  Calendar,
  GalleryHorizontalEnd,
  Award,
  LogOut,
  ExternalLink,
  Star,
  ChevronDown,
  Info,
  History,
  Users,
  UserPlus,
  FileText,
  BookOpen,
  Scale,
  HandCoins,
  HeartHandshake,
  Building2,
  Phone,
  GraduationCap,
  Globe
} from 'lucide-react';

export type Section = 
  // Original Main Page
  | 'hero' | 'events' | 'gallery' | 'programs'
  // About Us
  | 'about-glance' | 'about-history' | 'about-board'
  // Scholarship
  | 'competition-contestant' | 'competition-forms' | 'competition-handbook' | 'competition-judging' | 'competition-request'
  // Service Team
  | 'service-join'
  // Sponsor & Donate
  | 'sponsor' | 'donate'
  // Contact
  | 'contact-reach' | 'contact-alumni'
  // Global Setup
  | 'global-footer';

type NavCategory = {
  title: string;
  items: { id: Section; label: string; icon: React.ElementType }[];
};

const NAV_GROUPS: NavCategory[] = [
  {
    title: 'Home Page',
    items: [
      { id: 'hero', label: 'Hero Header', icon: ImageIcon },
      { id: 'events', label: 'Current Events', icon: Calendar },
      { id: 'gallery', label: 'Photo Gallery', icon: GalleryHorizontalEnd },
      { id: 'programs', label: 'Our Programs', icon: Award },
    ]
  },
  {
    title: 'About Us',
    items: [
      { id: 'about-glance', label: 'MYF At a Glance', icon: Info },
      { id: 'about-history', label: 'History of Excellence', icon: History },
      { id: 'about-board', label: 'Board of Directors', icon: Users },
    ]
  },
  {
    title: 'Scholarship Competition',
    items: [
      { id: 'competition-contestant', label: 'Become A Contestant', icon: UserPlus },
      { id: 'competition-forms', label: 'Contestant Forms', icon: FileText },
      { id: 'competition-handbook', label: 'Contestant Handbook', icon: BookOpen },
      { id: 'competition-judging', label: 'Judging Criteria', icon: Scale },
      { id: 'competition-request', label: 'Request Scholarship', icon: HandCoins },
    ]
  },
  {
    title: 'Student Service Team',
    items: [
      { id: 'service-join', label: 'Join Service Team', icon: HeartHandshake },
    ]
  },
  {
    title: 'Get Involved',
    items: [
      { id: 'sponsor', label: 'Become A Sponsor', icon: Building2 },
      { id: 'donate', label: 'Donate', icon: HandCoins },
    ]
  },
  {
    title: 'Contact Us',
    items: [
      { id: 'contact-reach', label: 'Reach Out', icon: Phone },
      { id: 'contact-alumni', label: 'Alumni Corner', icon: GraduationCap },
    ]
  },
  {
    title: 'Global Setup',
    items: [
      { id: 'global-footer', label: 'Global Footer', icon: Globe },
    ]
  }
];

interface AdminSidebarProps {
  activeSection: Section;
  onSectionChange: (s: Section) => void;
}

export default function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const router = useRouter();
  // Keep track of which categories are expanded. Start with Home Page open.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Home Page': true
  });

  function toggleGroup(title: string) {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin-portal/login');
    router.refresh();
  }

  return (
    <aside className="w-72 min-h-screen bg-[#0a0f1a] border-r border-white/8 flex flex-col">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00B4CC] via-[#C8962E] to-[#E8734A] rounded-xl flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-white fill-white/30" />
          </div>
          <div>
            <p className="text-white font-bold text-sm font-sans leading-tight">MYF Admin</p>
            <p className="text-white/35 text-xs font-sans">Director Portal</p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Groups */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {NAV_GROUPS.map((group) => {
          const isOpen = openGroups[group.title];
          const hasActiveItem = group.items.some(i => i.id === activeSection);
          
          return (
            <div key={group.title} className="space-y-1">
              <button 
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-2 py-2 text-white/40 hover:text-white/70 transition-colors group/btn"
              >
                <span className={`text-[11px] font-bold uppercase tracking-widest font-sans ${hasActiveItem && !isOpen ? 'text-[#00B4CC]' : ''}`}>
                  {group.title}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                {group.items.map(({ id, label, icon: Icon }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => onSectionChange(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                        isActive
                          ? 'bg-[#00B4CC]/15 border border-[#00B4CC]/20 text-white'
                          : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                        isActive ? 'bg-[#00B4CC]/20' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00B4CC]' : 'text-white/40 group-hover:text-white/70'}`} />
                      </div>
                      <p className="text-sm font-semibold font-sans leading-tight flex-1 truncate">{label}</p>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00B4CC]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/8 space-y-2 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all">
            <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/70" />
          </div>
          <span className="text-sm font-semibold font-sans">View Live Site</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-red-500/10 flex items-center justify-center transition-all">
            <LogOut className="w-4 h-4 text-white/40 group-hover:text-red-400" />
          </div>
          <span className="text-sm font-semibold font-sans">Logout</span>
        </button>
      </div>
    </aside>
  );
}
