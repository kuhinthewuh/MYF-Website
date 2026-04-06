import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"], 
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "Manteca Youth Focus | Developing Tomorrow's Leaders",
  description: "Manteca Youth Focus is a youth leadership organization dedicated to developing young leaders, encouraging higher education, and serving the community.",
};

import { createServerSupabaseClient } from '@/lib/supabase-server';
import ConditionalNav from "@/components/ConditionalNav";
import ConditionalFooter from "@/components/ConditionalFooter";
import GlobalFooter from "@/components/GlobalFooter";
import CookieToast from "@/components/CookieToast";
import AnalyticsTracker from "@/components/AnalyticsTracker";

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m ? `${parseInt(m[1], 16)} ${parseInt(m[2], 16)} ${parseInt(m[3], 16)}` : '0 0 0';
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('site_content').select('data').eq('id', 'global-theme').single();
  const theme = data?.data || {
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#2DD4BF',
    primaryDeep: '#0F766E',
    secondary: '#FB7185',
    secondaryDeep: '#E11D48',
    accent: '#FBBF24',
    textMain: '#1E293B',
    textMuted: '#64748B'
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${inter.variable} ${poppins.variable} font-sans bg-myf-bg text-myf-charcoal antialiased selection:bg-myf-teal selection:text-white`}
        style={{
          '--theme-bg': theme.bg,
          '--theme-surface': theme.surface,
          '--theme-primary': theme.primary,
          '--theme-primary-deep': theme.primaryDeep,
          '--theme-secondary': theme.secondary,
          '--theme-secondary-deep': theme.secondaryDeep,
          '--theme-accent': theme.accent,
          '--theme-text-main': theme.textMain,
          '--theme-text-muted': theme.textMuted,
          '--theme-bg-rgb': hexToRgb(theme.bg),
          '--theme-surface-rgb': hexToRgb(theme.surface),
          '--theme-primary-rgb': hexToRgb(theme.primary),
          '--theme-primary-deep-rgb': hexToRgb(theme.primaryDeep),
          '--theme-secondary-rgb': hexToRgb(theme.secondary),
          '--theme-secondary-deep-rgb': hexToRgb(theme.secondaryDeep),
          '--theme-accent-rgb': hexToRgb(theme.accent),
          '--theme-text-main-rgb': hexToRgb(theme.textMain),
          '--theme-text-muted-rgb': hexToRgb(theme.textMuted),
        } as React.CSSProperties}
      >
        <ConditionalNav />
        {children}
        <ConditionalFooter>
          <GlobalFooter />
        </ConditionalFooter>
        <CookieToast />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
