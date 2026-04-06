import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Users, AlertCircle, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getServiceData() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'service-join')
    .single();

  return data?.data || {
    heading: 'Join the Student Service Team',
    description: 'The Manteca Youth Focus Student Service Team is a dynamic group of young individuals dedicated to serving our community. Earn volunteer hours, build your resume, and make lifelong friends.',
    isRecruiting: true,
    alertMessage: 'We are currently accepting applications for the Fall term.',
    formEmbed: '<div class="p-8 text-center bg-gray-50 border border-gray-200 rounded-2xl text-gray-500">Form Iframe Placeholder</div>'
  };
}

export default async function ServiceJoinPage() {
  const data = await getServiceData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER OVERVIEW */}
      <section className="pt-8 md:pt-12 pb-16 px-4 text-center max-w-4xl mx-auto">
        
        {/* Status Alert Banner */}
        <div className="mb-8 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
           <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border shadow-sm backdrop-blur-md ${data.isRecruiting ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {data.isRecruiting ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-semibold text-sm tracking-wide">{data.alertMessage}</span>
           </div>
        </div>

        <div className="inline-flex items-center justify-center p-4 bg-myf-teal/10 rounded-full mb-6 text-myf-teal">
           <Users className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-myf-charcoal mb-6 drop-shadow-sm leading-tight">
          {data.heading}
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mx-auto mb-8" />
        <p className="text-xl text-myf-muted leading-relaxed max-w-3xl mx-auto">
          {data.description}
        </p>
      </section>

      {/* CONDITIONAL EMBEDDED FORM VIEW */}
      {data.isRecruiting && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="bg-white rounded-[2rem] shadow-2xl p-2 md:p-6 border border-gray-100 overflow-hidden w-full relative min-h-[600px] flex flex-col items-center justify-center">
               
               {/* Decorative Window Header */}
               <div className="absolute top-4 left-6 md:flex gap-2 hidden z-10">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
               </div>
               {/* Centered App Name */}
               <div className="absolute top-3 w-full text-center hidden md:block text-xs font-bold text-gray-300 uppercase tracking-widest z-0 pointer-events-none">
                  Application Portal
               </div>

               {/* HTML iframe */}
               <div 
                 className="w-full h-full flex-1 mt-4 md:mt-10"
                 dangerouslySetInnerHTML={{ __html: data.formEmbed }} 
               />
               
          </div>
        </section>
      )}

    </main>
  );
}
