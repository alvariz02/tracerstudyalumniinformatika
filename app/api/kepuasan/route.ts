import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Basic server-side validation
    const requiredFields = [
      'nama_instansi_perusahaan',
      'nama_penilai',
      'jabatan',
      'alamat_instansi',
      'nomor_telepon_email',
      'nama_lulusan_yang_dinilai',
      'tahun_lulus',
      'jabatan_lulusan_saat_ini',
      'lama_bekerja',
    ]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field ${field} wajib diisi` }, { status: 400 })
      }
    }

    console.log('Kepuasan POST - Inserting:', body.nama_lulusan_yang_dinilai)

    const { data, error } = await supabase
      .from('kepuasan_pengguna_lulusan')
      .insert([body])
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
    }

    console.log('Kepuasan POST - Success, ID:', data?.id)

    return NextResponse.json({ success: true, id: data.id }, { status: 201 })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('kepuasan_pengguna_lulusan')
    .select('*')

  if (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    console.log('Kepuasan DELETE - ID:', id)

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('kepuasan_pengguna_lulusan')
      .delete()
      .eq('id', id)
      .select()

    console.log('Kepuasan DELETE - ID:', id)
    console.log('Kepuasan DELETE - Result:', { data, error })
    console.log('Kepuasan DELETE - Data length:', data?.length)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: 'Gagal menghapus data', details: error }, { status: 500 })
    }

    return NextResponse.json({ success: true, deleted: data })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
