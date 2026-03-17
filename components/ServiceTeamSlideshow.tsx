"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceTeamSlideshow() {
  // =========================================================================
  // UPDATE INSTRUCTIONS FOR FUTURE MAINTAINERS:
  // 1. Images: Add new pictures to `public/images/events/`. 
  //    Update the `SLIDESHOW_IMAGES` array below with the new file names. Add or remove items as needed.
  // 2. Link: Update `REGISTRATION_LINK` to your new Google Form or sign-up link.
  // =========================================================================
  const SLIDESHOW_IMAGES = [
    "/images/events/service-1-placeholder.png",
    "/images/events/service-2-placeholder.png",
    "/images/events/service-3-placeholder.png"
  ];
  const REGISTRATION_LINK = "#"; // TODO: Replace with actual sign up link

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDESHOW_IMAGES.length) % SLIDESHOW_IMAGES.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex flex-col bg-myf-deep rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-xl h-full"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-3xl md:text-3xl font-heading font-bold text-white tracking-tight">Service Team</h3>
           <p className="text-myf-soft text-xs mt-1 font-sans tracking-wide">Volunteer With Us</p>
        </div>
        <div className="w-12 h-1 bg-myf-soft/50 rounded-full" />
      </div>

      {/* Massive Central Image Carousel */}
      <div className="relative w-full flex-grow min-h-[350px] aspect-square bg-[#0a1828] rounded-2xl overflow-hidden mb-8 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image 
              src={SLIDESHOW_IMAGES[currentIndex]}
              alt={`Service Team Slide ${currentIndex + 1}`}
              fill
              className="object-cover"
            />
            {/* Fallback Text if image is missing */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 text-white/20 font-sans text-2xl font-bold p-4 text-center">
              Service Team {currentIndex + 1}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Dots matched to screenshot */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1.5 z-20">
          {SLIDESHOW_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-myf-gold w-3' : 'bg-white/50 hover:bg-white'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <a 
        href={REGISTRATION_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto group flex items-center justify-center gap-2 w-full bg-white text-myf-deep py-4 rounded-xl font-bold text-base transition-all duration-300 hover:bg-myf-soft hover:text-white"
      >
        Register Now!
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </a>
    </motion.div>
  );
}
