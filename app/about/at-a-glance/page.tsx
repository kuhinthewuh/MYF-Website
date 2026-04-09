import { createServerSupabaseClient } from '@/lib/supabase-server';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, Music } from 'lucide-react';
import { Suspense } from 'react';

// --- DATA FETCHING ---
async function getGlanceData() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'about-glance')
    .single();

  return data?.data || {
    carouselImages: [],
    beliefsTitle: 'What We Believe',
    beliefsIconName: 'star',
    beliefsText: 'Empowering youth through scholarships, fostering community service, and building future leaders.',
    missionTitle: 'Our Mission',
    missionText: 'To provide educational opportunities and personal growth experiences for the youth of Manteca.',
    missionImage: '',
    programs: [
      { title: 'Scholarship Competition', description: 'Annual scholarship program for youth.', iconName: 'star', buttonLink: '/competition/contestant' },
      { title: 'Community Service', description: 'Giving back to our local community.', iconName: 'users', buttonLink: '/service-team/join' },
      { title: 'Entertainment Division', description: 'Showcasing local talent.', iconName: 'music', buttonLink: '#' },
    ]
  };
}

// Map string icon names to Lucide components
const ICONS: Record<string, React.ElementType> = {
  star: Star,
  users: Users,
  music: Music,
};

// Rich text helper to parse `[Text](URL)` into `<a>` tags and apply whitespace/alignment
function RichText({ text, align = 'left' }: { text: string, align?: 'left' | 'center' | 'right' }) {
  if (!text) return null;

  // Use Tailwind class to control multi-line text alignment securely
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return (
    <div className={`whitespace-pre-wrap ${alignClass}`}>
      {text.split('\n').map((line, i) => {
        const parts = line.split(/(\[[^\]]+\]\([^)]+\))/g);
        return (
          <span key={i}>
            {parts.map((part, j) => {
              const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
              if (match) {
                return (
                  <a key={j} href={match[2]} className="text-myf-teal hover:text-myf-deep underline font-semibold transition-colors font-sans" target="_blank" rel="noopener noreferrer">
                    {match[1]}
                  </a>
                );
              }
              return <span key={j}>{part}</span>;
            })}
            {i < text.split('\n').length - 1 && <br />}
          </span>
        );
      })}
    </div>
  );
}

// --- COMPONENTS ---
export default async function AboutAtAGlance() {
  const data = await getGlanceData();
  const BeliefsIcon = ICONS[data.beliefsIconName] || Star;

  return (
    <main className="min-h-screen bg-myf-bg pb-24 pt-8 md:pt-12 font-sans">

      {/* 1. TOP HERO: Full-width edge-to-edge carousel */}
      <section className="relative w-full h-[50vh] md:h-[65vh] bg-myf-charcoal overflow-hidden group">
        {data.carouselImages && data.carouselImages.length > 0 ? (
          <div className="absolute inset-0 flex w-[400%] animate-[slide_30s_linear_infinite] hover:[animation-play-state:paused] transition-all duration-500">
            {[...data.carouselImages, ...data.carouselImages].map((img: string, i: number) => (
              <div key={i} className="relative w-1/4 h-full shrink-0 flex-none border-r-4 border-myf-bg">
                <Image src={img} alt={`Carousel ${i}`} fill className="object-cover object-top" unoptimized priority={i < 2} />
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Carousel images pending upload</p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-myf-bg to-transparent pointer-events-none" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mt-12">

        {/* 2. MIDDLE SECTION: What We Believe (Horizontal Space) */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-16 border border-gray-100">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl bg-myf-teal/10 flex items-center justify-center mb-6">
              <BeliefsIcon className="w-10 h-10 text-myf-teal" />
            </div>
            <h2 className="text-3xl font-heading font-semibold text-myf-charcoal max-w-[200px]">
              {data.beliefsTitle}
            </h2>
            <div className="w-10 h-1.5 bg-myf-teal rounded-full mt-4 mx-auto md:mx-0" />
          </div>
          <div className="text-xl md:text-2xl leading-relaxed text-myf-muted font-light w-full">
            <RichText text={data.beliefsText} align={data.beliefsAlign} />
          </div>
        </section>

        {/* 3. MIDDLE SECTION: Our Mission (Horizontal Space with Image) */}
        <section className="bg-myf-charcoal rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-myf-gold/10 blur-3xl rounded-full" />

          <div className="flex-1 space-y-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-myf-gold flex flex-col gap-4">
              {data.missionTitle}
              <span className="w-16 h-1.5 bg-myf-gold rounded-full" />
            </h2>
            <div className="text-lg md:text-xl leading-relaxed text-white/90">
              <RichText text={data.missionText} align={data.missionAlign} />
            </div>
          </div>

          {data.missionImage ? (
            <div className="w-full md:w-[400px] h-[300px] flex-shrink-0 relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 z-10">
              <Image src={data.missionImage} alt="Mission" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-full md:w-[400px] h-[300px] flex-shrink-0 relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex flex-col items-center justify-center z-10">
              <p className="text-white/40 text-sm">Mission Image Pending</p>
            </div>
          )}
        </section>

        {/* 4. BOTTOM SECTION: Programs Grid */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-myf-charcoal mb-6">Our Core Divisions</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {data.programs && data.programs.map((prog: any, i: number) => {
              const IconComponent = ICONS[prog.iconName] || Star;

              return (
                <div key={i} className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col border border-gray-100 min-h-full">
                  <div className="w-16 h-16 rounded-2xl bg-myf-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-myf-teal" />
                  </div>

                  <h3 className="text-2xl font-bold text-myf-charcoal mb-4 shrink-0">{prog.title}</h3>
                  <div className="text-myf-muted mb-6 flex-1 leading-relaxed text-base break-words">
                    <RichText text={prog.description} align={prog.align} />

                    {prog.customLinks && prog.customLinks.length > 0 && (
                      <div className={`mt-4 space-y-2 flex flex-col ${prog.align === 'center' ? 'items-center' : prog.align === 'right' ? 'items-end' : 'items-start'}`}>
                        {prog.customLinks.map((link: any, lIdx: number) => (
                          <Link
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-myf-teal hover:text-myf-deep font-semibold transition-all hover:translate-x-1 group/link"
                          >
                            <span className="border-b border-transparent group-hover/link:border-myf-deep">{link.displayText}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -translate-y-px">
                              <path d="M5 19L19 5M19 5V15M19 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href={prog.buttonLink || '#'}
                    className="inline-flex shrink-0 mt-auto items-center justify-center w-full py-4 px-6 bg-myf-teal hover:bg-myf-deep text-white rounded-xl font-bold tracking-wide transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* Tailwind Keyframes generated internally via arbitrary values above, but defining slide explicitly for safety */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </main>
  );
}
