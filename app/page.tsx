"use client";

import MedalScrollSequence from '@/components/MedalScrollSequence';
import { ArrowUpRight, GraduationCap, HeartHandshake, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-myf-bg overflow-x-hidden selection:bg-myf-blue selection:text-white">
      {/* SECTION 1 - HERO EXPERIENCE */}
      <MedalScrollSequence />

      {/* SECTION 2 - MISSION STATEMENT */}
      <section className="relative -mt-[40vh] z-30 pt-0 pb-24 px-6 md:px-12 lg:px-24 mx-auto max-w-7xl flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-5 translate-y-8">
            <Star className="w-[800px] h-[800px] text-myf-blue" />
        </div>
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="font-heading text-myf-soft tracking-[0.3em] font-semibold text-sm md:text-base uppercase mb-12"
        >
          It is our mission...
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-heading text-3xl md:text-5xl lg:text-6xl text-myf-deep leading-tight md:leading-tight lg:leading-tight max-w-5xl tracking-tight mb-16 relative z-10"
        >
          to develop young leaders in the pursuit of higher education, development of personal talents, and service throughout the community.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-sans text-xl md:text-2xl text-myf-text/80 max-w-3xl leading-relaxed mb-16 relative z-10"
        >
          These invaluable life skills help us to become the finest generation in hopes of a brighter tomorrow.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col items-center relative z-10"
        >
          <p className="font-heading text-myf-muted mb-4 uppercase tracking-[0.2em] text-sm">Our Motto</p>
          <div className="bg-white/50 backdrop-blur-sm border border-myf-soft/20 px-8 py-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(11,111,164,0.1)] transition-shadow duration-500">
            <h4 className="font-heading text-3xl md:text-4xl text-myf-gold font-bold italic tracking-tight">
              “Reaching for the Stars”
            </h4>
          </div>
          <p className="font-sans text-lg text-myf-text/70 mt-8 max-w-2xl leading-relaxed">
            is the philosophy we instill in all young individuals. In pursuit of these “stars” our past accomplishments serve as stepping stones towards new, more challenging goals.
          </p>
        </motion.div>
      </section>

      {/* SECTION 3 - WHAT WE DO */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-semibold text-myf-deep tracking-tight">Our Pillars</h2>
            <div className="w-24 h-1 bg-myf-gold mt-6 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: "Leadership Development",
                description: "Students learn responsibility, teamwork, and leadership through real-world community involvement.",
                icon: <Star className="w-8 h-8 text-myf-blue" />
              },
              {
                title: "Higher Education",
                description: "Members are encouraged to pursue academic excellence and future college opportunities.",
                icon: <GraduationCap className="w-8 h-8 text-myf-blue" />
              },
              {
                title: "Community Service",
                description: "MYF members actively give back through volunteer work and community engagement.",
                icon: <HeartHandshake className="w-8 h-8 text-myf-blue" />
              }
            ].map((pillar, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="group flex flex-col p-8 md:p-10 rounded-[2rem] bg-myf-bg hover:bg-myf-deep hover:text-white transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(11,111,164,0.15)]"
              >
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-heading font-semibold mb-4 tracking-tight group-hover:text-white">{pillar.title}</h3>
                <p className="text-lg text-myf-muted group-hover:text-white/80 leading-relaxed font-sans">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - PROGRAMS & EVENTS */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-myf-bg relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-heading font-semibold text-myf-deep tracking-tight mb-6">Programs & Events</h2>
              <p className="text-xl text-myf-muted max-w-2xl">Discover how we turn our mission into action through our core programs.</p>
            </motion.div>
            <motion.button 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-myf-blue font-semibold hover:text-myf-deep transition-colors text-lg uppercase tracking-wide group w-fit"
            >
              View All Events <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]"
          >
            <div className="relative rounded-3xl overflow-hidden group h-[400px] md:h-full bg-myf-deep cursor-pointer">
               <div className="absolute inset-0 bg-gradient-to-t from-myf-deep/90 via-myf-deep/50 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
               {/* Pattern overlay instead of missing image */}
               <div className="absolute inset-0 bg-white/5 opacity-20 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
               <div className="absolute inset-0 z-0 flex items-center justify-center scale-150 rotate-12 opacity-5">
                   <Star className="text-white w-full h-full" />
               </div>
               
               <div className="absolute bottom-0 left-0 p-8 md:p-10 z-20 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                 <div className="bg-myf-gold text-myf-deep text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4 shadow-sm">Flagship</div>
                 <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">Youth Conferences</h3>
                 <p className="text-white/80 text-lg opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 md:-translate-y-4 md:group-hover:translate-y-0 transform">Empowering youth with interactive workshops and inspiring speakers.</p>
               </div>
            </div>
            
            <div className="flex flex-col gap-6 h-[600px] md:h-full">
              <div className="relative rounded-3xl overflow-hidden group flex-1 bg-myf-soft cursor-pointer">
                 <div className="absolute inset-0 bg-gradient-to-t from-myf-deep/90 via-myf-deep/30 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-100"></div>
                 <div className="absolute bottom-0 left-0 p-8 z-20 transform transition-transform duration-500 group-hover:-translate-y-2">
                   <h3 className="text-2xl font-heading font-bold text-white mb-2">Leadership Retreats</h3>
                   <p className="text-white/80">Intensive weekend programs focused on team building and personal vision.</p>
                 </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden group flex-1 bg-myf-blue cursor-pointer">
                 <div className="absolute inset-0 bg-gradient-to-t from-myf-deep/90 via-myf-deep/30 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-100"></div>
                 <div className="absolute bottom-0 left-0 p-8 z-20 transform transition-transform duration-500 group-hover:-translate-y-2">
                   <h3 className="text-2xl font-heading font-bold text-white mb-2">Community Service</h3>
                   <p className="text-white/80">Hands-on volunteer projects making tangible impacts locally.</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 - IMPACT */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-myf-deep text-white relative overflow-hidden z-20">
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="absolute w-[800px] h-[800px] bg-white rounded-full mix-blend-overlay filter blur-[100px] -top-64 -right-64"></div>
         </div>
         <div className="max-w-7xl mx-auto relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-heading font-semibold tracking-tight mb-20 text-center text-myf-bg"
            >
              Our Legacy of Impact
            </motion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center">
              {[
                { number: "10,000+", label: "Youth Served" },
                { number: "50+", label: "Years of Service" },
                { number: "250K", label: "Volunteer Hours" },
                { number: "1,200", label: "Community Projects" }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="flex flex-col items-center justify-center space-y-4 py-4"
                >
                  <span className="text-5xl md:text-7xl font-heading font-bold text-myf-gold tracking-tighter drop-shadow-md">
                    {stat.number}
                  </span>
                  <span className="text-lg md:text-xl font-sans text-myf-bg/80 tracking-wide font-light">{stat.label}</span>
                </motion.div>
              ))}
            </div>
         </div>
      </section>

      {/* SECTION 6 - TESTIMONIALS */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
             <h2 className="text-4xl md:text-6xl font-heading font-semibold text-myf-deep tracking-tight">Voices of Leaders</h2>
             <div className="w-24 h-1 bg-myf-soft mx-auto mt-6 rounded-full" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex gap-6 overflow-x-auto pb-12 snap-x scrollbar-hide px-4 md:px-0"
          >
             {[
               { quote: "MYF helped shape who I am today. The leadership skills I learned continue to guide me in my professional career.", author: "Sarah J.", role: "Alumni, Class of 2018" },
               { quote: "Through MYF I discovered my passion for leadership and service. It gave me the confidence to aim for the stars and actually reach them.", author: "Michael T.", role: "Former Ambassador" },
               { quote: "An incredible community of supportive, ambitious peers. I found lifelong friends and invaluable mentorship.", author: "Emily R.", role: "Current Member" },
             ].map((t, idx) => (
               <div key={idx} className="min-w-[320px] md:min-w-[400px] bg-myf-bg p-10 rounded-[2rem] snap-center flex-shrink-0 border border-myf-soft/10 relative hover:shadow-xl transition-shadow duration-500 group">
                 <Star className="absolute top-8 right-8 w-8 h-8 text-myf-gold/30 group-hover:text-myf-gold transition-colors duration-500" />
                 <p className="text-xl md:text-2xl font-heading font-light text-myf-deep leading-relaxed mb-8 relative z-10 italic">
                   &quot;{t.quote}&quot;
                 </p>
                 <div>
                   <p className="font-bold text-myf-deep font-sans">{t.author}</p>
                   <p className="text-myf-muted font-sans text-sm">{t.role}</p>
                 </div>
               </div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 7 - CALL TO ACTION */}
      <section className="relative py-32 px-6 lg:py-48 overflow-hidden z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-myf-deep to-myf-blue z-0"></div>
        {/* Subtle Star Pattern Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-overlay flex flex-wrap gap-12 justify-center items-center overflow-hidden">
           {[...Array(20)].map((_, i) => (
             <Star key={i} className={`text-white ${i % 2 === 0 ? 'w-12 h-12' : 'w-24 h-24'} ${i % 3 === 0 ? 'animate-pulse' : ''}`} />
           ))}
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tight mb-8"
          >
            Join the Next Generation of Leaders
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 font-sans mb-12 max-w-2xl font-light leading-relaxed"
          >
            Take the first step towards a brighter future. Discover your potential, serve your community, and reach for the stars.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <button className="px-8 py-5 bg-white text-myf-deep rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Apply to MYF
            </button>
            <button className="px-8 py-5 bg-transparent text-white border-none sm:border-solid sm:border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
              Learn More
            </button>
            <button className="px-8 py-5 bg-transparent text-myf-gold border-2 border-myf-gold/50 rounded-full font-bold text-lg hover:bg-myf-gold/10 transition-colors hover:border-myf-gold">
              Support Our Mission
            </button>
          </motion.div>
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
