'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TracerData {
  id: string
  created_at: string
  nim_npm: string
  nama: string
  tahun_lulus: number
  email: string
  status_saat_ini: string
  jenis_kelamin?: string
}

interface KepuasanData {
  id: string
  created_at: string
  nama_penilai: string
  nama_instansi_perusahaan: string
}

interface Analytics {
  tracer: {
    total: number
    statusDistribution: { name: string; value: number }[]
    yearDistribution: { year: string; count: number }[]
    genderDistribution: { name: string; value: number }[]
  }
  trends: {
    monthly: { month: string; total: number }[]
  }
}

interface Stats {
  tracerCount: number
  kepuasanCount: number
  analytics: Analytics
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [tracerData, setTracerData] = useState<TracerData[]>([])
  const [kepuasanData, setKepuasanData] = useState<KepuasanData[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'tracer' | 'kepuasan'>('tracer')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)

    try {
      const res = await fetch(`/api/dashboard?t=${Date.now()}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Gagal mengambil data')
      const data = await res.json()
      setTracerData(data.tracer ?? [])
      setKepuasanData(data.kepuasan ?? [])
      setStats(data.stats ?? null)
      setError('')
    } catch {
      setError('Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(() => fetchDashboardData(true), 30_000)
    return () => clearInterval(interval)
  }, [fetchDashboardData])

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string, type: 'tracer' | 'kepuasan') => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/${type}?id=${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Gagal menghapus')

      if (type === 'tracer') {
        setTracerData(prev => prev.filter(r => r.id !== id))
      } else {
        setKepuasanData(prev => prev.filter(r => r.id !== id))
      }

      await fetchDashboardData(true)
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Gagal menghapus data')
      await fetchDashboardData(true)
    } finally {
      setDeletingId(null)
    }
  }

  // ── Export ─────────────────────────────────────────────────────────────────

  const handleExport = async (type: 'tracer' | 'kepuasan') => {
    try {
      const res = await fetch(`/api/${type}/export`)
      if (!res.ok) throw new Error('Gagal export')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type === 'tracer' ? 'Tracer_Study' : 'Kepuasan_Pengguna_Lulusan'}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Gagal export data')
    }
  }

  // ── Render: Loading ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-red-200 rounded-xl p-6 text-center max-w-sm">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  // ── Render: Dashboard ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>
            {refreshing && (
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="w-3 h-3 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                Memperbarui...
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <Link href="/" className="text-sm text-slate-600 hover:text-blue-600">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ── Stats Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-500">Tracer Study Alumni</div>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857M7 20v-2a5.002 5.002 0 019.288 0" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats?.tracerCount ?? 0}</div>
            <div className="text-xs text-slate-400 mt-1">Total Responden</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-500">Kepuasan Pengguna Lulusan</div>
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats?.kepuasanCount ?? 0}</div>
            <div className="text-xs text-slate-400 mt-1">Total Responden</div>
          </div>
        </div>

        {/* ── Charts ──────────────────────────────────────────────────────── */}
        {stats?.analytics && (
          <div>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Analisis Data</h2>

            {/* Monthly Trend */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
              <h3 className="text-sm font-medium text-slate-700 mb-4">
                Tren Pengisian Formulir
                <span className="ml-2 text-xs font-normal text-slate-400">(6 Bulan Terakhir)</span>
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={stats.analytics.trends.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#3b82f6' }}
                    activeDot={{ r: 6 }}
                    name="Total Pengisian"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Status Alumni */}
              {stats.analytics.tracer.statusDistribution.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-slate-700 mb-4">Status Alumni Tracer Study</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={stats.analytics.tracer.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        outerRadius={85}
                        dataKey="value"
                      >
                        {stats.analytics.tracer.statusDistribution.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Gender Distribution Tracer */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-medium text-slate-700 mb-4">Distribusi Gender (Tracer)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.analytics.tracer.genderDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="value" name="Jumlah" radius={[4, 4, 0, 0]}>
                      {stats.analytics.tracer.genderDistribution.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Year Distribution */}
              {stats.analytics.tracer.yearDistribution.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-slate-700 mb-4">Distribusi Tahun Lulus (Tracer)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.analytics.tracer.yearDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                      <Bar dataKey="count" name="Jumlah" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── Tabs & Export ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-2">
            {(['tracer', 'kepuasan'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab === 'tracer' ? 'Tracer Study' : 'Kepuasan Pengguna Lulusan'}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleExport(activeTab)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>
        </div>

        {/* ── Data Table ───────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

          {/* Tracer Study Table */}
          {activeTab === 'tracer' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['No', 'NIM/NPM', 'Nama', 'Tahun Lulus', 'Email', 'Status', 'Tanggal', 'Aksi'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-slate-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tracerData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm">
                        Belum ada data tracer study
                      </td>
                    </tr>
                  ) : (
                    tracerData.map((row, index) => (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{row.nim_npm}</td>
                        <td className="px-4 py-3 text-slate-800">{row.nama}</td>
                        <td className="px-4 py-3 text-slate-600">{row.tahun_lulus}</td>
                        <td className="px-4 py-3 text-slate-600">{row.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                            {row.status_saat_ini}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(row.created_at)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(row.id, 'tracer')}
                            disabled={deletingId === row.id}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Hapus"
                          >
                            {deletingId === row.id ? (
                              <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Kepuasan Pengguna Lulusan Table */}
          {activeTab === 'kepuasan' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['No', 'Nama', 'instansi/perusahaan', 'Tanggal', 'Aksi'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-slate-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody> 
                  {kepuasanData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">
                        Belum ada data kepuasan pengguna lulusan
                      </td>
                    </tr>
                  ) : (
                    kepuasanData.map((row, index) => (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{row.nama_penilai}</td>
                        <td className="px-4 py-3 text-slate-600">{row.nama_instansi_perusahaan}</td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(row.created_at)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(row.id, 'kepuasan')}
                            disabled={deletingId === row.id}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Hapus"
                          >
                            {deletingId === row.id ? (
                              <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}