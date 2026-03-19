import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

async function getPrivacyPolicy() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'privacy-policy')
    .single();

  return data?.data?.text || 'This policy is currently being updated. Please check back later.';
}

export default async function PrivacyPolicyPage() {
  const policyText = await getPrivacyPolicy();

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 pb-24">
      <section className="max-w-3xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl lg:text-5xl font-heading font-bold text-myf-charcoal mb-8 text-center drop-shadow-sm">
          Privacy Policy
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mx-auto mb-12" />

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100">
          <div 
            className="prose prose-slate max-w-none text-myf-muted leading-relaxed whitespace-pre-wrap font-sans"
            dangerouslySetInnerHTML={{ __html: policyText }}
          />
        </div>
      </section>
    </main>
  );
}
