'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AlumniImage {
  id: string;
  url: string;
  caption: string;
}

export default function RetroCarousel({ images }: { images: AlumniImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mt-12 mb-24 px-4">
      
      {/* Sleek Modern Photo Frame */}
      <div className="relative z-10 bg-white p-2 md:p-3 shadow-2xl rounded-2xl mx-auto border border-black/5 transform origin-bottom transition-all duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ duration: 0.4 }}
            className="w-full relative bg-black rounded-xl overflow-hidden shadow-inner"
            style={{ aspectRatio: '16/9' }}
          >
            <img 
              src={images[currentIndex].url} 
              alt={images[currentIndex].caption || 'Alumni memory'} 
              className="absolute inset-0 w-full h-full object-contain md:object-cover bg-black"
            />
          </motion.div>
        </AnimatePresence>

        {images[currentIndex].caption ? (
          <div className="w-full text-center px-4 pt-4 pb-2">
             <AnimatePresence mode="wait">
                <motion.p
                  key={currentIndex}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-sans text-base md:text-lg text-gray-800 font-medium"
                >
                  {images[currentIndex].caption}
                </motion.p>
             </AnimatePresence>
          </div>
        ) : null}
      </div>

      {/* Controls */}
      {images.length > 1 && (
        <div className="absolute top-1/2 -mt-6 -left-4 -right-4 md:-left-12 md:-right-12 flex justify-between z-20 pointer-events-none">
          <button 
            onClick={handlePrev}
            className="pointer-events-auto p-3 md:p-4 bg-white/90 backdrop-blur rounded-full shadow-lg text-myf-charcoal hover:bg-myf-teal hover:text-white transition-all transform hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext}
            className="pointer-events-auto p-3 md:p-4 bg-white/90 backdrop-blur rounded-full shadow-lg text-myf-charcoal hover:bg-myf-teal hover:text-white transition-all transform hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Pagination dots below */}
      {images.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
           {images.map((_, idx) => (
             <button
               key={idx}
               onClick={() => setCurrentIndex(idx)}
               className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-myf-teal scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
             />
           ))}
        </div>
      )}

    </div>
  );
}
