import { createServerSupabaseClient } from '@/lib/supabase-server';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getContestantData() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'competition-contestant')
    .single();

  return data?.data || {
    heading: 'Become A Contestant Today!',
    benefits: ['Earn scholarship money for college', 'Develop public speaking skills', 'Gain lifelong friendships', 'Serve the Manteca community'],
    image: '',
    formIframe: '<div class="p-8 text-center bg-gray-50 border border-gray-200 rounded-2xl text-gray-500">Google Form Iframe Placeholder</div>'
  };
}

export default async function ContestantPage() {
  const data = await getContestantData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. TOP SECTION (Split Layout) */}
      <section className="pt-8 md:pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Text */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-myf-charcoal leading-tight drop-shadow-sm mb-4">
                {data.heading}
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-myf-teal to-myf-gold rounded-full" />
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white shadow-xl">
              <h3 className="text-xl font-bold tracking-tight text-myf-charcoal mb-4">Did you know?</h3>
              <ul className="space-y-4">
                {data.benefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-myf-teal shrink-0 mt-0.5" />
                    <span className="text-lg text-myf-muted leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <a 
                href="#application-form" 
                className="inline-flex items-center justify-center py-4 px-8 bg-myf-gold hover:bg-yellow-500 text-myf-charcoal rounded-xl font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                 Click here to complete the Interest Form
              </a>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
             <div className="absolute inset-0 bg-gradient-to-br from-myf-teal/20 to-myf-coral/20 transform rotate-3 rounded-[3rem] -z-10" />
             <div className="w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3] relative rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100 border-4 border-white">
               {data.image ? (
                 <Image 
                   src={data.image} 
                   alt="MYF Youth Group" 
                   fill 
                   className="object-cover" 
                   unoptimized 
                   priority
                 />
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-gray-400 font-medium">Image pending upload</span>
                 </div>
               )}
             </div>
          </div>

        </div>
      </section>

      {/* 2. BOTTOM SECTION: Embedded Form */}
      <section id="application-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-bold text-myf-charcoal mb-4">Interest Form</h2>
            <p className="text-myf-muted">Please fill out the form below. Note deadlines based on your division.</p>
          </div>

          {/* Elevated Iframe Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-2 md:p-6 border border-gray-100 overflow-hidden w-full relative min-h-[500px] flex items-center justify-center">
             
             {/* The raw HTML iframe from Supabase */}
             <div 
               className="w-full h-full"
               dangerouslySetInnerHTML={{ __html: data.formIframe }} 
             />
             
          </div>
        </div>
      </section>

    </main>
  );
}
