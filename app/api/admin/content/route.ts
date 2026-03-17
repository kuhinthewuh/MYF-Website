import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

function createSupabaseClient(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );
  return supabase;
}

export async function GET(request: NextRequest) {
  const supabase = createSupabaseClient(request);
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section') || searchParams.get('id');

  if (!section) {
    return NextResponse.json({ error: 'Missing section param' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', section)
    .single();

  // Gracefully return null for "row not found" OR if table doesn't exist yet.
  // The frontend components will fall back to their hardcoded defaults.
  if (error) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: data?.data ?? null });
}

export async function PUT(request: NextRequest) {
  const supabase = createSupabaseClient(request);

  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { section, id, data } = body;
  const targetSection = section || id;

  if (!targetSection || !data) {
    return NextResponse.json({ error: 'Missing section or data' }, { status: 400 });
  }

  const { error } = await supabase
    .from('site_content')
    .upsert(
      { id: targetSection, data, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
