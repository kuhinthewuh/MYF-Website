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
      
      {/* Decorative scattered polaroids behind */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-4 -left-12 md:-left-24 w-48 h-56 bg-white shadow-xl -rotate-12 rounded-sm" />
        <div className="absolute -bottom-8 -right-8 md:-right-16 w-56 h-64 bg-white shadow-xl rotate-6 rounded-sm" />
      </div>

      {/* Main active Polaroid */}
      <div className="relative z-10 bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm transform origin-bottom transition-all duration-500 mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, y: 10, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10, rotate: 2 }}
            transition={{ duration: 0.4 }}
            className="w-full relative bg-gray-100 border border-gray-200"
            style={{ aspectRatio: '1/1' }}
          >
            <img 
              src={images[currentIndex].url} 
              alt={images[currentIndex].caption} 
              className="absolute inset-0 w-full h-full object-cover sepia-[.2] hue-rotate-[-5deg] contrast-100 mix-blend-multiply"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 left-0 w-full text-center px-4">
           <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-marker text-lg md:text-2xl text-gray-800 tracking-wide"
                style={{ fontFamily: "'Permanent Marker', 'Brush Script MT', cursive" }}
              >
                {images[currentIndex].caption}
              </motion.p>
           </AnimatePresence>
        </div>
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
