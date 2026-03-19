import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  // We don't use createServerSupabaseClient here because we don't want or need to parse/set cookies.
  // This is just a lightweight, fast insertion.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
    }
  );

  try {
    const body = await request.json();
    const { url_path } = body;

    if (!url_path) {
      return NextResponse.json({ error: 'Missing url_path' }, { status: 400 });
    }

    const { error } = await supabase
      .from('page_views')
      .insert([
        { url_path, created_at: new Date().toISOString() }
      ]);

    // Fails silently if table doesn't exist yet to prevent console errors
    if (error) {
       console.error("Analytics Error:", error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
