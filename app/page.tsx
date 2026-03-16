"use client";

import HeaderBanner from '@/components/HeaderBanner';
import CurrentEvents from '@/components/CurrentEvents';
import ServiceTeamSlideshow from '@/components/ServiceTeamSlideshow';
import { ArrowUpRight, GraduationCap, HeartHandshake, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-myf-bg overflow-x-hidden selection:bg-myf-blue selection:text-white">
      {/* SECTION 1 - HERO EXPERIENCE */}
      <HeaderBanner />

      {/* SECTION 2 - MISSION STATEMENT */}
      <section className="relative z-30 py-16 px-6 md:px-12 lg:px-24 mx-auto max-w-7xl flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-5 translate-y-8">
            <Star className="w-[600px] h-[600px] text-myf-blue" />
        </div>
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="font-heading text-myf-soft tracking-[0.2em] font-semibold text-sm md:text-base uppercase mb-6 mt-8"
        >
          It is our mission...
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-heading text-3xl md:text-4xl lg:text-5xl text-myf-deep leading-tight md:leading-tight lg:leading-tight max-w-4xl tracking-tight mb-8 relative z-10"
        >
          to develop young leaders in the pursuit of higher education, development of personal talents, and service throughout the community.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-sans text-xl text-myf-text/80 max-w-3xl leading-relaxed mb-12 relative z-10"
        >
          These invaluable life skills help us to become the finest generation in hopes of a brighter tomorrow.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col items-center relative z-10"
        >
          <p className="font-heading text-myf-muted mb-3 uppercase tracking-[0.2em] text-sm md:text-sm">Our Motto</p>
          <div className="bg-white/50 backdrop-blur-sm border border-myf-soft/20 px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-500">
            <h4 className="font-heading text-2xl md:text-3xl text-myf-gold font-bold italic tracking-tight">
              “Reaching for the Stars”
            </h4>
          </div>
          <p className="font-sans text-base text-myf-text/70 mt-6 max-w-2xl leading-relaxed">
            is the philosophy we instill in all young individuals. In pursuit of these “stars” our past accomplishments serve as stepping stones towards new, more challenging goals.
          </p>
        </motion.div>
      </section>

      {/* SECTION 3 - CURRENT EVENTS & SERVICE TEAM */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <CurrentEvents />
            <ServiceTeamSlideshow />
          </div>
        </div>
      </section>

      {/* SECTION 4 - OUR PROGRAMS */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-myf-bg relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between"
          >
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-myf-deep tracking-tight mb-4 text-center mx-auto md:text-left md:mx-0">Our Programs</h2>
              <div className="w-24 h-1 bg-myf-gold rounded-full mx-auto md:mx-0" />
            </div>
            {/* Adding the optional sub-text for flavor */}
            <p className="text-myf-muted text-lg max-w-lg mt-6 md:mt-0 md:text-right hidden md:block">
              Discover opportunities for youth to excel, serve the community, and stay connected with our legacy.
            </p>
          </motion.div>

          {/* =========================================================================
              UPDATE INSTRUCTIONS FOR FUTURE MAINTAINERS:
              The links below for "I'm interested", "Join Here", and "Connect With Us"
              are currently set to "#". Update the `href` attribute in the `<a>` tags 
              within each card to redirect users to your actual Google Forms/sign up pages.
              ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Program 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-myf-soft/20 flex flex-col items-center text-center h-full group"
            >
              <div className="w-16 h-16 bg-myf-bg rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-myf-blue" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-myf-deep mb-4">Scholarship Competition Division</h3>
              <p className="text-myf-muted font-sans text-sm font-bold mb-4 text-myf-gold uppercase tracking-wider">Open to boys & girls ages 10-20<br/><span className="text-xs tracking-normal font-normal opacity-80">(as of June 1st)</span></p>
              <p className="text-myf-text/80 mb-8 leading-relaxed flex-grow text-base px-2">Every participant earns a scholarship & receives training in resume-writing, public speaking, interview and volunteer service.</p>
              {/* TODO: Replace `#` with actual sign up link */}
              <a href="#" className="w-full bg-myf-deep text-white py-4 rounded-xl font-bold hover:bg-myf-blue hover:-translate-y-1 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                I'm interested <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Program 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-myf-soft/20 flex flex-col items-center text-center h-full group"
            >
              <div className="w-16 h-16 bg-myf-bg rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-8 h-8 text-myf-blue" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-myf-deep mb-4">Community Service</h3>
              <p className="text-myf-muted font-sans text-sm font-bold mb-4 text-myf-gold uppercase tracking-wider">Open to boys & girls ages 9-21</p>
              <p className="text-myf-text/80 mb-8 leading-relaxed flex-grow text-base px-2">The Student Service Team is a new program created in 2023 by our Community Service Division. You will have the opportunity to volunteer alongside other youth in our community at various events and assist numerous charitable causes.</p>
              {/* TODO: Replace `#` with actual sign up link */}
              <a href="#" className="w-full bg-myf-deep text-white py-4 rounded-xl font-bold hover:bg-myf-blue hover:-translate-y-1 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                Join Here <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Program 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-myf-soft/20 flex flex-col items-center text-center h-full group"
            >
              <div className="w-16 h-16 bg-myf-bg rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-myf-blue" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-myf-deep mb-4">Calling All Alumni</h3>
              <p className="text-myf-muted font-sans text-sm font-bold mb-4 text-myf-gold uppercase tracking-wider">Stay Connected</p>
              <p className="text-myf-text/80 mb-8 leading-relaxed flex-grow text-base px-2">We want to reconnect and hear from you. Please take a few moments to complete our alumni survey below. Your feedback helps us enhance our programs and strengthen our community.</p>
              {/* TODO: Replace `#` with actual sign up link */}
              <a href="#" className="w-full bg-myf-deep text-white py-4 rounded-xl font-bold hover:bg-myf-blue hover:-translate-y-1 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                Connect With Us <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-myf-text text-white py-12 px-6 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 text-sm font-sans">
          <p>&copy; {new Date().getFullYear()} Manteca Youth Focus. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-myf-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-myf-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
