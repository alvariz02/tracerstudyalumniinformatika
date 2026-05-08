import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('kepuasan_pengguna_lulusan')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Export error:', error)
      return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data untuk diexport' }, { status: 400 })
    }

    // Transform data untuk Excel
    const excelData = data.map((row, index) => ({
      'No': index + 1,
      'Tanggal Submit': new Date(row.created_at).toLocaleDateString('id-ID'),
      'Nama Instansi/Perusahaan': row.nama_instansi_perusahaan,
      'Nama Penilai': row.nama_penilai,
      'Jabatan': row.jabatan,
      'Alamat Instansi': row.alamat_instansi,
      'Nomor Telepon/Email': row.nomor_telepon_email,
      'Nama Lulusan yang Dinilai': row.nama_lulusan_yang_dinilai,
      'Tahun Lulus': row.tahun_lulus,
      'Jabatan Lulusan Saat Ini': row.jabatan_lulusan_saat_ini,
      'Lama Bekerja': row.lama_bekerja,
      
      // Penilaian Kepuasan
      'Integritas (1-4)': row.integritas,
      'Keahlian Bidang Ilmu (1-4)': row.keahlian_bidang_ilmu,
      'Kemampuan Teknologi Informasi (1-4)': row.kemampuan_teknologi_informasi,
      'Kemampuan Berkomunikasi (1-4)': row.kemampuan_berkomunikasi,
      'Kemampuan Kerja Sama Tim (1-4)': row.kemampuan_kerja_sama_tim,
      'Kemampuan Berpikir Kritis (1-4)': row.kemampuan_berpikir_kritis,
      'Kreativitas dan Inovasi (1-4)': row.kreativitas_inovasi,
      'Kemampuan Adaptasi Lingkungan (1-4)': row.kemampuan_adaptasi_lingkungan,
      'Tanggung Jawab Pekerjaan (1-4)': row.tanggung_jawab_pekerjaan,
      'Kepemimpinan (1-4)': row.kepemimpinan,
      'Kemampuan Manajemen Waktu (1-4)': row.kemampuan_manajemen_waktu,
      'Kemampuan Bahasa Inggris (1-4)': row.kemampuan_bahasa_inggris,
      'Motivasi dan Etos Kerja (1-4)': row.motivasi_etos_kerja,
      'Kemampuan Analisis Keputusan (1-4)': row.kemampuan_analisis_keputusan,
      'Kinerja Keseluruhan (1-4)': row.kinerja_keseluruhan,
      
      // Kepuasan Umum
      'Kompetensi Sesuai Kebutuhan (1-4)': row.kompetensi_sesuai_kebutuhan,
      'Kemampuan Bekerja Profesional (1-4)': row.kemampuan_bekerja_profesional,
      'Kemampuan Adaptasi Budaya Kerja (1-4)': row.kemampuan_adaptasi_budaya_kerja,
      'Instansi Puas Kinerja (1-4)': row.instansi_puas_kinerja,
      
      // Masukan dan Saran
      'Kompetensi Dibutuhkan di Lingkungan': row.kompetensi_dibutuhkan_dilingkungan,
      'Kompetensi Perlu Ditingkatkan': row.kompetensi_perlu_ditingkatkan,
      'Saran Pengembangan Kurikulum': row.saran_pengembangan_kurikulum,
      'Harapan Pengguna Lulusan': row.harapan_pengguna_lulusan,
    }))

    // Create workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)
    XLSX.utils.book_append_sheet(wb, ws, 'Kepuasan Pengguna Lulusan')

    // Generate buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    // Return file
    return new NextResponse(excelBuffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="kepuasan_pengguna_lulusan_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (err) {
    console.error('Export error:', err)
    return NextResponse.json({ error: 'Gagal export data' }, { status: 500 })
  }
}
