import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ClientAccordions from './components/ClientAccordions';

export const dynamic = 'force-dynamic';

async function getJudgingData() {
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
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
    }
  );

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'competition-judging')
    .single();

  return data?.data || {
    heading: 'Judging Criteria & Scoring',
    description: 'Contestants are evaluated across multiple categories, each designed to highlight their confidence, speaking ability, and overall presence.',
    ageDivisionsTitle: 'Age Divisions',
    categoriesTitle: 'In-Depth Criteria',
    ageDivisions: [
      { division: 'Young Woman / Young Man', ages: '16-20' },
      { division: 'Teen', ages: '13-15' },
      { division: 'Pre-Teen', ages: '10-12' }
    ],
    categories: [
      {
        title: 'Personal Interview',
        weight: '30%',
        description: 'A private panel interview with the judges where contestants share their goals, achievements, and answer impromptu questions.',
        bullets: ['Communication skills', 'Personality and authenticity', 'Ability to articulate thoughts under pressure']
      },
      {
        title: 'Talent / Speech',
        weight: '25%',
        description: 'Contestants may perform a talent of their choice or deliver a prepared speech.',
        bullets: ['Entertainment value', 'Technical skill', 'Stage presence']
      }
    ]
  };
}

export default async function JudgingPage() {
  const data = await getJudgingData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER OVERVIEW */}
      <section className="pt-32 pb-16 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-myf-charcoal mb-6 drop-shadow-sm">
          {data.heading}
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mx-auto mb-8" />
        <p className="text-xl text-myf-muted leading-relaxed">
          {data.description}
        </p>
      </section>

      {/* AGE DIVISIONS */}
      {data.ageDivisions && data.ageDivisions.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-bold text-myf-charcoal mb-4">{data.ageDivisionsTitle || 'Age Divisions'}</h2>
            <div className="w-16 h-1 bg-myf-teal rounded-full mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.ageDivisions.map((div: any, idx: number) => (
              <div key={idx} className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                <h3 className="text-xl font-bold text-myf-charcoal mb-3 font-heading group-hover:text-myf-teal transition-colors">{div.division}</h3>
                <span className="inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-myf-teal/10 to-myf-teal/5 border border-myf-teal/20 text-myf-teal font-bold rounded-full text-sm shadow-sm">
                  Ages {div.ages}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DYNAMIC SCORING ACCORDIONS (IN-DEPTH) */}
      {data.categories && data.categories.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative z-20">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-heading font-bold text-myf-charcoal mb-4">{data.categoriesTitle || 'In-Depth Criteria'}</h2>
             <div className="w-16 h-1 bg-myf-coral rounded-full mx-auto" />
           </div>
           <ClientAccordions categories={data.categories} />
        </section>
      )}

    </main>
  );
}
