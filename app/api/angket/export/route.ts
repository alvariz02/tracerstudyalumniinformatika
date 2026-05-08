import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('angket_kepuasan')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data untuk diexport' }, { status: 400 })
    }

    // Format data for Excel
    const formattedData = data.map((row: any) => ({
      'ID': row.id,
      'Tanggal Submit': new Date(row.created_at).toLocaleDateString('id-ID'),
      'Nama': row.nama,
      'Angkatan': row.angkatan,
      'Jenis Kelamin': row.jenis_kelamin,
      // Sarana Pendidikan
      'Sarana - Ruang Kuliah Bersih': row.sarana_ruang_kuliah_bersih,
      'Sarana - Ruang Kuliah Nyaman': row.sarana_ruang_kuliah_nyaman,
      'Sarana - Pembelajaran': row.sarana_pembelajaran_ruang,
      'Sarana - Perpustakaan': row.sarana_perpustakaan_lengkap,
      'Sarana - Laboratorium': row.sarana_laboratorium_relevan,
      'Sarana - Buku Referensi': row.sarana_buku_referensi,
      'Sarana - Kamar Kecil': row.sarana_fasilitas_kamar_kecil,
      'Sarana - Fasilitas Ibadah': row.sarana_fasilitas_ibadah,
      // Perlakuan
      'Perlakuan - Staf Santun': row.perlakuan_staf_santun,
      'Perlakuan - Dosen PA': row.perlakuan_dosen_pa,
      'Perlakuan - Dosen Konseling': row.perlakuan_dosen_konseling,
      'Perlakuan - Sanksi Adil': row.perlakuan_sanksi_adil,
      // Kehandalan
      'Kehandalan - Materi Jelas': row.kehandalan_materi_jelas,
      'Kehandalan - Bahan Ajar': row.kehandalan_bahan_ajar,
      'Kehandalan - Waktu Diskusi': row.kehandalan_waktu_diskusi,
      'Kehandalan - Penilaian Objektif': row.kehandalan_penilaian_objektif,
      'Kehandalan - Dosen Tepat Waktu': row.kehandalan_dosen_tepat_waktu,
      'Kehandalan - Jumlah Dosen': row.kehandalan_jumlah_dosen,
      'Kehandalan - Kemampuan Staf': row.kehandalan_kemampuan_staf,
      'Kehandalan - Kualitas Layanan': row.kehandalan_kualitas_layanan_staf,
      // Pemahaman
      'Pemahaman - Kepentingan Mahasiswa': row.pemahaman_kepentingan_mahasiswa,
      'Pemahaman - Biaya Dibicarakan': row.pemahaman_biaya_dibicarakan,
      'Pemahaman - Monitoring PA': row.pemahaman_monitoring_pa,
      'Pemahaman - Minat Bakat': row.pemahaman_minat_bakat,
      // Tanggap
      'Tanggap - Dosen Konseling': row.tanggap_dosen_konseling,
      'Tanggap - Bantuan Tidak Mampu': row.tanggap_bantuan_tidak_mampu,
      'Tanggap - Bantu Masalah Akademik': row.tanggap_bantu_masalah_akademik,
      'Tanggap - Waktu Konsultasi Ortu': row.tanggap_waktu_konsultasi_ortu,
      // Masukan
      'Masukan Layanan Akademik': row.masukan_layanan_akademik || '-',
    }))

    // Create workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(formattedData)

    // Set column widths
    const colWidths = [
      { wch: 36 }, // ID
      { wch: 15 }, // Tanggal
      { wch: 25 }, // Nama
      { wch: 12 }, // Angkatan
      { wch: 15 }, // Jenis Kelamin
      { wch: 8 },  // Rating fields
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 40 }, // Masukan
    ]
    ws['!cols'] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, 'Angket Kepuasan')

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    // Return as downloadable file
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=angket_kepuasan.xlsx',
      },
    })
  } catch (err) {
    console.error('Export error:', err)
    return NextResponse.json({ error: 'Gagal export data' }, { status: 500 })
  }
}
