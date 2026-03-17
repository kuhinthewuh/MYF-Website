'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DivisionState {
  name: string;
  winnersText: string;
}

interface CategoryState {
  title: string;
  accentColor: string;
  divisions: DivisionState[];
}

const COLOR_STYLES: Record<string, { bg: string, text: string, border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
};

export default function ClientAccordions({ categories }: { categories: CategoryState[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {categories.map((cat, idx) => {
        const isOpen = openIndex === idx;
        const style = COLOR_STYLES[cat.accentColor] || COLOR_STYLES.blue;

        return (
          <div 
            key={idx} 
            className={`bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 ${isOpen ? style.border : 'border-gray-100'}`}
          >
            {/* Header / Trigger */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className={`w-full px-6 py-5 flex items-center justify-between transition-colors ${isOpen ? style.bg : 'hover:bg-gray-50'}`}
            >
              <h3 className={`text-xl font-bold font-heading ${isOpen ? style.text : 'text-myf-charcoal'}`}>
                {cat.title}
              </h3>
              <div className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 ' + style.bg : 'bg-gray-100'}`}>
                <ChevronDown className={`w-5 h-5 ${isOpen ? style.text : 'text-gray-500'}`} />
              </div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 pt-2">
                    {cat.divisions && cat.divisions.length > 0 ? (
                      <div className="space-y-8">
                        {cat.divisions.map((div, wIdx) => (
                          <div key={wIdx}>
                            <h4 className={`font-bold mb-3 pb-2 border-b uppercase tracking-wider text-sm ${style.text} ${style.border}`}>
                              {div.name}
                            </h4>
                            <ul className="text-gray-700 leading-relaxed space-y-2">
                              {div.winnersText.split('\n').map((line, lIdx) => 
                                line.trim() ? (
                                  <li key={lIdx} className="flex gap-3 items-start">
                                    <span className={`${style.text} mt-0.5`}>•</span>
                                    <span>{line}</span>
                                  </li>
                                ) : null
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic py-4 text-center">No titleholders recorded yet.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
