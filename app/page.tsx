"use client";

import HeaderBanner from '@/components/HeaderBanner';
import CurrentEvents from '@/components/CurrentEvents';
import ContestantWidget from '@/components/ContestantWidget';
import ActionGallery from '@/components/ActionGallery';
import { ArrowUpRight, GraduationCap, HeartHandshake, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProgramLinks {
  scholarship: string;
  communityService: string;
  alumni: string;
}

const DEFAULT_LINKS: ProgramLinks = {
  scholarship: '#',
  communityService: '#',
  alumni: '#',
};

export default function Home() {
  const [programLinks, setProgramLinks] = useState<ProgramLinks>(DEFAULT_LINKS);

  useEffect(() => {
    fetch('/api/admin/content?section=programs')
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) setProgramLinks({ ...DEFAULT_LINKS, ...data });
      })
      .catch(() => { });
  }, []);

  return (
    <main className="min-h-screen bg-myf-bg overflow-x-hidden selection:bg-myf-blue selection:text-white">
      {/* SECTION 1 - HERO EXPERIENCE */}
      <HeaderBanner />

      {/* SECTION 3 - CURRENT EVENTS & CONTESTANT WIDGET */}
      <section className="py-12 md:py-16 px-6 md:px-12 lg:px-24 bg-myf-bg relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 flex flex-col items-center text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-myf-charcoal tracking-tight mb-4">
              Upcoming Opportunities &amp; Current Events
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <CurrentEvents />
            <ContestantWidget />
          </div>
        </div>
      </section>

      {/* SECTION NEW - ACTION GALLERY RIBBON */}
      <ActionGallery />

      {/* SECTION 4 - OUR PROGRAMS */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-myf-bg relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 flex flex-col items-center text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-myf-charcoal tracking-tight mb-4">Our Programs</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mb-6" />
            <p className="text-myf-muted text-lg max-w-2xl">
              Discover opportunities for youth to excel, serve the community, and stay connected with our legacy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Program 1: Scholarship (Teal Theme) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-myf-teal flex flex-col items-center text-center h-full group"
            >
              <div className="w-20 h-20 bg-myf-teal/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-myf-teal/20 transition-all duration-300">
                <GraduationCap className="w-10 h-10 text-myf-tealDeep" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-myf-charcoal mb-4">Scholarship Competition Division</h3>
              <p className="font-sans text-sm font-bold mb-4 text-myf-charcoal uppercase tracking-wider">Open to boys &amp; girls ages 10-20<br /><span className="text-xs tracking-normal font-normal opacity-80">(as of June 1st)</span></p>
              <p className="text-myf-charcoal/80 mb-8 leading-relaxed flex-grow text-base px-2">Every participant earns a scholarship &amp; receives training in resume-writing, public speaking, interview and volunteer service.</p>
              <a href={programLinks.scholarship} className="w-full bg-myf-charcoal text-white py-4 rounded-xl font-bold hover:bg-myf-teal transition-colors flex items-center justify-center gap-2 group/btn">
                I&apos;m interested <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </a>
            </motion.div>

            {/* Program 2: Community Service (Coral Theme) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-myf-coral flex flex-col items-center text-center h-full group"
            >
              <div className="w-20 h-20 bg-myf-coral/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-myf-coral/20 transition-all duration-300">
                <HeartHandshake className="w-10 h-10 text-myf-coralDeep" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-myf-charcoal mb-4">Community Service</h3>
              <p className="text-myf-muted font-sans text-sm font-bold mb-4 text-myf-coral uppercase tracking-wider">Open to boys &amp; girls ages 9-21</p>
              <p className="text-myf-charcoal/80 mb-8 leading-relaxed flex-grow text-base px-2">The Student Service Team is a new program created in 2023 by our Community Service Division. You will have the opportunity to volunteer alongside other youth in our community at various events and assist numerous charitable causes.</p>
              <a href={programLinks.communityService} className="w-full bg-myf-charcoal text-white py-4 rounded-xl font-bold hover:bg-myf-coral transition-colors flex items-center justify-center gap-2 group/btn">
                Join Here <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </a>
            </motion.div>

            {/* Program 3: Alumni (Gold Theme) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-myf-gold flex flex-col items-center text-center h-full group"
            >
              <div className="w-20 h-20 bg-myf-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-myf-gold/20 transition-all duration-300">
                <Star className="w-10 h-10 text-myf-goldDeep fill-myf-gold/50" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-myf-charcoal mb-4">Calling All Alumni</h3>
              <p className="text-myf-muted font-sans text-sm font-bold mb-4 text-myf-gold uppercase tracking-wider">Stay Connected</p>
              <p className="text-myf-charcoal/80 mb-8 leading-relaxed flex-grow text-base px-2">We want to reconnect and hear from you. Please take a few moments to complete our alumni survey below. Your feedback helps us enhance our programs and strengthen our community.</p>
              <a href={programLinks.alumni} className="w-full bg-myf-charcoal text-white py-4 rounded-xl font-bold hover:bg-myf-gold transition-colors flex items-center justify-center gap-2 group/btn">
                Connect With Us <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-myf-charcoal text-white py-20 px-6 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-80 text-sm font-sans">
          <p className="font-medium tracking-wide">&copy; {new Date().getFullYear()} Manteca Youth Focus. All rights reserved.</p>
          <div className="flex gap-8 font-medium">
            <a href="#" className="hover:text-myf-teal transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-myf-coral transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
