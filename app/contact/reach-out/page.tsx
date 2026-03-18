import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Mail, Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getContactData() {
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
    .eq('id', 'contact-reach')
    .single();

  return data?.data || {
    heading: 'Get In Touch',
    description: 'Have questions about our programs, scholarships, or upcoming events? We would love to hear from you. Reach out to our team using the contact information below.',
    email: 'info@mantecayouthfocus.org',
    phone: '(209) 555-0198',
    address: '123 Main Street, Suite 100\nManteca, CA 95336',
    mapEmbed: '<div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Map Placeholder</div>',
    instagramUrl: 'https://instagram.com/mantecayouthfocus',
    facebookUrl: 'https://facebook.com/mantecayouthfocus'
  };
}

export default async function ContactReachPage() {
  const data = await getContactData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER OVERVIEW */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-myf-teal/10 rounded-full mb-6 text-myf-teal">
           <Send className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-myf-charcoal mb-6 drop-shadow-sm">
          {data.heading}
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mx-auto mb-8" />
        <p className="text-xl text-myf-muted leading-relaxed">
          {data.description}
        </p>
      </section>

      {/* TWO COLUMN GRID: CONTACT INFO & MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid lg:grid-cols-5 gap-8 bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
           
           {/* Abstract Decorative blob */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-myf-teal/5 to-myf-gold/5 blur-3xl rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />

           {/* LEFT BUMPER: CONTACT DETAILS */}
           <div className="lg:col-span-2 flex flex-col justify-center space-y-10 p-4 md:p-8">
              
              <div className="space-y-8">
                 {/* Email Block */}
                 {data.email && (
                   <div className="flex gap-5 group">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-gray-50 flex items-center justify-center text-myf-teal shadow-inner group-hover:bg-myf-teal group-hover:text-white transition-all duration-300">
                         <Mail className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-myf-charcoal uppercase tracking-wider mb-1">Email Us</h4>
                         <a href={`mailto:${data.email}`} className="text-lg text-myf-muted font-medium hover:text-myf-teal transition-colors break-all">
                           {data.email}
                         </a>
                      </div>
                   </div>
                 )}

                 {/* Phone Block */}
                 {data.phone && (
                   <div className="flex gap-5 group">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-gray-50 flex items-center justify-center text-myf-gold shadow-inner group-hover:bg-myf-gold group-hover:text-white transition-all duration-300">
                         <Phone className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-myf-charcoal uppercase tracking-wider mb-1">Call Us</h4>
                         <a href={`tel:${data.phone.replace(/[^0-9]/g, '')}`} className="text-lg text-myf-muted font-medium hover:text-myf-gold transition-colors">
                           {data.phone}
                         </a>
                      </div>
                   </div>
                 )}

                 {/* Address Block */}
                 {data.address && (
                   <div className="flex gap-5 group">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-gray-50 flex items-center justify-center text-myf-coral shadow-inner group-hover:bg-myf-coral group-hover:text-white transition-all duration-300">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-myf-charcoal uppercase tracking-wider mb-1">Visit Us</h4>
                         <p className="text-lg text-myf-muted font-medium whitespace-pre-line leading-relaxed">
                           {data.address}
                         </p>
                      </div>
                   </div>
                 )}
              </div>

              {/* Social Links Divider */}
              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-sm font-bold text-myf-charcoal uppercase tracking-wider mb-4">Follow Our Journey</h4>
                <div className="flex gap-4">
                   {data.instagramUrl && (
                     <a href={data.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                        <Instagram className="w-5 h-5" />
                     </a>
                   )}
                   {data.facebookUrl && (
                     <a href={data.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                        <Facebook className="w-5 h-5" />
                     </a>
                   )}
                </div>
              </div>

           </div>

           {/* RIGHT BUMPER: EMBEDDED MAP */}
           <div className="lg:col-span-3 min-h-[400px] lg:min-h-full rounded-[2rem] overflow-hidden shadow-inner border border-gray-100/50 bg-gray-50 relative">
             <div 
               className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-none mix-blend-multiply"
               dangerouslySetInnerHTML={{ __html: data.mapEmbed }}
             />
           </div>

        </div>
      </section>

    </main>
  );
}
