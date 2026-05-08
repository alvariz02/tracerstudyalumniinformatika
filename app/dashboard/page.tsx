'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'

interface TracerData {
  id: string
  created_at: string
  nim_npm: string
  nama: string
  tahun_lulus: number
  email: string
  status_saat_ini: string
}

interface AngketData {
  id: string
  created_at: string
  nama: string
  angkatan: string
  jenis_kelamin: string
}

interface Stats {
  tracerCount: number
  angketCount: number
  angketStats: {
    sarana: number
    perlakuan: number
    kehandalan: number
    pemahaman: number
    tanggap: number
  } | null
  analytics: {
    tracer: {
      total: number
      statusDistribution: { name: string; value: number }[]
      yearDistribution: { year: string; count: number }[]
      genderDistribution: { name: string; value: number }[]
    }
    angket: {
      total: number
      angkatanDistribution: { name: string; value: number }[]
      genderDistribution: { name: string; value: number }[]
    }
    trends: {
      monthly: { month: string; total: number }[]
    }
  }
}

export default function Dashboard() {
  const [tracerData, setTracerData] = useState<TracerData[]>([])
  const [angketData, setAngketData] = useState<AngketData[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'tracer' | 'angket'>('tracer')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (!res.ok) throw new Error('Gagal mengambil data')
      const data = await res.json()
      setTracerData(data.tracer)
      setAngketData(data.angket)
      setStats(data.stats)
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Memuat data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleDelete = async (id: string, type: 'tracer' | 'angket') => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return

    try {
      const res = await fetch(`/api/${type}?id=${id}`, { method: 'DELETE' })
      const result = await res.json()

      if (!res.ok) {
        console.error('Delete error:', result)
        throw new Error(result.error || 'Gagal menghapus')
      }

      // Update state dan refresh halaman untuk memastikan data terhapus
      if (type === 'tracer') {
        setTracerData(prev => prev.filter(row => row.id !== id))
      } else {
        setAngketData(prev => prev.filter(row => row.id !== id))
      }
      
      // Force reload untuk memastikan data sync dengan database
      window.location.reload()

      console.log('Delete success:', result)

    } catch (err) {
      console.error('Delete failed:', err)
      alert('Gagal menghapus data')
    }
  }

  const handleExport = async (type: 'tracer' | 'angket') => {
    try {
      const res = await fetch(`/api/${type}/export`)
      if (!res.ok) throw new Error('Gagal export')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}_study.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Gagal export data')
    }
  }

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
          </div>
          <Link href="/" className="text-sm text-slate-600 hover:text-blue-600">
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-sm text-slate-500 mb-1">Tracer Study Alumni</div>
            <div className="text-2xl font-bold text-slate-800">{stats?.tracerCount || 0}</div>
            <div className="text-xs text-slate-400 mt-1">Responden</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-sm text-slate-500 mb-1">Angket Kepuasan Mahasiswa</div>
            <div className="text-2xl font-bold text-slate-800">{stats?.angketCount || 0}</div>
            <div className="text-xs text-slate-400 mt-1">Responden</div>
          </div>
        </div>

        {/* Angket Stats */}
        {stats?.angketStats && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Rata-rata Rating Angket Kepuasan (1-4)</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{stats.angketStats.sarana}</div>
                <div className="text-xs text-slate-500">Sarana Pendidikan</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{stats.angketStats.perlakuan}</div>
                <div className="text-xs text-slate-500">Perlakuan Mahasiswa</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{stats.angketStats.kehandalan}</div>
                <div className="text-xs text-slate-500">Kehandalan Dosen</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{stats.angketStats.pemahaman}</div>
                <div className="text-xs text-slate-500">Pemahaman Kepentingan</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{stats.angketStats.tanggap}</div>
                <div className="text-xs text-slate-500">Sikap Tanggap</div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Charts */}
        {stats?.analytics && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Analisis Data</h2>

            {/* Monthly Trends */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
              <h3 className="text-sm font-medium text-slate-700 mb-4">Tren Pengisian Formulir (6 Bulan Terakhir)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.analytics.trends.monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Tracer Status Distribution */}
              {stats.analytics.tracer.statusDistribution.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-slate-700 mb-4">Status Alumni Tracer Study</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={stats.analytics.tracer.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.analytics.tracer.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Gender Distribution Comparison */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-medium text-slate-700 mb-4">Distribusi Gender</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { name: 'Tracer - Laki-Laki', value: stats.analytics.tracer.genderDistribution[0]?.value || 0 },
                    { name: 'Tracer - Perempuan', value: stats.analytics.tracer.genderDistribution[1]?.value || 0 },
                    { name: 'Angket - Laki-Laki', value: stats.analytics.angket.genderDistribution[0]?.value || 0 },
                    { name: 'Angket - Perempuan', value: stats.analytics.angket.genderDistribution[1]?.value || 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{fontSize: 10}} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Angkatan Distribution */}
              {stats.analytics.angket.angkatanDistribution.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-slate-700 mb-4">Distribusi Angkatan (Angket)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.analytics.angket.angkatanDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Year Distribution for Tracer */}
              {stats.analytics.tracer.yearDistribution.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-slate-700 mb-4">Distribusi Tahun Lulus (Tracer)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.analytics.tracer.yearDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs & Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('tracer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'tracer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tracer Study
            </button>
            <button
              onClick={() => setActiveTab('angket')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'angket'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Angket Kepuasan
            </button>
          </div>

          <button
            onClick={() => handleExport(activeTab)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {activeTab === 'tracer' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">No</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">NIM/NPM</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Nama</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Tahun Lulus</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Tanggal</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tracerData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                        Belum ada data
                      </td>
                    </tr>
                  ) : (
                    tracerData.map((row, index) => (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                        <td className="px-4 py-3 text-slate-800">{row.nim_npm}</td>
                        <td className="px-4 py-3 text-slate-800">{row.nama}</td>
                        <td className="px-4 py-3 text-slate-600">{row.tahun_lulus}</td>
                        <td className="px-4 py-3 text-slate-600">{row.email}</td>
                        <td className="px-4 py-3 text-slate-600">{row.status_saat_ini}</td>
                        <td className="px-4 py-3 text-slate-500">{formatDate(row.created_at)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(row.id, 'tracer')}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Hapus"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">No</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Nama</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Angkatan</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Jenis Kelamin</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Tanggal Submit</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {angketData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        Belum ada data
                      </td>
                    </tr>
                  ) : (
                    angketData.map((row, index) => (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                        <td className="px-4 py-3 text-slate-800">{row.nama}</td>
                        <td className="px-4 py-3 text-slate-600">{row.angkatan}</td>
                        <td className="px-4 py-3 text-slate-600">{row.jenis_kelamin}</td>
                        <td className="px-4 py-3 text-slate-500">{formatDate(row.created_at)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(row.id, 'angket')}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Hapus"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
