import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getFormsData() {
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
    .eq('id', 'competition-forms')
    .single();

  return data?.data || {
    heading: 'Contestant Forms & Deadlines',
    steps: [
      { nodes: [{ title: 'Step 1: Become a Contestant', instructions: 'Complete the interest form to begin your journey.', buttons: [{ label: 'Interest Form', url: '/competition/contestant', type: 'solid' }] }] },
      { nodes: [{ title: 'Step 2: Due April 1st', instructions: 'Submit your headshot and biography.', buttons: [{ label: 'Upload Headshot', url: '#', type: 'outline' }] }] },
      { nodes: [{ title: 'Step 3: Due April 15th', instructions: 'Submit final paperwork based on your division.', buttons: [{ label: 'Younger Division', url: '#', type: 'solid' }, { label: 'Upper Division', url: '#', type: 'solid' }] }] },
      { nodes: [{ title: 'Step 4: Due May 1st', instructions: 'Ad pages and ticket sales are due.', buttons: [] }] },
      { nodes: [{ title: 'Step 5: Due June 1st', instructions: 'Final rehearsal schedule and talent music submission.', buttons: [] }] },
    ]
  };
}

export default async function FormsPage() {
  const data = await getFormsData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-myf-charcoal mb-6 drop-shadow-sm max-w-4xl mx-auto">
          {data.heading}
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal to-myf-gold rounded-full mx-auto" />
      </section>

      {/* VERTICAL STEPPER UI */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="relative">
          
          {/* Vertical Line spanning all steps */}
          <div className="absolute left-[27px] md:left-[39px] top-4 bottom-12 w-1 bg-gray-200 rounded-full" />

          <div className="space-y-12 md:space-y-16">
            {data.steps.map((step: any, idx: number) => (
              <div key={idx} className="relative flex items-start gap-6 md:gap-10 group">
                
                {/* Step Circle Marker */}
                <div className="relative z-10 w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-full bg-white border-4 border-gray-100 shadow-md flex items-center justify-center group-hover:border-myf-teal transition-colors duration-500">
                  <span className="text-xl md:text-2xl font-bold font-heading text-myf-charcoal group-hover:text-myf-teal transition-colors duration-500">
                    {idx + 1}
                  </span>
                </div>

                {/* Nodes Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {step.nodes && step.nodes.map((node: any, nIdx: number) => (
                    <div key={nIdx} className={`bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col ${step.nodes.length === 1 ? 'md:col-span-2' : ''}`}>
                      <h3 className="text-2xl font-bold text-myf-charcoal mb-3 font-heading">
                        {node.title}
                      </h3>
                      <p className="text-myf-muted text-lg mb-8 leading-relaxed whitespace-pre-wrap">
                        {node.instructions}
                      </p>
                      
                      {/* Buttons */}
                      {node.buttons && node.buttons.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-auto">
                          {node.buttons.map((btn: any, bIdx: number) => {
                            const isSolid = btn.type === 'solid';
                            return (
                              <Link 
                                key={bIdx}
                                href={btn.url || '#'}
                                className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold tracking-wide transition-all ${
                                  isSolid 
                                    ? 'bg-myf-teal hover:bg-myf-deep text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                    : 'bg-transparent border-2 border-myf-teal text-myf-teal hover:bg-myf-teal hover:text-white'
                                }`}
                              >
                                {btn.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
