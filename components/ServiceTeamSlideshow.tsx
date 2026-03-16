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
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-3xl md:text-4xl font-heading font-semibold text-white tracking-tight">Service Team</h3>
           <p className="text-myf-soft text-sm mt-2 font-sans tracking-wide">Volunteer With Us</p>
        </div>
        <div className="w-12 h-1 bg-myf-soft rounded-full" />
      </div>

      <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-square bg-[#0a1828] rounded-2xl overflow-hidden mb-8 group">
        <AnimatePresence mode='wait'>
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
            {/* Placeholder Fallback */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 text-white/20 font-sans text-sm p-4 text-center">
              Service Team Image {currentIndex + 1}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-20">
          {SLIDESHOW_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-myf-gold w-4' : 'bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>
      </div>

      <a 
        href={REGISTRATION_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto group flex items-center justify-center gap-2 w-full bg-white text-myf-deep py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-myf-soft hover:text-white hover:shadow-[0_0_20px_rgba(141,198,223,0.3)]"
      >
        Register Now!
        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </a>
    </motion.div>
  );
}
