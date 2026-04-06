"use client";

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const DEFAULT_IMAGE = "/images/events/current-event-placeholder.png";
const DEFAULT_LINK = "#";
const DEFAULT_HEADER = "Current Events";
const DEFAULT_COLOR = "#1E3354";

function detectAspectRatio(url: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
    img.onerror = () => resolve(1);
    img.src = url;
  });
}

function aspectToPaddingTop(ratio: number): string {
  const pct = (1 / ratio) * 100;
  const clamped = Math.min(140, Math.max(50, pct));
  return `${clamped.toFixed(1)}%`;
}

export default function CurrentEvents({ initialData }: { initialData?: any }) {
  const [imagePath, setImagePath] = useState(DEFAULT_IMAGE);
  const [registrationLink, setRegistrationLink] = useState(DEFAULT_LINK);
  const [headerText, setHeaderText] = useState(DEFAULT_HEADER);
  const [headerColor, setHeaderColor] = useState(DEFAULT_COLOR);
  const [paddingTop, setPaddingTop] = useState('100%');

  useEffect(() => {
    if (initialData?.imagePath) setImagePath(initialData.imagePath);
    if (initialData?.registrationLink) setRegistrationLink(initialData.registrationLink);
    if (initialData?.headerText) setHeaderText(initialData.headerText);
    if (initialData?.headerColor) setHeaderColor(initialData.headerColor);
  }, [initialData]);

  useEffect(() => {
    detectAspectRatio(imagePath).then((ratio) => {
      setPaddingTop(aspectToPaddingTop(ratio));
    });
  }, [imagePath]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border border-myf-soft/20 h-full"
    >
      {/* Dynamic Header */}
      <div className="flex items-center justify-between mb-8">
        <h3
          className="text-3xl md:text-3xl font-heading font-bold tracking-tight"
          style={{ color: headerColor }}
        >
          {headerText}
        </h3>
        <div className="w-12 h-1 bg-myf-gold rounded-full" />
      </div>

      {/* Adaptive Flyer Slot */}
      <div
        className="relative w-full mb-8 bg-[#F1F5F9] rounded-2xl overflow-hidden group transition-all duration-700"
        style={{ paddingTop, minHeight: '200px' }}
      >
        <Image
          src={imagePath}
          alt="Current Event Flyer"
          fill
          unoptimized
          className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 flex items-center justify-center -z-10 text-myf-muted/40 font-sans text-2xl font-bold">
          Event Flyer
        </div>
      </div>

      {/* Register Button */}
      <a
        href={registrationLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto group flex items-center justify-center gap-2 w-full bg-[#1EA1F2] text-white py-4 rounded-xl font-bold text-base transition-all duration-300 hover:bg-myf-deep hover:shadow-lg"
      >
        Register Now!
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </a>
    </motion.div>
  );
}
