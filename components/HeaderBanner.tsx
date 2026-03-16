"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeaderBanner() {
  // =========================================================================
  // UPDATE INSTRUCTIONS FOR FUTURE MAINTAINERS:
  // To change the header image for a new year or new city title holders:
  // 1. Add your new image file to the `public/images/headers/` folder.
  // 2. Change the `HEADER_IMAGE_PATH` variable below to match your new file name.
  //    (Ensure the path starts with a forward slash '/')
  // =========================================================================
  const HEADER_IMAGE_PATH = "/images/headers/2026-banner.png";

  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full bg-white flex items-center justify-center pt-20 pb-4 md:pt-24 md:pb-8 overflow-hidden"
    >
      {/* Container for the Banner Image */}
      <div className="relative w-full max-w-[1600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[650px] mx-auto px-4 sm:px-8 md:px-12">
        <Image 
          src={HEADER_IMAGE_PATH}
          alt="Manteca Youth Focus Title Holders and Banner"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </div>
    </motion.section>
  );
}
