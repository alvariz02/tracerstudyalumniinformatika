import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tracer_study')
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
      'NIM/NPM': row.nim_npm,
      'Nama': row.nama,
      'Tahun Lulus': row.tahun_lulus,
      'No. Telepon': row.no_telpon,
      'Email': row.email,
      'NPWP': row.npwp || '-',
      'Status Saat Ini': row.status_saat_ini,
      'Sumber Dana': Array.isArray(row.sumber_dana) ? row.sumber_dana.join(', ') : row.sumber_dana,
      'Waktu Mulai Mencari Kerja': row.waktu_mulai_mencari,
      'Cara Mencari Kerja': Array.isArray(row.cara_mencari_kerja) ? row.cara_mencari_kerja.join(', ') : row.cara_mencari_kerja,
      'Jumlah Lamaran': row.jumlah_lamaran,
      'Jumlah Respons': row.jumlah_respons,
      'Jumlah Undangan Wawancara': row.jumlah_undangan_wawancara,
      'Aktif Mencari Kerja': row.aktif_mencari_kerja,
      'Alasan Tidak Sesuai': Array.isArray(row.alasan_tidak_sesuai) ? row.alasan_tidak_sesuai.join(', ') : row.alasan_tidak_sesuai || '-',
      // Kompetensi saat lulus
      'Kompetensi - Etika (Lulus)': row.komp_lulus_etika,
      'Kompetensi - Keahlian (Lulus)': row.komp_lulus_keahlian_ilmu,
      'Kompetensi - Bahasa Inggris (Lulus)': row.komp_lulus_bahasa_inggris,
      'Kompetensi - Teknologi (Lulus)': row.komp_lulus_teknologi_informasi,
      'Kompetensi - Komunikasi (Lulus)': row.komp_lulus_komunikasi,
      'Kompetensi - Kerja Sama (Lulus)': row.komp_lulus_kerja_sama_tim,
      'Kompetensi - Pengembangan (Lulus)': row.komp_lulus_pengembangan,
      // Kompetensi diperlukan pekerjaan
      'Kompetensi - Etika (Kerja)': row.komp_kerja_etika,
      'Kompetensi - Keahlian (Kerja)': row.komp_kerja_keahlian_ilmu,
      'Kompetensi - Bahasa Inggris (Kerja)': row.komp_kerja_bahasa_inggris,
      'Kompetensi - Teknologi (Kerja)': row.komp_kerja_teknologi_informasi,
      'Kompetensi - Komunikasi (Kerja)': row.komp_kerja_komunikasi,
      'Kompetensi - Kerja Sama (Kerja)': row.komp_kerja_kerja_sama_tim,
      'Kompetensi - Pengembangan (Kerja)': row.komp_kerja_pengembangan,
      // Metode pembelajaran
      'Metode - Perkuliahan': row.metode_perkuliahan,
      'Metode - Demonstrasi': row.metode_demonstrasi,
      'Metode - Proyek Riset': row.metode_proyek_riset,
      'Metode - Magang': row.metode_magang,
      'Metode - Praktikum': row.metode_praktikum,
      'Metode - Kerja Lapangan': row.metode_kerja_lapangan,
      'Metode - Diskusi': row.metode_diskusi,
    }))

    // Create workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(formattedData)

    // Set column widths
    const colWidths = [
      { wch: 36 }, // ID
      { wch: 15 }, // Tanggal
      { wch: 15 }, // NIM
      { wch: 25 }, // Nama
      { wch: 12 }, // Tahun Lulus
      { wch: 15 }, // Telepon
      { wch: 25 }, // Email
      { wch: 20 }, // NPWP
      { wch: 25 }, // Status
      { wch: 30 }, // Sumber Dana
      { wch: 25 }, // Waktu Mencari
      { wch: 40 }, // Cara Mencari
      { wch: 12 }, // Lamaran
      { wch: 12 }, // Respons
      { wch: 12 }, // Wawancara
      { wch: 25 }, // Aktif
      { wch: 40 }, // Alasan
    ]
    ws['!cols'] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, 'Tracer Study')

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    // Return as downloadable file
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=tracer_study.xlsx',
      },
    })
  } catch (err) {
    console.error('Export error:', err)
    return NextResponse.json({ error: 'Gagal export data' }, { status: 500 })
  }
}
