import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getFooterData() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
      },
    }
  );

  const { data } = await supabase.from('site_content').select('data').eq('id', 'global-footer').single();
  return data?.data || {
    logoUrl: '/images/MYF%20Logo.png',
    description: 'Empowering the youth of Manteca through leadership, scholarship, and community service.',
    socialLinks: [
      { platform: 'Facebook', url: '#' },
      { platform: 'Instagram', url: '#' }
    ],
    quickLinks: [
      { label: 'About Us', url: '/about/at-a-glance' },
      { label: 'Competition', url: '/competition/contestant' },
      { label: 'Become a Sponsor', url: '/sponsor' },
      { label: 'Contact', url: '/contact/reach-out' }
    ],
    copyright: '© 2024 Manteca Youth Focus. All rights reserved.'
  };
}

export default async function GlobalFooter() {
  const data = await getFooterData();

  return (
    <footer className="bg-[#0a0f1a] text-white pt-16 pb-8 border-t border-white/5 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <img src={data.logoUrl || '/images/MYF%20Logo.png'} alt="MYF Logo" className="h-20 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-white/60 leading-relaxed max-w-sm text-sm">
              {data.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 lg:col-span-3 lg:col-start-7">
            <h4 className="text-lg font-bold font-sans mb-6 text-white tracking-wide">Quick Links</h4>
            <ul className="space-y-4">
              {data.quickLinks?.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link href={link.url} className="text-white/50 hover:text-[#00B4CC] hover:translate-x-1 inline-block transition-all duration-300 text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-bold font-sans mb-6 text-white tracking-wide">Connect</h4>
            <ul className="space-y-4">
              {data.socialLinks?.map((social: any, idx: number) => (
                <li key={idx}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#00B4CC] hover:translate-x-1 inline-block transition-all duration-300 text-sm font-medium">
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs font-medium">{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
