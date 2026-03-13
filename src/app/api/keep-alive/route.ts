import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Una consulta simple para mantener activa la instancia de Supabase
    const { data, error } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'ok', 
      message: 'Supabase keep-alive successful',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
