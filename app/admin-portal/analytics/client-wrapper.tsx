'use client';
import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AnalyticsClientWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex bg-[#0d1117] h-screen overflow-hidden text-white relative">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <AdminSidebar activeSection="analytics" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex md:hidden sticky top-0 z-20 bg-[#0d1117] border-b border-white/8 px-4 py-3 items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="text-white/70 hover:text-white p-1">
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-white font-bold text-base font-sans">Admin Portal</span>
            </div>
          </div>
          {children}
      </main>
    </div>
  );
}
