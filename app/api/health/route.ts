import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic'; // Prevent static caching

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Lightweight query fetching exactly 1 row to wake/keep-alive the DB
    const { error } = await supabase
      .from('site_content')
      .select('id')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ 
      status: 'awake', 
      timestamp: new Date().toISOString() 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Database Sleep/Error', message: error.message }, 
      { status: 500 }
    );
  }
}
