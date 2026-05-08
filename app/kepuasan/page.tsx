'use client'

import { useState } from 'react'
import Link from 'next/link'

const RATING_LABELS = ['Kurang', 'Cukup', 'Baik', 'Sangat Baik']

type FormData = {
  // Data Responden
  nama_instansi_perusahaan: string
  nama_penilai: string
  jabatan: string
  alamat_instansi: string
  nomor_telepon_email: string
  nama_lulusan_yang_dinilai: string
  tahun_lulus: string
  jabatan_lulusan_saat_ini: string
  lama_bekerja: string

  // Penilaian Kepuasan (1-4)
  integritas: number | null
  keahlian_bidang_ilmu: number | null
  kemampuan_teknologi_informasi: number | null
  kemampuan_berkomunikasi: number | null
  kemampuan_kerja_sama_tim: number | null
  kemampuan_berpikir_kritis: number | null
  kreativitas_inovasi: number | null
  kemampuan_adaptasi_lingkungan: number | null
  tanggung_jawab_pekerjaan: number | null
  kepemimpinan: number | null
  kemampuan_manajemen_waktu: number | null
  kemampuan_bahasa_inggris: number | null
  motivasi_etos_kerja: number | null
  kemampuan_analisis_keputusan: number | null
  kinerja_keseluruhan: number | null

  // Kepuasan Umum (1-4)
  kompetensi_sesuai_kebutuhan: number | null
  kemampuan_bekerja_profesional: number | null
  kemampuan_adaptasi_budaya_kerja: number | null
  instansi_puas_kinerja: number | null

  // Masukan dan Saran
  kompetensi_dibutuhkan_dilingkungan: string
  kompetensi_perlu_ditingkatkan: string
  saran_pengembangan_kurikulum: string
  harapan_pengguna_lulusan: string
}

export default function KepuasanPenggunaLulusanPage() {
  const [form, setForm] = useState<FormData>({
    // Data Responden
    nama_instansi_perusahaan: '',
    nama_penilai: '',
    jabatan: '',
    alamat_instansi: '',
    nomor_telepon_email: '',
    nama_lulusan_yang_dinilai: '',
    tahun_lulus: '',
    jabatan_lulusan_saat_ini: '',
    lama_bekerja: '',

    // Penilaian Kepuasan (null)
    integritas: null,
    keahlian_bidang_ilmu: null,
    kemampuan_teknologi_informasi: null,
    kemampuan_berkomunikasi: null,
    kemampuan_kerja_sama_tim: null,
    kemampuan_berpikir_kritis: null,
    kreativitas_inovasi: null,
    kemampuan_adaptasi_lingkungan: null,
    tanggung_jawab_pekerjaan: null,
    kepemimpinan: null,
    kemampuan_manajemen_waktu: null,
    kemampuan_bahasa_inggris: null,
    motivasi_etos_kerja: null,
    kemampuan_analisis_keputusan: null,
    kinerja_keseluruhan: null,

    // Kepuasan Umum (null)
    kompetensi_sesuai_kebutuhan: null,
    kemampuan_bekerja_profesional: null,
    kemampuan_adaptasi_budaya_kerja: null,
    instansi_puas_kinerja: null,

    // Masukan dan Saran
    kompetensi_dibutuhkan_dilingkungan: '',
    kompetensi_perlu_ditingkatkan: '',
    saran_pengembangan_kurikulum: '',
    harapan_pengguna_lulusan: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const set = (field: keyof FormData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const e: Partial<Record<keyof FormData, string>> = {}

    // Validasi data responden
    if (!form.nama_instansi_perusahaan.trim()) e.nama_instansi_perusahaan = 'Nama Instansi/Perusahaan wajib diisi'
    if (!form.nama_penilai.trim()) e.nama_penilai = 'Nama Penilai wajib diisi'
    if (!form.jabatan.trim()) e.jabatan = 'Jabatan wajib diisi'
    if (!form.alamat_instansi.trim()) e.alamat_instansi = 'Alamat Instansi wajib diisi'
    if (!form.nomor_telepon_email.trim()) e.nomor_telepon_email = 'Nomor Telepon/Email wajib diisi'
    if (!form.nama_lulusan_yang_dinilai.trim()) e.nama_lulusan_yang_dinilai = 'Nama Lulusan yang Dinilai wajib diisi'
    if (!form.tahun_lulus) e.tahun_lulus = 'Tahun Lulus wajib diisi'
    if (!form.jabatan_lulusan_saat_ini.trim()) e.jabatan_lulusan_saat_ini = 'Jabatan Lulusan Saat Ini wajib diisi'
    if (!form.lama_bekerja.trim()) e.lama_bekerja = 'Lama Bekerja wajib diisi'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/kepuasan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error('Gagal menyimpan data')

      setIsSuccess(true)
    } catch (err) {
      console.error('Submit error:', err)
      alert('Terjadi kesalahan saat menyimpan data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const ErrorMsg = ({ field }: { field: keyof FormData }) => (
    errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
  )

  const RatingButtons = ({ field, label }: { field: keyof FormData, label: string }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(val => (
          <button
            key={val}
            type="button"
            onClick={() => set(field, val)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              form[field] === val
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
      <ErrorMsg field={field} />
    </div>
  )

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-800 mb-2">Data Tersimpan!</h1>
          <p className="text-slate-600 mb-6">Terima kasih telah mengisi form Kepuasan Pengguna Lulusan.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2v2a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2-2h2a2 2 0 002 2v2a2 2 0 012-2 2z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-slate-800">Kepuasan Pengguna Lulusan</h1>
            </div>
            <Link href="/" className="text-sm text-slate-600 hover:text-blue-600">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data Responden */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">A. Identitas Penilai</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">1. Nama Instansi/Perusahaan</label>
                <input
                  type="text"
                  value={form.nama_instansi_perusahaan}
                  onChange={(e) => set('nama_instansi_perusahaan', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: PT. Contoh Perusahaan"
                />
                <ErrorMsg field="nama_instansi_perusahaan" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">2. Nama Penilai</label>
                <input
                  type="text"
                  value={form.nama_penilai}
                  onChange={(e) => set('nama_penilai', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Dr. Budi Santoso"
                />
                <ErrorMsg field="nama_penilai" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">3. Jabatan</label>
                <input
                  type="text"
                  value={form.jabatan}
                  onChange={(e) => set('jabatan', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: HR Manager"
                />
                <ErrorMsg field="jabatan" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">4. Alamat Instansi</label>
                <textarea
                  value={form.alamat_instansi}
                  onChange={(e) => set('alamat_instansi', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Jl. Contoh No. 123, Jakarta"
                />
                <ErrorMsg field="alamat_instansi" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">5. Nomor Telepon/Email</label>
                <input
                  type="text"
                  value={form.nomor_telepon_email}
                  onChange={(e) => set('nomor_telepon_email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 08123456789 atau email@contoh.com"
                />
                <ErrorMsg field="nomor_telepon_email" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">6. Nama Lulusan yang Dinilai</label>
                <input
                  type="text"
                  value={form.nama_lulusan_yang_dinilai}
                  onChange={(e) => set('nama_lulusan_yang_dinilai', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Ahmad Rizki"
                />
                <ErrorMsg field="nama_lulusan_yang_dinilai" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">7. Tahun Lulus</label>
                <input
                  type="number"
                  value={form.tahun_lulus}
                  onChange={(e) => set('tahun_lulus', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 2020"
                  min="2018"
                  max="2030"
                />
                <ErrorMsg field="tahun_lulus" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">9. Jabatan Lulusan Saat Ini</label>
                <input
                  type="text"
                  value={form.jabatan_lulusan_saat_ini}
                  onChange={(e) => set('jabatan_lulusan_saat_ini', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Software Engineer"
                />
                <ErrorMsg field="jabatan_lulusan_saat_ini" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">10. Lama Bekerja</label>
                <input
                  type="text"
                  value={form.lama_bekerja}
                  onChange={(e) => set('lama_bekerja', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 2 tahun"
                />
                <ErrorMsg field="lama_bekerja" />
              </div>
            </div>
          </div>

          {/* Penilaian Kepuasan */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">B. Penilaian Kepuasan</h2>
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Skala Penilaian:</p>
              <div className="flex gap-4 justify-center">
                {[1, 2, 3, 4].map(val => (
                  <div key={val} className="text-center">
                    <div className="font-semibold text-slate-800">{val}</div>
                    <div className="text-xs text-slate-500">{RATING_LABELS[val - 1]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RatingButtons field="integritas" label="1. Integritas (etika, moral, disiplin, kejujuran)" />
              <RatingButtons field="keahlian_bidang_ilmu" label="2. Keahlian sesuai bidang ilmu" />
              <RatingButtons field="kemampuan_teknologi_informasi" label="3. Kemampuan penggunaan teknologi informasi" />
              <RatingButtons field="kemampuan_berkomunikasi" label="4. Kemampuan berkomunikasi" />
              <RatingButtons field="kemampuan_kerja_sama_tim" label="5. Kemampuan bekerja sama dalam tim" />
              <RatingButtons field="kemampuan_berpikir_kritis" label="6. Kemampuan berpikir kritis dan pemecahan masalah" />
              <RatingButtons field="kreativitas_inovasi" label="7. Kreativitas dan inovasi" />
              <RatingButtons field="kemampuan_adaptasi_lingkungan" label="8. Kemampuan adaptasi terhadap lingkungan kerja" />
              <RatingButtons field="tanggung_jawab_pekerjaan" label="9. Tanggung jawab dalam pekerjaan" />
              <RatingButtons field="kepemimpinan" label="10. Kepemimpinan" />
              <RatingButtons field="kemampuan_manajemen_waktu" label="11. Kemampuan manajemen waktu" />
              <RatingButtons field="kemampuan_bahasa_inggris" label="12. Kemampuan berbahasa inggris" />
              <RatingButtons field="motivasi_etos_kerja" label="13. Motivasi dan etos kerja" />
              <RatingButtons field="kemampuan_analisis_keputusan" label="14. Kemampuan analisis dan pengambilan keputusan" />
              <RatingButtons field="kinerja_keseluruhan" label="15. Kinerja secara keseluruhan" />
            </div>
          </div>

          {/* Kepuasan Umum */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">C. Kepuasan Umum</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RatingButtons field="kompetensi_sesuai_kebutuhan" label="1. Lulusan memiliki kompetensi sesuai kebutuhan instansi/perusahaan" />
              <RatingButtons field="kemampuan_bekerja_profesional" label="2. Lulusan mampu bekerja secara profesional" />
              <RatingButtons field="kemampuan_adaptasi_budaya_kerja" label="3. Lulusan mudah beradaptasi dengan budaya kerja" />
              <RatingButtons field="instansi_puas_kinerja" label="4. Secara umum instansi/perusahaan puas terhadap kinerja lulusan" />
            </div>
          </div>

          {/* Masukan dan Saran */}
          <div className="bg-white border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">D. Masukan dan Saran</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">1. Kompetensi lulusan yang dibutuhkan di lingkungan kerja?</label>
                <textarea
                  value={form.kompetensi_dibutuhkan_dilingkungan}
                  onChange={(e) => set('kompetensi_dibutuhkan_dilingkungan', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jelaskan kompetensi yang dibutuhkan..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">2. Kompetensi apa yang perlu ditingkatkan oleh lulusan?</label>
                <textarea
                  value={form.kompetensi_perlu_ditingkatkan}
                  onChange={(e) => set('kompetensi_perlu_ditingkatkan', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jelaskan kompetensi yang perlu ditingkatkan..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">3. Saran untuk pengembangan kurikulum dan mata kuliah Program Studi:</label>
                <textarea
                  value={form.saran_pengembangan_kurikulum}
                  onChange={(e) => set('saran_pengembangan_kurikulum', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Berikan saran untuk pengembangan kurikulum..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">4. Harapan pengguna terhadap lulusan:</label>
                <textarea
                  value={form.harapan_pengguna_lulusan}
                  onChange={(e) => set('harapan_pengguna_lulusan', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Berikan harapan terhadap lulusan..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Simpan Data</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
