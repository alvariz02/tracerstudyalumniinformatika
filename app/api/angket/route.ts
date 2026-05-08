import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'nama',
      'angkatan',
      'jenis_kelamin',
      'sarana_ruang_kuliah_bersih',
      'sarana_ruang_kuliah_nyaman',
      'sarana_pembelajaran_ruang',
      'sarana_perpustakaan_lengkap',
      'sarana_laboratorium_relevan',
      'sarana_buku_referensi',
      'sarana_fasilitas_kamar_kecil',
      'sarana_fasilitas_ibadah',
      'perlakuan_staf_santun',
      'perlakuan_dosen_pa',
      'perlakuan_dosen_konseling',
      'perlakuan_sanksi_adil',
      'kehandalan_materi_jelas',
      'kehandalan_bahan_ajar',
      'kehandalan_waktu_diskusi',
      'kehandalan_penilaian_objektif',
      'kehandalan_dosen_tepat_waktu',
      'kehandalan_jumlah_dosen',
      'kehandalan_kemampuan_staf',
      'kehandalan_kualitas_layanan_staf',
      'pemahaman_kepentingan_mahasiswa',
      'pemahaman_biaya_dibicarakan',
      'pemahaman_monitoring_pa',
      'pemahaman_minat_bakat',
      'tanggap_dosen_konseling',
      'tanggap_bantuan_tidak_mampu',
      'tanggap_bantu_masalah_akademik',
      'tanggap_waktu_konsultasi_ortu',
    ]

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Field ${field} wajib diisi` },
          { status: 400 }
        )
      }
    }

    // Validate nama
    if (!body.nama || body.nama.trim() === '') {
      return NextResponse.json(
        { error: 'Nama wajib diisi' },
        { status: 400 }
      )
    }

    // Validate jenis_kelamin
    if (!['Laki-Laki', 'Perempuan'].includes(body.jenis_kelamin)) {
      return NextResponse.json(
        { error: 'Jenis kelamin tidak valid' },
        { status: 400 }
      )
    }

    // Insert into database
    const { error } = await supabase.from('angket_kepuasan').insert({
      nama: body.nama.trim(),
      angkatan: body.angkatan,
      jenis_kelamin: body.jenis_kelamin,
      sarana_ruang_kuliah_bersih: body.sarana_ruang_kuliah_bersih,
      sarana_ruang_kuliah_nyaman: body.sarana_ruang_kuliah_nyaman,
      sarana_pembelajaran_ruang: body.sarana_pembelajaran_ruang,
      sarana_perpustakaan_lengkap: body.sarana_perpustakaan_lengkap,
      sarana_laboratorium_relevan: body.sarana_laboratorium_relevan,
      sarana_buku_referensi: body.sarana_buku_referensi,
      sarana_fasilitas_kamar_kecil: body.sarana_fasilitas_kamar_kecil,
      sarana_fasilitas_ibadah: body.sarana_fasilitas_ibadah,
      perlakuan_staf_santun: body.perlakuan_staf_santun,
      perlakuan_dosen_pa: body.perlakuan_dosen_pa,
      perlakuan_dosen_konseling: body.perlakuan_dosen_konseling,
      perlakuan_sanksi_adil: body.perlakuan_sanksi_adil,
      kehandalan_materi_jelas: body.kehandalan_materi_jelas,
      kehandalan_bahan_ajar: body.kehandalan_bahan_ajar,
      kehandalan_waktu_diskusi: body.kehandalan_waktu_diskusi,
      kehandalan_penilaian_objektif: body.kehandalan_penilaian_objektif,
      kehandalan_dosen_tepat_waktu: body.kehandalan_dosen_tepat_waktu,
      kehandalan_jumlah_dosen: body.kehandalan_jumlah_dosen,
      kehandalan_kemampuan_staf: body.kehandalan_kemampuan_staf,
      kehandalan_kualitas_layanan_staf: body.kehandalan_kualitas_layanan_staf,
      pemahaman_kepentingan_mahasiswa: body.pemahaman_kepentingan_mahasiswa,
      pemahaman_biaya_dibicarakan: body.pemahaman_biaya_dibicarakan,
      pemahaman_monitoring_pa: body.pemahaman_monitoring_pa,
      pemahaman_minat_bakat: body.pemahaman_minat_bakat,
      tanggap_dosen_konseling: body.tanggap_dosen_konseling,
      tanggap_bantuan_tidak_mampu: body.tanggap_bantuan_tidak_mampu,
      tanggap_bantu_masalah_akademik: body.tanggap_bantu_masalah_akademik,
      tanggap_waktu_konsultasi_ortu: body.tanggap_waktu_konsultasi_ortu,
      masukan_layanan_akademik: body.masukan_layanan_akademik || null,
    })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Gagal menyimpan data ke database' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    console.log('Angket DELETE - ID:', id)

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('angket_kepuasan')
      .delete()
      .eq('id', id)
      .select()

    console.log('Angket DELETE - Result:', { data, error })

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: 'Gagal menghapus data', details: error }, { status: 500 })
    }

    return NextResponse.json({ success: true, deleted: data })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
