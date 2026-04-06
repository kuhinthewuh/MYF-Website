import { createServerSupabaseClient } from '@/lib/supabase-server';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function getBoardData() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 'about-board')
    .single();

  return data?.data || {
    heroTitle: 'Board of Directors',
    heroText: 'Manteca Youth Focus is proudly managed by an all-volunteer Board of Directors dedicated to community empowerment.',
    boardMembersTitle: 'Board Members',
    programDirectorsTitle: 'Program Directors',
    officers: [],
    boardMembers: [],
    programDirectors: []
  };
}

// Rich text helper to parse `[Text](URL)` into `<a>` tags and apply whitespace/alignment
function RichText({ text, align = 'left' }: { text: string, align?: 'left' | 'center' | 'right' }) {
  if (!text) return null;
  
  // Use Tailwind class to control multi-line text alignment securely
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return (
    <div className={`whitespace-pre-wrap ${alignClass}`}>
      {text.split('\n').map((line, i) => {
        const parts = line.split(/(\[[^\]]+\]\([^)]+\))/g);
        return (
          <span key={i}>
            {parts.map((part, j) => {
              const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
              if (match) {
                return (
                  <a key={j} href={match[2]} className="text-myf-teal hover:text-myf-deep underline font-semibold transition-colors font-sans" target="_blank" rel="noopener noreferrer">
                    {match[1]}
                  </a>
                );
              }
              return <span key={j}>{part}</span>;
            })}
            {i < text.split('\n').length - 1 && <br />}
          </span>
        );
      })}
    </div>
  );
}

export default async function BoardPage() {
  const data = await getBoardData();

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-32">
      
      {/* 1. HERO BANNER */}
      <section className="pt-8 md:pt-12 pb-16 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-myf-charcoal mb-6 drop-shadow-sm">
          {data.heroTitle}
        </h1>
        <div className="w-24 h-1.5 bg-myf-teal rounded-full mx-auto mb-8" />
        <div className="text-xl text-myf-muted leading-relaxed w-full">
          <RichText text={data.heroText} align={data.heroAlign} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* 2. OFFICERS (4-Column Grid) */}
        {data.officers && data.officers.length > 0 && (
          <section>
            <h2 className="text-3xl font-heading font-bold text-myf-charcoal mb-10 text-center">Executive Officers</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {data.officers.map((officer: any, idx: number) => (
                <div key={idx} className="group flex flex-col items-center bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
                  <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden mb-6 bg-gray-100 shadow-inner">
                    {officer.image ? (
                      <Image 
                        src={officer.image} 
                        alt={officer.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        unoptimized 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-300">No Photo</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-myf-charcoal text-center mb-1">{officer.name}</h3>
                  <p className="text-sm font-semibold text-myf-teal tracking-wide uppercase text-center">{officer.title}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. BOARD MEMBERS (Small Portrait Grid) */}
        {data.boardMembers && data.boardMembers.length > 0 && (
          <section>
             <div className="w-full max-w-4xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16" />
             <h2 className="text-3xl font-heading font-bold text-myf-charcoal mb-10 text-center">{data.boardMembersTitle || 'Board Members'}</h2>
             
             <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
               {data.boardMembers.map((member: any, idx: number) => (
                 <div key={idx} className="group flex flex-col items-center bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-all border border-gray-100 w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)]">
                   <div className="w-full aspect-[4/5] relative rounded-xl overflow-hidden mb-4 shadow-sm bg-gray-100">
                     {member.image ? (
                        <Image 
                          src={member.image} 
                          alt={member.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                          unoptimized 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-gray-300">No Photo</span>
                        </div>
                      )}
                   </div>
                   <p className="text-[11px] font-bold text-myf-teal tracking-wide uppercase text-center mb-1 leading-tight">{member.title}</p>
                   <h3 className="text-sm font-bold text-myf-charcoal text-center leading-tight">{member.name}</h3>
                 </div>
               ))}
             </div>
          </section>
        )}

        {/* 4. PROGRAM DIRECTORS (Cards) */}
        {data.programDirectors && data.programDirectors.length > 0 && (
          <section>
             <div className="w-full max-w-4xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16 mt-24" />
             <h2 className="text-3xl font-heading font-bold text-myf-charcoal mb-10 text-center">{data.programDirectorsTitle || 'Program Directors'}</h2>
             
             <div className="flex flex-wrap justify-center gap-8">
               {data.programDirectors.map((director: any, idx: number) => (
                 <div key={idx} className="group flex flex-col items-center bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 min-h-full w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.4rem)]">
                   <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden mb-6 bg-gray-100 shadow-inner shrink-0">
                     {director.image ? (
                       <Image 
                         src={director.image} 
                         alt={director.name} 
                         fill 
                         className="object-cover transition-transform duration-700 group-hover:scale-105" 
                         unoptimized 
                       />
                     ) : (
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-gray-300">No Photo</span>
                       </div>
                     )}
                   </div>
                   <h3 className="text-xl font-bold text-myf-charcoal text-center mb-1">{director.name}</h3>
                   <p className="text-sm font-semibold text-myf-teal tracking-wide uppercase text-center mb-4">{director.title}</p>
                   <div className="text-sm text-myf-muted leading-relaxed w-full flex-1">
                      <RichText text={director.description} align={director.align} />
                   </div>
                 </div>
               ))}
             </div>
          </section>
        )}

      </div>
    </main>
  );
}
