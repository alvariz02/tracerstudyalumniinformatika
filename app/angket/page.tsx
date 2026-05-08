'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormSection from '@/components/FormSection'
import FieldLabel from '@/components/FieldLabel'
import RatingButtons4 from '@/components/RatingButtons4'

// ─── Options ────────────────────────────────────────────────────────────────

const ANGKATAN_OPTIONS = ['2022', '2021', '2020', '2019', '2018', 'Lainnya']

const JENIS_KELAMIN_OPTIONS = ['Laki-Laki', 'Perempuan']

const RATING_LABELS = ['Sangat Baik', 'Baik', 'Cukup', 'Kurang']

// ─── Sarana Pendidikan Questions ─────────────────────────────────────────────

const SARANA_QUESTIONS = [
  { key: 'sarana_ruang_kuliah_bersih', label: 'Ruang kuliah tertata dengan bersih dan rapi' },
  { key: 'sarana_ruang_kuliah_nyaman', label: 'Ruang kuliah sejuk dan nyaman' },
  { key: 'sarana_pembelajaran_ruang', label: 'Sarana pembelajaran yang tersedia di ruang kuliah' },
  { key: 'sarana_perpustakaan_lengkap', label: 'Unipas mempunyai perpustakaan yang lengkap' },
  { key: 'sarana_laboratorium_relevan', label: 'Tersedia Laboratorium yang relevan dengan kebutuhan keilmuan bagi mahasiswa' },
  { key: 'sarana_buku_referensi', label: 'Ketersediaan buku referensi di perpustakaan Unipas' },
  { key: 'sarana_fasilitas_kamar_kecil', label: 'Ketersediaan fasilitas kamar kecil cukup dan bersih' },
  { key: 'sarana_fasilitas_ibadah', label: 'Tersedia fasilitas ibadah untuk mahasiswa di Unipas' },
]

// ─── Perlakuan pada Mahasiswa Questions ────────────────────────────────────

const PERLAKUAN_QUESTIONS = [
  { key: 'perlakuan_staf_santun', label: 'Staf administrasi akademik santun dalam memberikan pelayanan' },
  { key: 'perlakuan_dosen_pa', label: 'Permasalahan/keluhan mahasiswa ditangani oleh Unipas melalui dosen PA (Pembimbing Akademik)' },
  { key: 'perlakuan_dosen_konseling', label: 'Permasalahan/keluhan mahasiswa ditangani oleh Unipas melalui dosen bimbingan konseling' },
  { key: 'perlakuan_sanksi_adil', label: 'Sanksi bagi mahasiswa yang melanggar peraturan yang telah ditetapkan Unipas dan berlaku untuk semua mahasiswa tanpa terkecuali' },
]

// ─── Kehandalan Dosen, Staf Akademik Questions ───────────────────────────────

const KEHANDALAN_QUESTIONS = [
  { key: 'kehandalan_materi_jelas', label: 'Kejelasan materi perkuliahan diberikan dosen' },
  { key: 'kehandalan_bahan_ajar', label: 'Tersedia Bahan ajar suplemen (handout, modul, dll) yang diberikan kepada mahasiswa' },
  { key: 'kehandalan_waktu_diskusi', label: 'Dosen mengalokasikan waktu untuk diskusi dan tanya jawab' },
  { key: 'kehandalan_penilaian_objektif', label: 'Dosen mengembalikan hasil ujian/tugas dengan nilai yang objektif' },
  { key: 'kehandalan_dosen_tepat_waktu', label: 'Dosen datang tepat waktu' },
  { key: 'kehandalan_jumlah_dosen', label: 'Jumlah dosen memadai (sesuai dengan bidang dan jumlahnya)' },
  { key: 'kehandalan_kemampuan_staf', label: 'Kemampuan staf akademik untuk melayani administrasi kemahasiswaan' },
  { key: 'kehandalan_kualitas_layanan_staf', label: 'Kualitas layanan staf akademik untuk memenuhi kepentingan mahasiswa' },
]

// ─── Pemahaman terhadap Kepentingan Mahasiswa Questions ────────────────────

const PEMAHAMAN_QUESTIONS = [
  { key: 'pemahaman_kepentingan_mahasiswa', label: 'Kepedulian Unipas dalam memahami kepentingan dan kesulitan mahasiswa' },
  { key: 'pemahaman_biaya_dibicarakan', label: 'Besarnya kontribusi biaya (sumbangan pengembangan lembaga) dibicarakan dengan orang tua wali mahasiswa' },
  { key: 'pemahaman_monitoring_pa', label: 'Unipas memonitor terhadap kemajuan mahasiswa melalui dosen Pembimbing Akademik atau dosen bimbingan konseling' },
  { key: 'pemahaman_minat_bakat', label: 'Unipas berusaha memahami minat dan bakat mahasiswa dan berusaha untuk mengembangkannya' },
]

// ─── Sikap Tanggap Questions ─────────────────────────────────────────────────

const TANGGAP_QUESTIONS = [
  { key: 'tanggap_dosen_konseling', label: 'Unipas menyediakan dosen Bimbingan Konseling bagi mahasiswa' },
  { key: 'tanggap_bantuan_tidak_mampu', label: 'Unipas menyediakan bantuan (keringanan) bagi mahasiswa tidak mampu' },
  { key: 'tanggap_bantu_masalah_akademik', label: 'Unipas selalu membantu mahasiswa apabila menghadapi masalah akademik' },
  { key: 'tanggap_waktu_konsultasi_ortu', label: 'Unipas menyediakan waktu khusus untuk orang tua mahasiswa untuk konsultasi' },
]

// ─── Form state type ──────────────────────────────────────────────────────────

type FormState = {
  nama: string
  angkatan: string
  jenis_kelamin: string
  // Sarana
  sarana_ruang_kuliah_bersih: number | null
  sarana_ruang_kuliah_nyaman: number | null
  sarana_pembelajaran_ruang: number | null
  sarana_perpustakaan_lengkap: number | null
  sarana_laboratorium_relevan: number | null
  sarana_buku_referensi: number | null
  sarana_fasilitas_kamar_kecil: number | null
  sarana_fasilitas_ibadah: number | null
  // Perlakuan
  perlakuan_staf_santun: number | null
  perlakuan_dosen_pa: number | null
  perlakuan_dosen_konseling: number | null
  perlakuan_sanksi_adil: number | null
  // Kehandalan
  kehandalan_materi_jelas: number | null
  kehandalan_bahan_ajar: number | null
  kehandalan_waktu_diskusi: number | null
  kehandalan_penilaian_objektif: number | null
  kehandalan_dosen_tepat_waktu: number | null
  kehandalan_jumlah_dosen: number | null
  kehandalan_kemampuan_staf: number | null
  kehandalan_kualitas_layanan_staf: number | null
  // Pemahaman
  pemahaman_kepentingan_mahasiswa: number | null
  pemahaman_biaya_dibicarakan: number | null
  pemahaman_monitoring_pa: number | null
  pemahaman_minat_bakat: number | null
  // Tanggap
  tanggap_dosen_konseling: number | null
  tanggap_bantuan_tidak_mampu: number | null
  tanggap_bantu_masalah_akademik: number | null
  tanggap_waktu_konsultasi_ortu: number | null
  // Masukan
  masukan_layanan_akademik: string
}

const initRatings = (): Record<string, number | null> => {
  const keys = [
    ...SARANA_QUESTIONS.map(q => q.key),
    ...PERLAKUAN_QUESTIONS.map(q => q.key),
    ...KEHANDALAN_QUESTIONS.map(q => q.key),
    ...PEMAHAMAN_QUESTIONS.map(q => q.key),
    ...TANGGAP_QUESTIONS.map(q => q.key),
  ]
  return Object.fromEntries(keys.map(k => [k, null]))
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AngketForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<FormState>({
    nama: '',
    angkatan: '',
    jenis_kelamin: '',
    masukan_layanan_akademik: '',
    ...(initRatings() as Omit<FormState, 'nama' | 'angkatan' | 'jenis_kelamin' | 'masukan_layanan_akademik'>),
  })

  // ── Helpers ────────────────────────────────────────────────────────────────

  const set = (field: keyof FormState, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const validate = (): boolean => {
    const e: Record<string, string> = {}

    if (!form.nama.trim()) e.nama = 'Nama wajib diisi'
    if (!form.angkatan) e.angkatan = 'Angkatan wajib dipilih'
    if (!form.jenis_kelamin) e.jenis_kelamin = 'Jenis kelamin wajib dipilih'

    // Validate all rating questions
    SARANA_QUESTIONS.forEach(q => {
      if (!form[q.key as keyof FormState]) e[q.key] = 'Wajib diisi'
    })
    PERLAKUAN_QUESTIONS.forEach(q => {
      if (!form[q.key as keyof FormState]) e[q.key] = 'Wajib diisi'
    })
    KEHANDALAN_QUESTIONS.forEach(q => {
      if (!form[q.key as keyof FormState]) e[q.key] = 'Wajib diisi'
    })
    PEMAHAMAN_QUESTIONS.forEach(q => {
      if (!form[q.key as keyof FormState]) e[q.key] = 'Wajib diisi'
    })
    TANGGAP_QUESTIONS.forEach(q => {
      if (!form[q.key as keyof FormState]) e[q.key] = 'Wajib diisi'
    })

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        nama: form.nama.trim(),
        angkatan: form.angkatan,
        jenis_kelamin: form.jenis_kelamin,
        ...SARANA_QUESTIONS.reduce((acc, q) => ({
          ...acc,
          [q.key]: form[q.key as keyof FormState]
        }), {}),
        ...PERLAKUAN_QUESTIONS.reduce((acc, q) => ({
          ...acc,
          [q.key]: form[q.key as keyof FormState]
        }), {}),
        ...KEHANDALAN_QUESTIONS.reduce((acc, q) => ({
          ...acc,
          [q.key]: form[q.key as keyof FormState]
        }), {}),
        ...PEMAHAMAN_QUESTIONS.reduce((acc, q) => ({
          ...acc,
          [q.key]: form[q.key as keyof FormState]
        }), {}),
        ...TANGGAP_QUESTIONS.reduce((acc, q) => ({
          ...acc,
          [q.key]: form[q.key as keyof FormState]
        }), {}),
        masukan_layanan_akademik: form.masukan_layanan_akademik.trim() || null,
      }

      const res = await fetch('/api/angket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal mengirim')
      }

      router.push('/angket/success')
    } catch (err) {
      alert(`Terjadi kesalahan: ${(err as Error).message}`)
    } finally {
      setSubmitting(false)
    }
  }

  // ── UI helpers ─────────────────────────────────────────────────────────────

  const inputClass = (key: string) =>
    `w-full rounded-lg border text-sm px-3 py-2 outline-none transition-colors bg-white text-slate-800 ${
      errors[key]
        ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
        : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100'
    }`

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? <p className="mt-1 text-xs text-red-500">{errors[field]}</p> : null

  const RadioOption = ({
    name, value, label, current, onChange,
  }: { name: string; value: string; label: string; current: string; onChange: () => void }) => (
    <label
      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-sm ${
        current === value
          ? 'bg-blue-50 border-blue-200 text-blue-800'
          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={current === value}
        onChange={onChange}
        className="mt-0.5 accent-blue-600 shrink-0"
      />
      {label}
    </label>
  )

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-800">Angket Kepuasan Mahasiswa</h1>
              <p className="text-xs text-slate-500">Program Studi Teknik Informatika - Fakultas Teknik UNIPAS Morotai</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">Semua field bertanda * wajib diisi</p>
        </div>
      </div>

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <strong>Harap lengkapi semua field yang wajib diisi</strong> sebelum mengirim formulir.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

          {/* ── Data Diri ── */}
          <FormSection title="Data Diri">
            <div>
              <FieldLabel htmlFor="nama" required>Nama Lengkap</FieldLabel>
              <input
                id="nama"
                type="text"
                className={inputClass('nama')}
                placeholder="Nama lengkap mahasiswa"
                value={form.nama}
                onChange={e => set('nama', e.target.value)}
              />
              <ErrorMsg field="nama" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="angkatan" required>Angkatan</FieldLabel>
                <div className="space-y-2">
                  {ANGKATAN_OPTIONS.map(opt => (
                    <RadioOption
                      key={opt}
                      name="angkatan"
                      value={opt}
                      label={opt}
                      current={form.angkatan}
                      onChange={() => set('angkatan', opt)}
                    />
                  ))}
                </div>
                <ErrorMsg field="angkatan" />
              </div>

              <div>
                <FieldLabel htmlFor="jenis_kelamin" required>Jenis Kelamin</FieldLabel>
                <div className="space-y-2">
                  {JENIS_KELAMIN_OPTIONS.map(opt => (
                    <RadioOption
                      key={opt}
                      name="jenis_kelamin"
                      value={opt}
                      label={opt}
                      current={form.jenis_kelamin}
                      onChange={() => set('jenis_kelamin', opt)}
                    />
                  ))}
                </div>
                <ErrorMsg field="jenis_kelamin" />
              </div>
            </div>
          </FormSection>

          {/* ── Sarana Pendidikan ── */}
          <FormSection title="Sarana Pendidikan - Alat Perkuliahan, Media Pengajaran dan Prasarana Pendidikan">
            <p className="text-xs text-slate-400 -mt-2 mb-4">
              1 = Sangat Baik · 2 = Baik · 3 = Cukup · 4 = Kurang
            </p>
            <div className="space-y-5">
              {SARANA_QUESTIONS.map(q => (
                <div key={q.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {q.label} <span className="text-red-500">*</span>
                  </label>
                  <RatingButtons4
                    id={q.key}
                    value={form[q.key as keyof FormState] as number | null}
                    onChange={val => set(q.key as keyof FormState, val)}
                    labels={RATING_LABELS as [string, string, string, string]}
                  />
                  <ErrorMsg field={q.key} />
                </div>
              ))}
            </div>
          </FormSection>

          {/* ── Perlakuan pada Mahasiswa ── */}
          <FormSection title="Perlakuan pada Mahasiswa">
            <p className="text-xs text-slate-400 -mt-2 mb-4">
              1 = Sangat Baik · 2 = Baik · 3 = Cukup · 4 = Kurang
            </p>
            <div className="space-y-5">
              {PERLAKUAN_QUESTIONS.map(q => (
                <div key={q.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {q.label} <span className="text-red-500">*</span>
                  </label>
                  <RatingButtons4
                    id={q.key}
                    value={form[q.key as keyof FormState] as number | null}
                    onChange={val => set(q.key as keyof FormState, val)}
                    labels={RATING_LABELS as [string, string, string, string]}
                  />
                  <ErrorMsg field={q.key} />
                </div>
              ))}
            </div>
          </FormSection>

          {/* ── Kehandalan Dosen, Staf Akademik ── */}
          <FormSection title="Kehandalan Dosen, Staf Akademik">
            <p className="text-xs text-slate-400 -mt-2 mb-4">
              1 = Sangat Baik · 2 = Baik · 3 = Cukup · 4 = Kurang
            </p>
            <div className="space-y-5">
              {KEHANDALAN_QUESTIONS.map(q => (
                <div key={q.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {q.label} <span className="text-red-500">*</span>
                  </label>
                  <RatingButtons4
                    id={q.key}
                    value={form[q.key as keyof FormState] as number | null}
                    onChange={val => set(q.key as keyof FormState, val)}
                    labels={RATING_LABELS as [string, string, string, string]}
                  />
                  <ErrorMsg field={q.key} />
                </div>
              ))}
            </div>
          </FormSection>

          {/* ── Pemahaman terhadap Kepentingan Mahasiswa ── */}
          <FormSection title="Pemahaman terhadap Kepentingan Mahasiswa">
            <p className="text-xs text-slate-400 -mt-2 mb-4">
              1 = Sangat Baik · 2 = Baik · 3 = Cukup · 4 = Kurang
            </p>
            <div className="space-y-5">
              {PEMAHAMAN_QUESTIONS.map(q => (
                <div key={q.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {q.label} <span className="text-red-500">*</span>
                  </label>
                  <RatingButtons4
                    id={q.key}
                    value={form[q.key as keyof FormState] as number | null}
                    onChange={val => set(q.key as keyof FormState, val)}
                    labels={RATING_LABELS as [string, string, string, string]}
                  />
                  <ErrorMsg field={q.key} />
                </div>
              ))}
            </div>
          </FormSection>

          {/* ── Sikap Tanggap ── */}
          <FormSection title="Sikap Tanggap">
            <p className="text-xs text-slate-400 -mt-2 mb-4">
              1 = Sangat Baik · 2 = Baik · 3 = Cukup · 4 = Kurang
            </p>
            <div className="space-y-5">
              {TANGGAP_QUESTIONS.map(q => (
                <div key={q.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {q.label} <span className="text-red-500">*</span>
                  </label>
                  <RatingButtons4
                    id={q.key}
                    value={form[q.key as keyof FormState] as number | null}
                    onChange={val => set(q.key as keyof FormState, val)}
                    labels={RATING_LABELS as [string, string, string, string]}
                  />
                  <ErrorMsg field={q.key} />
                </div>
              ))}
            </div>
          </FormSection>

          {/* ── Masukan ── */}
          <FormSection title="Masukan Terkait Layanan Akademik">
            <div>
              <FieldLabel htmlFor="masukan_layanan_akademik">Masukan mahasiswa terkait layanan akademik</FieldLabel>
              <textarea
                id="masukan_layanan_akademik"
                rows={4}
                className={inputClass('masukan_layanan_akademik')}
                placeholder="Tuliskan saran atau masukan Anda (opsional)"
                value={form.masukan_layanan_akademik}
                onChange={e => set('masukan_layanan_akademik', e.target.value)}
              />
            </div>
          </FormSection>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white
                       font-medium py-3.5 rounded-xl transition-colors text-sm"
          >
            {submitting ? 'Mengirim...' : 'Kirim Angket'}
          </button>

        </div>
      </form>
    </div>
  )
}
