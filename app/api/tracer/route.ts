import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Basic server-side validation
    const required = [
      'nim_npm', 'nama', 'tahun_lulus', 'no_telpon', 'email',
      'status_saat_ini', 'waktu_mulai_mencari', 'aktif_mencari_kerja',
    ]
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field ${field} wajib diisi` }, { status: 400 })
      }
    }

    console.log('Tracer POST - Inserting:', body.nama, body.nim_npm)

    const { data, error } = await supabase
      .from('tracer_study')
      .insert([body])
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
    }

    console.log('Tracer POST - Success, ID:', data?.id)

    return NextResponse.json({ success: true, id: data.id }, { status: 201 })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('tracer_study')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const { error } = await supabase
      .from('tracer_study')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
