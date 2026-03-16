"use client";

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CurrentEvents() {
  // =========================================================================
  // UPDATE INSTRUCTIONS FOR FUTURE MAINTAINERS:
  // 1. Image: Add your new flyer image to the `public/images/events/` folder.
  //    Update `EVENT_IMAGE_PATH` to match the new file name.
  // 2. Link: Update `REGISTRATION_LINK` to your new Google Form or sign-up link.
  // =========================================================================
  const EVENT_IMAGE_PATH = "/images/events/current-event-placeholder.png";
  const REGISTRATION_LINK = "#"; // TODO: Replace with actual sign up link

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border border-myf-soft/20 h-full"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl md:text-4xl font-heading font-semibold text-myf-deep tracking-tight">Current Events</h3>
        <div className="w-12 h-1 bg-myf-gold rounded-full" />
      </div>

      <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-square bg-myf-bg rounded-2xl overflow-hidden mb-8 group">
        <Image 
          src={EVENT_IMAGE_PATH}
          alt="Current Event Flyer"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Placeholder Fallback if image not found during dev */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-myf-soft/10 text-myf-muted font-sans text-sm p-4 text-center">
          Event Flyer Image
        </div>
      </div>

      <a 
        href={REGISTRATION_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto group flex items-center justify-center gap-2 w-full bg-myf-blue text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-myf-deep hover:shadow-lg"
      >
        Register Now!
        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </a>
    </motion.div>
  );
}
