import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Download, CheckCircle2, Star } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getSponsorData() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'sponsor')
    .single();

  return data?.data || {
    heading: 'Become A Sponsor',
    description: 'Your generous support empowers the youth of Manteca to reach their full potential. Explore our sponsorship tiers below and partner with us to make a lasting impact.',
    deckPdfUrl: '',
    tiers: [
      { name: 'Competition Sponsor', price: '$100', description: 'Ideal starting tier for supporting local scholarships.', isPopular: false, perks: ['Name listed in competition program', 'Mentioned on social media'] },
      { name: 'Bronze Sponsor', price: '$250', description: 'Perfect for small businesses entering the community.', isPopular: false, perks: ['Business card ad in program guide', 'Name listed on our website', '1 VIP ticket'] },
      { name: 'Silver Sponsor', price: '$500', description: 'Establishing a stronger community presence.', isPopular: false, perks: ['1/4 page ad in the program guide', 'Logo placement on our website', '2 VIP tickets', 'Verbal recognition'] },
      { name: 'Gold Sponsor', price: '$1,000', description: 'Our most popular tier for establishing brand presence.', isPopular: true, perks: ['1/2 page ad in the program guide', 'Premium logo placement on our website', '4 VIP tickets', 'Verbal recognition during the event'] },
      { name: 'Platinum Sponsor', price: '$2,500+', description: 'The ultimate partnership level for maximum visibility.', isPopular: false, perks: ['Full page ad in the program guide', 'Home page logo spotlight', '8 VIP tickets', 'Opportunity to present an award', 'Social channel spotlight'] }
    ]
  };
}

export default async function SponsorPage() {
  const data = await getSponsorData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER OVERVIEW */}
      <section className="pt-8 md:pt-12 pb-16 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-myf-charcoal mb-6 drop-shadow-sm leading-tight">
          {data.heading}
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mx-auto mb-8" />
        <p className="text-xl text-myf-muted leading-relaxed max-w-2xl mx-auto mb-10">
          {data.description}
        </p>

        {data.deckPdfUrl && (
          <a
            href={data.deckPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-myf-charcoal hover:bg-black text-white rounded-xl font-bold tracking-wide transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 mx-auto"
          >
            <Download className="w-5 h-5" />
            Download Sponsorship Deck
          </a>
        )}
      </section>

      {/* PRICING TIERS GRID */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8 items-stretch">
          
          {data.tiers.map((tier: any, idx: number) => {
            const isPopular = tier.isPopular;

            return (
              <div 
                key={idx} 
                className={`flex flex-col h-full bg-white rounded-3xl p-8 border hover:shadow-2xl transition-all w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.4rem)] duration-300 relative ${
                  isPopular 
                    ? 'border-myf-teal shadow-[0_10px_40px_rgba(0,180,204,0.15)] ring-1 ring-myf-teal scale-100 lg:scale-105 z-10' 
                    : 'border-gray-100 shadow-lg mt-0 lg:mt-6'
                }`}
              >
                
                {isPopular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-myf-teal text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center gap-1 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-current" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-myf-charcoal font-heading mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-black text-myf-charcoal">{tier.price}</span>
                  </div>
                  <p className="text-myf-muted text-sm leading-relaxed min-h-[40px]">
                    {tier.description}
                  </p>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6" />

                <div className="flex-1">
                  <ul className="space-y-4 mb-8">
                    {tier.perks.map((perk: string, pIdx: number) => (
                      <li key={pIdx} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isPopular ? 'text-myf-teal' : 'text-gray-400'}`} />
                        <span className="text-myf-charcoal text-sm font-medium leading-relaxed">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call To Action button (all route to contact form eventually) */}
                <Link 
                  href="/contact/reach-out"
                  className={`block w-full text-center py-3.5 rounded-xl font-bold tracking-wide transition-all ${
                    isPopular 
                      ? 'bg-myf-teal hover:bg-myf-deep text-white shadow-md hover:shadow-lg' 
                      : 'bg-gray-50 hover:bg-gray-100 text-myf-charcoal border border-gray-200'
                  }`}
                >
                  Become a {tier.name.split(' ')[0]} Sponsor
                </Link>

              </div>
            );
          })}

        </div>
      </section>

    </main>
  );
}
