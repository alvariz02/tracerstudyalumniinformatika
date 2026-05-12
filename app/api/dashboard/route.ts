import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Fetch tracer study data
    const { data: tracerData, error: tracerError } = await supabase
      .from('tracer_study')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })

    if (tracerError) {
      console.error('Tracer fetch error:', tracerError)
      return NextResponse.json(
        { error: 'Gagal mengambil data tracer', details: tracerError },
        { status: 500 }
      )
    }

    // Fetch kepuasan pengguna lulusan data
    const { data: kepuasanData, error: kepuasanError } = await supabase
      .from('kepuasan_pengguna_lulusan')
      .select('*')
      .order('created_at', { ascending: false })

    if (kepuasanError) {
      console.error('Kepuasan fetch error:', kepuasanError)
      return NextResponse.json(
        { error: 'Gagal mengambil data kepuasan', details: kepuasanError },
        { status: 500 }
      )
    }

    const tracerCount = tracerData?.length ?? 0
    const kepuasanCount = kepuasanData?.length ?? 0
    const analytics = calculateAnalytics(tracerData ?? [])

    return NextResponse.json(
      {
        tracer: tracerData ?? [],
        kepuasan: kepuasanData ?? [],
        stats: {
          tracerCount,
          kepuasanCount,
          analytics,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
        },
      }
    )
  } catch (err) {
    console.error('Dashboard API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function calculateAnalytics(tracerData: any[]) {
  // ── Status distribution ─────────────────────────────────
  const statusCounts = new Map<string, number>()
  const yearCounts = new Map<number, number>()
  const tracerGenderCounts: Record<string, number> = { 'Laki-Laki': 0, Perempuan: 0 }

  for (const row of tracerData) {
    if (row?.status_saat_ini) {
      statusCounts.set(row.status_saat_ini, (statusCounts.get(row.status_saat_ini) ?? 0) + 1)
    }
    if (row?.tahun_lulus) {
      yearCounts.set(row.tahun_lulus, (yearCounts.get(row.tahun_lulus) ?? 0) + 1)
    }
    if (row?.jenis_kelamin === 'Laki-Laki') tracerGenderCounts['Laki-Laki']++
    else if (row?.jenis_kelamin === 'Perempuan') tracerGenderCounts['Perempuan']++
  }

  const statusDistribution = Array.from(statusCounts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const yearDistribution = Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year: String(year), count }))
    .sort((a, b) => a.year.localeCompare(b.year))

  // ── Monthly trend (6 bulan terakhir) ───────────────────
  const monthlyCounts = new Map<string, number>()
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthlyCounts.set(key, 0)
  }
  for (const row of tracerData) {
    if (!row?.created_at) continue
    const d = new Date(row.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (monthlyCounts.has(key)) {
      monthlyCounts.set(key, (monthlyCounts.get(key) ?? 0) + 1)
    }
  }
  const monthlyTrend = Array.from(monthlyCounts.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month))

  return {
    tracer: {
      total: tracerData.length,
      statusDistribution,
      yearDistribution,
      genderDistribution: [
        { name: 'Laki-Laki', value: tracerGenderCounts['Laki-Laki'] },
        { name: 'Perempuan', value: tracerGenderCounts['Perempuan'] },
      ],
    },
    trends: { monthly: monthlyTrend },
  }
}