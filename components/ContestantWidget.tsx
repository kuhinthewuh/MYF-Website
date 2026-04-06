"use client";

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const DEFAULT_IMAGE = "/images/events/current-event-placeholder.png";
const DEFAULT_LINK = "#";
const DEFAULT_HEADER = "Become a Contestant";
const DEFAULT_COLOR = "#1a2b3c";
// Extracted complex calculations in favor of native intrinsic layout.

export default function ContestantWidget({ initialData }: { initialData?: any }) {
  const [imagePath, setImagePath] = useState(DEFAULT_IMAGE);
  const [registrationLink, setRegistrationLink] = useState(DEFAULT_LINK);
  const [headerText, setHeaderText] = useState(DEFAULT_HEADER);
  const [headerColor, setHeaderColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    if (initialData?.imagePath) setImagePath(initialData.imagePath);
    if (initialData?.registrationLink) setRegistrationLink(initialData.registrationLink);
    if (initialData?.headerText) setHeaderText(initialData.headerText);
    if (initialData?.headerColor) setHeaderColor(initialData.headerColor);
  }, [initialData]);

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
      <div className="flex-1 flex flex-col justify-center w-full mb-8">
        <div className="relative w-full rounded-2xl overflow-hidden group transition-all duration-700 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePath}
            alt="Become a Contestant Flyer"
            className="w-full h-auto rounded-2xl transition-transform duration-700 group-hover:scale-[1.02]"
          />
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
