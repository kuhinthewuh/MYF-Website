import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Heart, ArrowRight, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDonateData() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'donate')
    .single();

  return data?.data || {
    heading: 'Support Our Mission',
    description: 'Your contribution directly funds educational scholarships and empowers the youth of Manteca to become tomorrow\'s leaders. Every donation makes a difference.',
    donateUrl: 'https://paypal.com/donate',
    stats: [
      { value: '$10,000+', label: 'Awarded Annually' },
      { value: '500+', label: 'Community Hours' },
      { value: '100%', label: 'Volunteer Driven' }
    ]
  };
}

export default async function DonatePage() {
  const data = await getDonateData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      <section className="relative pt-8 md:pt-12 pb-24 px-4 overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-gradient-to-b from-myf-teal/5 to-transparent rounded-b-full pointer-events-none -z-10" />

         <div className="max-w-4xl mx-auto text-center">
            
            <div className="inline-flex items-center justify-center p-5 bg-myf-coral/10 rounded-full mb-8 text-myf-coral shadow-sm shadow-myf-coral/20">
               <Heart className="w-12 h-12 animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-myf-charcoal mb-6 drop-shadow-sm leading-tight tracking-tight">
              {data.heading}
            </h1>
            
            <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mx-auto mb-8" />
            
            <p className="text-xl md:text-2xl text-myf-muted leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
              {data.description}
            </p>

            {/* CALL TO ACTION BUTTON */}
            <div className="flex flex-col items-center justify-center gap-6">
               <a 
                 href={data.donateUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 md:px-12 md:py-6 bg-gradient-to-r from-myf-coral to-[#ED5565] hover:from-[#e33748] hover:to-[#db4353] text-white rounded-full font-black text-xl md:text-2xl tracking-wide transition-all shadow-[0_10px_40px_rgba(239,71,111,0.3)] hover:shadow-[0_15px_50px_rgba(239,71,111,0.5)] hover:-translate-y-1 overflow-hidden"
               >
                 <span className="relative z-10 flex items-center gap-3">
                   Donate Now <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                 </span>
                 <div className="absolute inset-0 h-full w-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
               </a>
               
               <div className="flex items-center gap-2 text-myf-muted text-sm font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 Secure payment processed via external provider
               </div>
            </div>

         </div>
      </section>

      {/* IMPACT STATS */}
      {data.stats && data.stats.length > 0 && (
        <section className="px-4 pb-32 max-w-5xl mx-auto relative z-20">
           <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
             <div className="text-center mb-10">
                <h3 className="text-2xl font-bold font-heading text-myf-charcoal">Your Impact By The Numbers</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
               {data.stats.map((stat: any, idx: number) => (
                 <div key={idx} className="flex flex-col items-center text-center pt-8 md:pt-0 px-4 group">
                    <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-myf-teal to-myf-blue mb-2 transition-transform group-hover:scale-105 duration-300">
                      {stat.value}
                    </span>
                    <span className="text-myf-charcoal font-semibold uppercase tracking-wider text-sm">
                      {stat.label}
                    </span>
                 </div>
               ))}
             </div>
           </div>
        </section>
      )}

    </main>
  );
}
