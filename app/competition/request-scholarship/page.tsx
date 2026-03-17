import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { GraduationCap } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getRequestData() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'competition-request')
    .single();

  return data?.data || {
    heading: 'Request Your Scholarship Funds',
    description: 'Congratulations on your achievements! Please complete the form below to request the disbursement of your earned scholarship funds to your educational institution.',
    formEmbed: '<div class="p-8 text-center bg-gray-50 border border-gray-200 rounded-2xl text-gray-500">Form Iframe Placeholder</div>'
  };
}

export default async function RequestScholarshipPage() {
  const data = await getRequestData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER OVERVIEW */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-myf-gold/20 rounded-full mb-6 text-yellow-600">
           <GraduationCap className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-myf-charcoal mb-6 drop-shadow-sm">
          {data.heading}
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mx-auto mb-8" />
        <p className="text-xl text-myf-muted leading-relaxed">
          {data.description}
        </p>
      </section>

      {/* EMBEDDED FORM VIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="bg-white rounded-[2rem] shadow-2xl p-2 md:p-6 border border-gray-100 overflow-hidden w-full relative min-h-[600px] flex flex-col items-center justify-center">
             
             {/* Decorative Window Dots */}
             <div className="absolute top-4 left-6 flex gap-2 hidden md:flex z-10">
                <span className="w-3 h-3 rounded-full bg-gray-200"></span>
                <span className="w-3 h-3 rounded-full bg-gray-200"></span>
                <span className="w-3 h-3 rounded-full bg-gray-200"></span>
             </div>

             {/* The raw HTML iframe from Supabase */}
             <div 
               className="w-full h-full flex-1 mt-4 md:mt-8"
               dangerouslySetInnerHTML={{ __html: data.formEmbed }} 
             />
             
        </div>
      </section>

    </main>
  );
}
