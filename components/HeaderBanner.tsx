"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const DEFAULT_IMAGE = "/images/headers/2026-banner.png";

export default function HeaderBanner() {
  const [imagePath, setImagePath] = useState(DEFAULT_IMAGE);

  useEffect(() => {
    fetch('/api/admin/content?section=hero')
      .then((r) => r.json())
      .then(({ data }) => {
        if (data?.imagePath) setImagePath(data.imagePath);
      })
      .catch(() => { });
  }, []);

  return (
    <section className="relative w-full bg-myf-bg pb-8 md:pb-12 overflow-hidden flex flex-col justify-center">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-myf-teal/10 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[800px] h-[800px] bg-myf-coral/10 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-myf-gold/5 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />

      {/* Subtle Star Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 flex items-center justify-center translate-y-24">
        <Star className="text-myf-charcoal w-full h-full scale-[2.5]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-center">

        {/* Entrance Animation for the Banner Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[1400px] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] mx-auto mb-6 md:mb-10"
        >
          <Image
            src={imagePath}
            alt="Manteca Youth Focus Title Holders and Banner"
            fill
            priority
            sizes="100vw"
            className="object-contain drop-shadow-2xl"
            unoptimized
          />
        </motion.div>

        {/* Integrated Mission Statement */}
        <div className="flex flex-col items-center text-center max-w-5xl">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-myf-teal font-semibold text-sm md:text-base uppercase tracking-[0.25em] mb-4"
          >
            It is our mission...
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-heading font-medium text-3xl md:text-5xl lg:text-6xl text-myf-charcoal leading-tight md:leading-tight lg:leading-tight tracking-tight mb-8"
          >
            to develop young leaders in the pursuit of higher education, personal talents, and community service.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-sans text-xl md:text-2xl text-myf-muted max-w-3xl leading-relaxed mb-10"
          >
            These invaluable life skills help us become the finest generation, building the foundation for a brighter tomorrow.
          </motion.p>

          {/* Integrated Glassmorphism Motto Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <p className="font-heading text-myf-coral font-semibold uppercase tracking-[0.2em] text-sm mb-4">Our Motto</p>
            <div className="bg-white/60 backdrop-blur-md border border-white/40 px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group">
              {/* Subtle inner glow for the motto box */}
              <div className="absolute inset-0 bg-gradient-to-r from-myf-teal/10 via-myf-gold/10 to-myf-coral/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <h4 className="font-heading text-3xl md:text-4xl lg:text-5xl text-myf-goldDeep font-extrabold italic tracking-tight relative z-10 select-none flex items-center gap-3">
                "Reaching for the Stars" <Star className="inline w-8 h-8 md:w-10 md:h-10 text-myf-gold fill-myf-gold/30 group-hover:fill-myf-gold transition-colors duration-500" />
              </h4>
            </div>
            <p className="font-sans text-lg text-myf-muted mt-8 max-w-2xl leading-relaxed">
              is the philosophy instilled in all young individuals. In pursuit of these stars, our accomplishments serve as stepping stones towards new goals.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
