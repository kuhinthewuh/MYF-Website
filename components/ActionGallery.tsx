"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_IMAGES = [
  "/images/gallery/placeholder-1.png",
  "/images/gallery/placeholder-2.png",
  "/images/gallery/placeholder-3.png",
  "/images/gallery/placeholder-4.png",
];

export default function ActionGallery() {
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content?section=gallery')
      .then((r) => r.json())
      .then(({ data }) => {
        if (data?.images && data.images.length > 0) {
          setGalleryImages(data.images);
          setCurrentIndex(0);
        }
      })
      .catch(() => { });
  }, []);

  // Auto-scroll logic (4 seconds interval)
  useEffect(() => {
    if (isHovered || galleryImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, galleryImages.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  if (!galleryImages || galleryImages.length === 0) return null;

  return (
    <section className="py-2 px-6 md:px-12 lg:px-24 bg-myf-bg relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Gallery Container - 21:9 Ribbon Layout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full aspect-video md:aspect-[21/9] lg:h-[500px] bg-myf-charcoal rounded-[2rem] overflow-hidden shadow-2xl group border border-myf-deep/10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Image Layer */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={galleryImages[currentIndex]}
                alt={`Action Gallery Image ${currentIndex + 1}`}
                fill
                className="object-cover"
                unoptimized
              />

              {/* Faint Dark Overlay at bottom for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

              {/* Fallback Text if image is entirely missing */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <p className="text-white/30 text-2xl font-bold font-sans">Gallery Slide {currentIndex + 1}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Ghost Navigation Arrows (Appear on Hover) */}
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full border-2 border-white/40 text-white bg-black/20 hover:bg-black/40 hover:border-white/80 hover:scale-110 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 disabled:opacity-0"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full border-2 border-white/40 text-white bg-black/20 hover:bg-black/40 hover:border-white/80 hover:scale-110 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 disabled:opacity-0"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Clean Pagination Dots at bottom center */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`transition-all duration-300 rounded-full shadow-sm ${idx === currentIndex
                  ? 'w-8 h-2.5 bg-myf-teal'
                  : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/90'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
