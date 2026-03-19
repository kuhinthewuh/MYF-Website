import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Download, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getHandbookData() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'competition-handbook')
    .single();

  return data?.data || {
    heading: 'Official Contestant Handbook',
    description: 'Review the rules, expectations, and guidelines for the upcoming Manteca Youth Focus scholarship competitions.',
    pdfUrl: '',
    flipbookUrl: ''
  };
}

export default async function HandbookPage() {
  const data = await getHandbookData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER */}
      <section className="pt-32 pb-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
           <div className="inline-flex items-center justify-center p-4 bg-myf-teal/10 rounded-full mb-6 text-myf-teal">
              <FileText className="w-8 h-8" />
           </div>
           <h1 className="text-4xl md:text-5xl font-heading font-bold text-myf-charcoal mb-6 drop-shadow-sm">
             {data.heading}
           </h1>
           <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal to-myf-gold rounded-full mx-auto mb-6" />
           <p className="text-xl text-myf-muted leading-relaxed mb-10 max-w-2xl mx-auto">
             {data.description}
           </p>
           
           {/* Action Bar */}
           {(data.flipbookUrl || data.pdfUrl) && (
             <a 
               href={data.flipbookUrl || data.pdfUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-3 px-8 py-4 bg-myf-charcoal hover:bg-black text-white rounded-xl font-bold tracking-wide transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
             >
               <FileText className="w-5 h-5" />
               Open in Full Screen
             </a>
           )}
        </div>
      </section>

      {/* VIEWER SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32 max-w-6xl mx-auto">
         {(data.flipbookUrl || data.pdfUrl) ? (
            <div className="w-full h-[800px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative group">
               
               {/* Decorative Desktop Window Header */}
               <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-6 gap-2 shrink-0">
                  <div className="flex gap-2">
                     <span className="w-3 h-3 rounded-full bg-red-400"></span>
                     <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                     <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  </div>
                  <div className="ml-4 px-4 py-1 bg-white rounded-md text-xs font-mono text-gray-400 border border-gray-100 flex-1 truncate max-w-md text-center">
                     handbook_virtual_flipbook.heyzine
                  </div>
               </div>

               {/* Native Iframe PDF/Flipbook Viewer */}
               <iframe 
                 src={data.flipbookUrl || data.pdfUrl}
                 className="flex-1 w-full h-full bg-gray-100/50"
                 title="Contestant Handbook Viewer"
                 allowFullScreen
                 scrolling="no"
               />
               
               <div className="absolute bottom-4 right-4 print:hidden md:hidden">
                 <a href={data.flipbookUrl || data.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-myf-teal text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold flex items-center gap-2">
                    Open in new tab
                 </a>
               </div>
            </div>
         ) : (
            <div className="w-full h-[400px] bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8">
               <FileText className="w-16 h-16 text-gray-300 mb-4" />
               <h3 className="text-2xl font-bold text-gray-400 font-heading mb-2">No Document Available</h3>
               <p className="text-gray-400">The handbook has not been uploaded yet. Please check back later.</p>
            </div>
         )}
      </section>

    </main>
  );
}
