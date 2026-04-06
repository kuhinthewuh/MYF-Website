import { createServerSupabaseClient } from '@/lib/supabase-server';
import RetroCarousel from './components/RetroCarousel';
import { Camera, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getAlumniData() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'contact-alumni')
    .single();

  return data?.data || {
    heading: 'Alumni Corner',
    description: 'Welcome back! Our alumni are the heart of Manteca Youth Focus. Whether you competed 5 years ago or 30 years ago, you are always part of the MYF family.',
    surveyUrl: 'https://docs.google.com/forms/d/e/.../viewform',
    buttonLabel: 'Update Your Contact Info',
    images: [] // Handles empty state safely
  };
}

export default async function AlumniPage() {
  const data = await getAlumniData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER OVERVIEW */}
      <section className="pt-8 md:pt-12 pb-12 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-myf-gold/10 rounded-full mb-6 text-yellow-600 shadow-sm shadow-yellow-500/10">
           <Camera className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-myf-charcoal mb-6 drop-shadow-sm">
          {data.heading}
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mx-auto mb-8" />
        <p className="text-xl text-myf-muted leading-relaxed max-w-2xl mx-auto">
          {data.description}
        </p>

        {/* SURVEY CTA */}
        {data.surveyUrl && (
          <div className="mt-10 mb-8 inline-block animate-in fade-in slide-in-from-bottom-4 duration-700">
             <a
               href={data.surveyUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="group inline-flex items-center gap-3 px-8 py-4 bg-myf-charcoal hover:bg-black text-white rounded-xl font-bold tracking-wide transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
             >
               {data.buttonLabel || 'Update Your Contact Info'}
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </a>
             <p className="text-sm text-gray-400 mt-4 opacity-80">Help us stay in touch and let us know what you're up to!</p>
          </div>
        )}
      </section>

      {/* RETRO CAROUSEL */}
      <section className="overflow-hidden bg-[#F8FAFC] pb-32">
         {data.images && data.images.length > 0 ? (
           <RetroCarousel images={data.images} />
         ) : (
           <div className="py-24 text-center text-gray-400 italic">
             Our memory lane is currently being dusted off. Check back soon for photos!
           </div>
         )}
      </section>

    </main>
  );
}
