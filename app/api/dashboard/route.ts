import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

type KeyCount = { label: string; count: number }

type DashboardAnalytics = {
  tracer: {
    total: number
    topStatuses: Array<{ status: string; count: number }>
  }
  angket: {
    total: number
    averageSatisfaction?: number | null
  }
}

export async function GET() {
  try {
    // Helpful logs (do NOT print secrets)
    const supabaseKeyIsServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) // best-effort
    console.log('Dashboard API - Using service role key (best-effort):', supabaseKeyIsServiceRole)

    // Fetch tracer study data (deterministic ordering)
    const { data: tracerData, error: tracerError } = await supabase
      .from('tracer_study')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })

    if (tracerError) {
      console.error('Tracer fetch error:', tracerError)
      return NextResponse.json({ error: 'Gagal mengambil data tracer', details: tracerError }, { status: 500 })
    }

    console.log('Raw tracerData from Supabase:', tracerData?.length, tracerData)

    // Fetch angket kepuasan data (deterministic ordering)
    const { data: angketData, error: angketError } = await supabase
      .from('angket_kepuasan')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })

    if (angketError) {
      console.error('Angket fetch error:', angketError)
      return NextResponse.json({ error: 'Gagal mengambil data angket' }, { status: 500 })
    }

    // Calculate statistics for angket kepuasan
    const angketStats = calculateAngketStats(angketData || [])

    console.log('Dashboard API - Tracer count:', tracerData?.length)
    console.log('Dashboard API - Angket count:', angketData?.length)
    console.log('Dashboard API - First tracer:', tracerData?.[0]?.nama)
    console.log('Dashboard API - Second tracer:', tracerData?.[1]?.nama)

    // Previously missing: calculateAnalytics
    const analytics = calculateAnalytics(tracerData || [], angketData || [])

    return NextResponse.json({
      tracer: tracerData || [],
      angket: angketData || [],
      stats: {
        tracerCount: tracerData?.length || 0,
        angketCount: angketData?.length || 0,
        angketStats,
        analytics,
      },
    })
  } catch (err) {
    console.error('Dashboard API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function calculateAngketStats(data: any[]) {
  if (data.length === 0) return null

  const saranaKeys = [
    'sarana_ruang_kuliah_bersih',
    'sarana_ruang_kuliah_nyaman',
    'sarana_pembelajaran_ruang',
    'sarana_perpustakaan_lengkap',
    'sarana_laboratorium_relevan',
    'sarana_buku_referensi',
    'sarana_fasilitas_kamar_kecil',
    'sarana_fasilitas_ibadah',
  ]

  const perlakuanKeys = [
    'perlakuan_staf_santun',
    'perlakuan_dosen_pa',
    'perlakuan_dosen_konseling',
    'perlakuan_sanksi_adil',
  ]

  const kehandalanKeys = [
    'kehandalan_materi_jelas',
    'kehandalan_bahan_ajar',
    'kehandalan_waktu_diskusi',
    'kehandalan_penilaian_objektif',
    'kehandalan_dosen_tepat_waktu',
    'kehandalan_jumlah_dosen',
    'kehandalan_kemampuan_staf',
    'kehandalan_kualitas_layanan_staf',
  ]

  const pemahamanKeys = [
    'pemahaman_kepentingan_mahasiswa',
    'pemahaman_biaya_dibicarakan',
    'pemahaman_monitoring_pa',
    'pemahaman_minat_bakat',
  ]

  const tanggapKeys = [
    'tanggap_dosen_konseling',
    'tanggap_bantuan_tidak_mampu',
    'tanggap_bantu_masalah_akademik',
    'tanggap_waktu_konsultasi_ortu',
  ]

  const calcAverage = (keys: string[]) => {
    const sum = data.reduce((acc, row) => {
      return acc + keys.reduce((keyAcc, key) => keyAcc + (row[key] || 0), 0)
    }, 0)
    return Number((sum / (data.length * keys.length)).toFixed(2))
  }

  return {
    sarana: calcAverage(saranaKeys),
    perlakuan: calcAverage(perlakuanKeys),
    kehandalan: calcAverage(kehandalanKeys),
    pemahaman: calcAverage(pemahamanKeys),
    tanggap: calcAverage(tanggapKeys),
  }
}

function calculateAnalytics(tracerData: any[], angketData: any[]) {
  // Tracer Analytics
  const tracerTotal = tracerData.length

  // Status distribution
  const statusCounts = new Map<string, number>()
  for (const row of tracerData) {
    const status = row?.status_saat_ini
    if (!status) continue
    statusCounts.set(status, (statusCounts.get(status) || 0) + 1)
  }
  const statusDistribution = Array.from(statusCounts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Year distribution
  const yearCounts = new Map<number, number>()
  for (const row of tracerData) {
    const year = row?.tahun_lulus
    if (!year) continue
    yearCounts.set(year, (yearCounts.get(year) || 0) + 1)
  }
  const yearDistribution = Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year: String(year), count }))
    .sort((a, b) => a.year.localeCompare(b.year))

  // Gender distribution for tracer
  const tracerGenderCounts = { 'Laki-Laki': 0, 'Perempuan': 0 }
  for (const row of tracerData) {
    const gender = row?.jenis_kelamin
    if (gender === 'Laki-Laki') tracerGenderCounts['Laki-Laki']++
    else if (gender === 'Perempuan') tracerGenderCounts['Perempuan']++
  }

  // Angket Analytics
  const angketTotal = angketData.length

  // Angkatan distribution
  const angkatanCounts = new Map<string, number>()
  for (const row of angketData) {
    const angkatan = row?.angkatan
    if (!angkatan) continue
    angkatanCounts.set(angkatan, (angkatanCounts.get(angkatan) || 0) + 1)
  }
  const angkatanDistribution = Array.from(angkatanCounts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Gender distribution for angket
  const angketGenderCounts = { 'Laki-Laki': 0, 'Perempuan': 0 }
  for (const row of angketData) {
    const gender = row?.jenis_kelamin
    if (gender === 'Laki-Laki') angketGenderCounts['Laki-Laki']++
    else if (gender === 'Perempuan') angketGenderCounts['Perempuan']++
  }

  // Monthly submission trends (last 6 months)
  const monthlyCounts = new Map<string, number>()
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthlyCounts.set(key, 0)
  }

  for (const row of [...tracerData, ...angketData]) {
    const date = row?.created_at ? new Date(row.created_at) : null
    if (!date) continue
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (monthlyCounts.has(key)) {
      monthlyCounts.set(key, (monthlyCounts.get(key) || 0) + 1)
    }
  }
  const monthlyTrend = Array.from(monthlyCounts.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month))

  return {
    tracer: {
      total: tracerTotal,
      statusDistribution,
      yearDistribution,
      genderDistribution: [
        { name: 'Laki-Laki', value: tracerGenderCounts['Laki-Laki'] },
        { name: 'Perempuan', value: tracerGenderCounts['Perempuan'] },
      ],
    },
    angket: {
      total: angketTotal,
      angkatanDistribution,
      genderDistribution: [
        { name: 'Laki-Laki', value: angketGenderCounts['Laki-Laki'] },
        { name: 'Perempuan', value: angketGenderCounts['Perempuan'] },
      ],
    },
    trends: {
      monthly: monthlyTrend,
    },
  }
}

