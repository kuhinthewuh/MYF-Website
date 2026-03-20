import { createServerSupabaseClient } from '@/lib/supabase-server';
import Image from 'next/image';
import ClientAccordions from './components/ClientAccordions';

export const dynamic = 'force-dynamic';

async function getHistoryData() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'about-history')
    .single();

  return data?.data || {
    heroTitle: 'History of Excellence',
    heroImage: '',
    categories: [
       { title: 'The City Titles', accentColor: 'blue', divisions: [] },
       { title: 'The Pumpkin Fair Titles', accentColor: 'orange', divisions: [] },
       { title: 'Watermelon Street Fair Titleholders', accentColor: 'red', divisions: [] },
       { title: 'Winter Fest Titleholders', accentColor: 'cyan', divisions: [] },
    ],
    memorialTitle: 'Breanne Wigginton Memorial Award',
    memorialText: 'Awarded to those who show exceptional dedication.',
    memorialImage: '',
    memorialWinners: ''
  };
}

export default async function HistoryPage() {
  const data = await getHistoryData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[40vh] md:h-[50vh] bg-myf-charcoal flex items-center justify-center overflow-hidden">
        {data.heroImage ? (
          <Image 
            src={data.heroImage} 
            alt="Crown and Medals Background" 
            fill 
            className="object-cover opacity-30 mix-blend-luminosity scale-105" 
            unoptimized 
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-myf-charcoal to-myf-deep" />
        )}
        
        {/* Soft elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] to-transparent opacity-90 pb-8" />
        
        <div className="relative z-10 text-center px-4 mt-16">
          <div className="inline-block p-4 bg-myf-gold/10 rounded-full mb-6 border border-myf-gold/20 backdrop-blur-sm">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-myf-gold fill-current">
                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z" />
             </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-myf-charcoal drop-shadow-sm tracking-tight">
            {data.heroTitle}
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mx-auto mt-8 opacity-80" />
        </div>
      </section>

      {/* 2. BODY CONTENT (Accordions via Client Component) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-12 relative z-20">
         <ClientAccordions categories={data.categories} />
      </section>

      {/* 3. BREANNE WIGGINTON MEMORIAL AWARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-myf-charcoal rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center gap-8 md:gap-16 text-white overflow-hidden relative border border-myf-gold/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-myf-gold/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-myf-teal/10 blur-3xl rounded-full" />
          
          <div className="relative z-10 text-center space-y-8 w-full">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-myf-gold drop-shadow-md">
              {data.memorialTitle}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-myf-gold to-myf-coral rounded-full mx-auto" />
            
            <p className={`text-lg md:text-xl leading-relaxed text-white/90 max-w-3xl mx-auto font-light whitespace-pre-wrap ${data.memorialAlign === 'center' ? 'text-center' : data.memorialAlign === 'right' ? 'text-right' : 'text-left'}`}>
              {data.memorialText?.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>

            {data.memorialImage && (
              <div className="w-full max-w-4xl mx-auto h-[300px] md:h-[400px] relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.15)] border-2 border-myf-gold/20 flex-shrink-0">
                <Image src={data.memorialImage} alt="Breanne Wigginton Memorial" fill className="object-cover" unoptimized />
              </div>
            )}
            
            <div className="pt-8">
               <h3 className="text-2xl font-bold font-heading text-white mb-6 uppercase tracking-widest text-myf-gold/80">Recipients</h3>
               <ul className="text-lg leading-relaxed space-y-3 max-w-2xl mx-auto text-left bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                  {data.memorialWinners && data.memorialWinners.split('\n').map((line: string, lIdx: number) => 
                     line.trim() ? (
                        <li key={lIdx} className="flex gap-4 items-start border-b border-white/5 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                           <span className="text-myf-gold text-xl leading-none mt-1">✦</span>
                           <span className="text-white/90">{line}</span>
                        </li>
                     ) : null
                  )}
                  {(!data.memorialWinners || data.memorialWinners.trim() === '') && (
                     <p className="text-center text-white/40 italic">No recipients recorded yet.</p>
                  )}
               </ul>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
