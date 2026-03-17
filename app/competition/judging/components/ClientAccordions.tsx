'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

interface JudgingCategory {
  title: string;
  weight: string;
  description: string;
  bullets: string[];
}

export default function ClientAccordions({ categories }: { categories: JudgingCategory[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {categories.map((cat, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div 
            key={idx} 
            className={`bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 ${isOpen ? 'border-myf-teal/30 ring-1 ring-myf-teal/10' : 'border-gray-100'}`}
          >
            {/* Header / Trigger */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className={`w-full px-6 md:px-8 py-6 flex items-center justify-between transition-colors ${isOpen ? 'bg-gradient-to-r from-myf-teal/5 to-transparent' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-6">
                 {/* Weight Badge */}
                 <div className="w-14 h-14 shrink-0 rounded-2xl bg-myf-teal text-white flex flex-col items-center justify-center font-bold font-heading shadow-md">
                   <span className="text-xl leading-none">{cat.weight}</span>
                 </div>
                 <h3 className={`text-2xl font-bold font-heading text-left ${isOpen ? 'text-myf-teal' : 'text-myf-charcoal'}`}>
                   {cat.title}
                 </h3>
              </div>
              <div className={`p-3 rounded-full shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-myf-teal/10 text-myf-teal' : 'bg-gray-50 text-gray-400'}`}>
                <ChevronDown className="w-6 h-6" />
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
                  <div className="px-6 md:px-8 pb-8 pt-2">
                    <div className="pl-20 border-l border-myf-teal/20 ml-7">
                       <p className="text-lg text-myf-muted leading-relaxed mb-6">
                         {cat.description}
                       </p>
                       
                       {cat.bullets && cat.bullets.length > 0 && (
                         <ul className="space-y-3">
                           {cat.bullets.map((bullet, bIdx) => (
                             <li key={bIdx} className="flex items-start gap-3">
                               <CheckCircle2 className="w-5 h-5 text-myf-coral shrink-0 mt-0.5" />
                               <span className="text-myf-charcoal">{bullet}</span>
                             </li>
                           ))}
                         </ul>
                       )}
                    </div>
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
