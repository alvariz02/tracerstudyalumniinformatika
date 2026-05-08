'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormSection from '@/components/FormSection'
import FieldLabel from '@/components/FieldLabel'
import CompetencyTable from '@/components/CompetencyTable'
import type {
  StatusSaatIni, SumberDana, WaktuMencariKerja,
  CaraMencariKerja, AktifMencariKerja, AlasanTidakSesuai,
} from '@/types/tracer'

// ─── Option lists ─────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: StatusSaatIni; label: string }[] = [
  { value: 'bekerja_fulltime_parttime', label: 'Bekerja (full time / part time)' },
  { value: 'belum_memungkinkan_bekerja', label: 'Belum memungkinkan bekerja' },
  { value: 'wiraswasta', label: 'Wiraswasta' },
  { value: 'melanjutkan_pendidikan', label: 'Melanjutkan pendidikan' },
  { value: 'tidak_kerja_mencari_kerja', label: 'Tidak kerja tetapi sedang mencari kerja' },
]

const DANA_OPTIONS: { value: SumberDana; label: string }[] = [
  { value: 'biaya_sendiri_keluarga', label: 'Biaya Sendiri / Keluarga' },
  { value: 'beasiswa_adik', label: 'Beasiswa ADIK' },
  { value: 'beasiswa_bidikmisi', label: 'Beasiswa BIDIKMISI' },
  { value: 'beasiswa_ppa', label: 'Beasiswa PPA' },
  { value: 'beasiswa_afirmasi', label: 'Beasiswa Afirmasi' },
  { value: 'beasiswa_perusahaan_swasta', label: 'Beasiswa Perusahaan / Swasta' },
  { value: 'lainnya', label: 'Lainnya' },
]

const WAKTU_OPTIONS: { value: WaktuMencariKerja; label: string }[] = [
  { value: '6_bulan_sebelum_lulus', label: '6 bulan sebelum lulus' },
  { value: '3_bulan_sebelum_lulus', label: '3 bulan sebelum lulus' },
  { value: '1_bulan_sebelum_lulus', label: '1 bulan sebelum lulus' },
  { value: 'saat_lulus', label: 'Saat lulus' },
  { value: '1_3_bulan_setelah_lulus', label: '1–3 bulan setelah lulus' },
  { value: '4_6_bulan_setelah_lulus', label: '4–6 bulan setelah lulus' },
  { value: 'lebih_6_bulan_setelah_lulus', label: 'Lebih dari 6 bulan setelah lulus' },
]

const CARA_OPTIONS: { value: CaraMencariKerja; label: string }[] = [
  { value: 'iklan_koran_majalah', label: 'Iklan koran / majalah / brosur' },
  { value: 'melamar_tanpa_lowongan', label: 'Melamar tanpa mengetahui lowongan' },
  { value: 'bursa_pameran_kerja', label: 'Pergi ke bursa / pameran kerja' },
  { value: 'internet_online', label: 'Internet / iklan online / milis' },
  { value: 'dihubungi_perusahaan', label: 'Dihubungi oleh perusahaan' },
  { value: 'menghubungi_kemenakertrans', label: 'Menghubungi Kemenakertrans' },
  { value: 'agen_tenaga_kerja', label: 'Agen tenaga kerja komersial / swasta' },
  { value: 'pusat_karir_kampus', label: 'Pusat pengembangan karir kampus' },
  { value: 'kantor_kemahasiswaan_alumni', label: 'Kantor kemahasiswaan / alumni' },
  { value: 'networking_kuliah', label: 'Membangun jejaring sejak kuliah' },
  { value: 'relasi', label: 'Melalui relasi (dosen, orang tua, teman, dll.)' },
  { value: 'bisnis_sendiri', label: 'Membangun bisnis sendiri' },
  { value: 'penempatan_magang', label: 'Penempatan kerja / magang' },
  { value: 'tempat_kerja_sama_kuliah', label: 'Tempat kerja yang sama saat kuliah' },
  { value: 'lainnya', label: 'Lainnya' },
]

const AKTIF_OPTIONS: { value: AktifMencariKerja; label: string }[] = [
  { value: 'tidak', label: 'Tidak' },
  { value: 'tidak_menunggu_hasil', label: 'Tidak, tapi sedang menunggu hasil lamaran' },
  { value: 'ya_mulai_2minggu', label: 'Ya, akan mulai bekerja dalam 2 minggu ke depan' },
  { value: 'ya_belum_pasti', label: 'Ya, tapi belum pasti bekerja dalam 2 minggu ke depan' },
  { value: 'lainnya', label: 'Lainnya' },
]

const ALASAN_OPTIONS: { value: AlasanTidakSesuai; label: string }[] = [
  { value: 'sudah_sesuai', label: 'Pekerjaan saya sudah sesuai dengan pendidikan' },
  { value: 'belum_dapat_sesuai', label: 'Belum mendapatkan pekerjaan yang lebih sesuai' },
  { value: 'prospek_karir_baik', label: 'Prospek karir yang baik di pekerjaan ini' },
  { value: 'suka_bidang_berbeda', label: 'Lebih suka bekerja di bidang yang berbeda' },
  { value: 'dipromosikan_kurang_sesuai', label: 'Dipromosikan ke posisi yang kurang berhubungan' },
  { value: 'pendapatan_lebih_tinggi', label: 'Pendapatan lebih tinggi di pekerjaan ini' },
  { value: 'pekerjaan_lebih_aman', label: 'Pekerjaan lebih aman / terjamin' },
  { value: 'pekerjaan_lebih_menarik', label: 'Pekerjaan lebih menarik' },
  { value: 'jadwal_fleksibel', label: 'Jadwal lebih fleksibel / memungkinkan pekerjaan tambahan' },
  { value: 'lokasi_dekat_rumah', label: 'Lokasi lebih dekat dari rumah' },
  { value: 'jamin_keluarga', label: 'Lebih menjamin kebutuhan keluarga' },
  { value: 'harus_terima_di_awal_karir', label: 'Harus menerima pekerjaan yang ada di awal karir' },
  { value: 'lainnya', label: 'Lainnya' },
]

const KOMP_ROWS = [
  { key: 'etika', label: 'Etika' },
  { key: 'keahlian_ilmu', label: 'Keahlian berdasarkan bidang ilmu' },
  { key: 'bahasa_inggris', label: 'Bahasa Inggris' },
  { key: 'teknologi_informasi', label: 'Penggunaan Teknologi Informasi' },
  { key: 'komunikasi', label: 'Komunikasi' },
  { key: 'kerja_sama_tim', label: 'Kerja sama tim' },
  { key: 'pengembangan', label: 'Pengembangan diri' },
]

const METODE_ROWS = [
  { key: 'perkuliahan', label: 'Perkuliahan' },
  { key: 'demonstrasi', label: 'Demonstrasi' },
  { key: 'proyek_riset', label: 'Partisipasi proyek riset' },
  { key: 'magang', label: 'Magang' },
  { key: 'praktikum', label: 'Praktikum' },
  { key: 'kerja_lapangan', label: 'Kerja lapangan' },
  { key: 'diskusi', label: 'Diskusi' },
]

// ─── Form state type ──────────────────────────────────────────────────────────

type FormState = {
  nim_npm: string
  nama: string
  tahun_lulus: string
  no_telpon: string
  email: string
  npwp: string
  status_saat_ini: StatusSaatIni | ''
  sumber_dana: SumberDana[]
  komp_lulus: Record<string, number | null>
  komp_kerja: Record<string, number | null>
  metode: Record<string, number | null>
  waktu_mulai_mencari: WaktuMencariKerja | ''
  cara_mencari_kerja: CaraMencariKerja[]
  jumlah_lamaran: string
  jumlah_respons: string
  jumlah_undangan_wawancara: string
  aktif_mencari_kerja: AktifMencariKerja | ''
  alasan_tidak_sesuai: AlasanTidakSesuai[]
}

const initRatings = (keys: string[]) =>
  Object.fromEntries(keys.map((k) => [k, null])) as Record<string, number | null>

// ─── Component ────────────────────────────────────────────────────────────────

export default function TracerForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<FormState>({
    nim_npm: '',
    nama: '',
    tahun_lulus: '',
    no_telpon: '',
    email: '',
    npwp: '',
    status_saat_ini: '',
    sumber_dana: [],
    komp_lulus: initRatings(KOMP_ROWS.map((r) => r.key)),
    komp_kerja: initRatings(KOMP_ROWS.map((r) => r.key)),
    metode: initRatings(METODE_ROWS.map((r) => r.key)),
    waktu_mulai_mencari: '',
    cara_mencari_kerja: [],
    jumlah_lamaran: '',
    jumlah_respons: '',
    jumlah_undangan_wawancara: '',
    aktif_mencari_kerja: '',
    alasan_tidak_sesuai: [],
  })

  // ── Helpers ────────────────────────────────────────────────────────────────

  const set = (field: keyof FormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const toggleArray = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]

  const validate = (): boolean => {
    const e: Record<string, string> = {}

    if (!form.nim_npm.trim()) e.nim_npm = 'NIM/NPM wajib diisi'
    if (!form.nama.trim()) e.nama = 'Nama wajib diisi'
    if (!form.tahun_lulus) e.tahun_lulus = 'Tahun lulus wajib dipilih'
    if (!form.no_telpon.trim()) e.no_telpon = 'No. telepon wajib diisi'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email tidak valid'
    if (!form.status_saat_ini) e.status_saat_ini = 'Status wajib dipilih'
    if (form.sumber_dana.length === 0) e.sumber_dana = 'Pilih minimal satu sumber dana'

    KOMP_ROWS.forEach((r) => {
      if (!form.komp_lulus[r.key]) e[`komp_lulus_${r.key}`] = 'Wajib diisi'
      if (!form.komp_kerja[r.key]) e[`komp_kerja_${r.key}`] = 'Wajib diisi'
    })
    METODE_ROWS.forEach((r) => {
      if (!form.metode[r.key]) e[`metode_${r.key}`] = 'Wajib diisi'
    })

    if (!form.waktu_mulai_mencari) e.waktu_mulai_mencari = 'Wajib dipilih'
    if (form.cara_mencari_kerja.length === 0) e.cara_mencari_kerja = 'Pilih minimal satu cara'
    if (!form.jumlah_lamaran) e.jumlah_lamaran = 'Wajib diisi'
    if (!form.jumlah_respons) e.jumlah_respons = 'Wajib diisi'
    if (!form.jumlah_undangan_wawancara) e.jumlah_undangan_wawancara = 'Wajib diisi'
    if (!form.aktif_mencari_kerja) e.aktif_mencari_kerja = 'Wajib dipilih'

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
        nim_npm: form.nim_npm.trim(),
        nama: form.nama.trim(),
        tahun_lulus: Number(form.tahun_lulus),
        no_telpon: form.no_telpon.trim(),
        email: form.email.trim(),
        npwp: form.npwp.trim() || null,
        status_saat_ini: form.status_saat_ini,
        sumber_dana: form.sumber_dana,
        // Flatten competency ratings
        ...Object.fromEntries(
          KOMP_ROWS.map((r) => [`komp_lulus_${r.key}`, form.komp_lulus[r.key]])
        ),
        ...Object.fromEntries(
          KOMP_ROWS.map((r) => [`komp_kerja_${r.key}`, form.komp_kerja[r.key]])
        ),
        ...Object.fromEntries(
          METODE_ROWS.map((r) => [`metode_${r.key}`, form.metode[r.key]])
        ),
        waktu_mulai_mencari: form.waktu_mulai_mencari,
        cara_mencari_kerja: form.cara_mencari_kerja,
        jumlah_lamaran: Number(form.jumlah_lamaran),
        jumlah_respons: Number(form.jumlah_respons),
        jumlah_undangan_wawancara: Number(form.jumlah_undangan_wawancara),
        aktif_mencari_kerja: form.aktif_mencari_kerja,
        alasan_tidak_sesuai: form.alasan_tidak_sesuai,
      }

      const res = await fetch('/api/tracer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal mengirim')
      }

      router.push('/tracer/success')
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
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    ) : null

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

  const CheckOption = ({
    value, label, checked, onChange,
  }: { value: string; label: string; checked: boolean; onChange: () => void }) => (
    <label
      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-sm ${
        checked
          ? 'bg-blue-50 border-blue-200 text-blue-800'
          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
      }`}
    >
      <input
        type="checkbox"
        value={value}
        checked={checked}
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
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-800">Tracer Study Alumni</h1>
            <p className="text-xs text-slate-400">Semua field bertanda * wajib diisi</p>
          </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="nim_npm" required>NIM / NPM</FieldLabel>
                <input id="nim_npm" type="text" className={inputClass('nim_npm')}
                  placeholder="Contoh: 18012345"
                  value={form.nim_npm} onChange={(e) => set('nim_npm', e.target.value)} />
                <ErrorMsg field="nim_npm" />
              </div>
              <div>
                <FieldLabel htmlFor="tahun_lulus" required>Tahun Lulus</FieldLabel>
                <select id="tahun_lulus" className={inputClass('tahun_lulus')}
                  value={form.tahun_lulus}
                  onChange={(e) => set('tahun_lulus', e.target.value)}>
                  <option value="">Pilih tahun...</option>
                  {[2018,2019,2020,2021,2022,2023,2024,2025].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ErrorMsg field="tahun_lulus" />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="nama" required>Nama Lengkap</FieldLabel>
              <input id="nama" type="text" className={inputClass('nama')}
                placeholder="Nama sesuai ijazah"
                value={form.nama} onChange={(e) => set('nama', e.target.value)} />
              <ErrorMsg field="nama" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="no_telpon" required>No. Telepon / HP</FieldLabel>
                <input id="no_telpon" type="tel" className={inputClass('no_telpon')}
                  placeholder="08xxxxxxxxxx"
                  value={form.no_telpon} onChange={(e) => set('no_telpon', e.target.value)} />
                <ErrorMsg field="no_telpon" />
              </div>
              <div>
                <FieldLabel htmlFor="email" required>Email</FieldLabel>
                <input id="email" type="email" className={inputClass('email')}
                  placeholder="nama@email.com"
                  value={form.email} onChange={(e) => set('email', e.target.value)} />
                <ErrorMsg field="email" />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="npwp">NPWP <span className="text-slate-400 font-normal text-xs">(opsional)</span></FieldLabel>
              <input id="npwp" type="text" className={inputClass('npwp')}
                placeholder="XX.XXX.XXX.X-XXX.XXX"
                value={form.npwp} onChange={(e) => set('npwp', e.target.value)} />
            </div>
          </FormSection>

          {/* ── Status ── */}
          <FormSection title="Status Saat Ini">
            <div>
              <FieldLabel required>Jelaskan status anda saat ini</FieldLabel>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((opt) => (
                  <RadioOption key={opt.value} name="status" value={opt.value} label={opt.label}
                    current={form.status_saat_ini}
                    onChange={() => set('status_saat_ini', opt.value)} />
                ))}
              </div>
              <ErrorMsg field="status_saat_ini" />
            </div>
          </FormSection>

          {/* ── Sumber Dana ── */}
          <FormSection title="Sumber Dana Kuliah">
            <div>
              <FieldLabel required hint="Bisa lebih dari satu">Sumber pembiayaan kuliah</FieldLabel>
              <div className="space-y-2">
                {DANA_OPTIONS.map((opt) => (
                  <CheckOption key={opt.value} value={opt.value} label={opt.label}
                    checked={form.sumber_dana.includes(opt.value)}
                    onChange={() => set('sumber_dana', toggleArray(form.sumber_dana, opt.value))} />
                ))}
              </div>
              <ErrorMsg field="sumber_dana" />
            </div>
          </FormSection>

          {/* ── Kompetensi saat lulus ── */}
          <FormSection title="Kompetensi Saat Lulus">
            <p className="text-xs text-slate-400 -mt-2">
              Tingkat penguasaan: 1 = Sangat rendah · 5 = Sangat tinggi
            </p>
            <CompetencyTable
              rows={KOMP_ROWS}
              values={form.komp_lulus}
              onChange={(key, val) =>
                set('komp_lulus', { ...form.komp_lulus, [key]: val })
              }
            />
            {KOMP_ROWS.some((r) => errors[`komp_lulus_${r.key}`]) && (
              <p className="text-xs text-red-500">Semua kompetensi wajib dinilai</p>
            )}
          </FormSection>

          {/* ── Kompetensi diperlukan pekerjaan ── */}
          <FormSection title="Kompetensi yang Diperlukan Pekerjaan">
            <p className="text-xs text-slate-400 -mt-2">
              Tingkat kebutuhan: 1 = Tidak diperlukan · 5 = Sangat diperlukan
            </p>
            <CompetencyTable
              rows={KOMP_ROWS}
              values={form.komp_kerja}
              onChange={(key, val) =>
                set('komp_kerja', { ...form.komp_kerja, [key]: val })
              }
            />
            {KOMP_ROWS.some((r) => errors[`komp_kerja_${r.key}`]) && (
              <p className="text-xs text-red-500">Semua kompetensi wajib dinilai</p>
            )}
          </FormSection>

          {/* ── Metode Pembelajaran ── */}
          <FormSection title="Metode Pembelajaran">
            <p className="text-xs text-slate-400 -mt-2">
              1 = Tidak sama sekali · 5 = Sangat besar
            </p>
            <CompetencyTable
              rows={METODE_ROWS}
              values={form.metode}
              onChange={(key, val) =>
                set('metode', { ...form.metode, [key]: val })
              }
              ratingLabels={['Tidak sama sekali', 'Sangat besar']}
            />
            {METODE_ROWS.some((r) => errors[`metode_${r.key}`]) && (
              <p className="text-xs text-red-500">Semua metode wajib dinilai</p>
            )}
          </FormSection>

          {/* ── Pencarian Kerja ── */}
          <FormSection title="Pencarian Kerja">
            <div>
              <FieldLabel htmlFor="waktu_mulai_mencari" required>
                Kapan mulai mencari pekerjaan?
              </FieldLabel>
              <select id="waktu_mulai_mencari" className={inputClass('waktu_mulai_mencari')}
                value={form.waktu_mulai_mencari}
                onChange={(e) => set('waktu_mulai_mencari', e.target.value)}>
                <option value="">Pilih waktu...</option>
                {WAKTU_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ErrorMsg field="waktu_mulai_mencari" />
            </div>

            <div>
              <FieldLabel required hint="Bisa lebih dari satu">Cara mencari pekerjaan</FieldLabel>
              <div className="space-y-2">
                {CARA_OPTIONS.map((opt) => (
                  <CheckOption key={opt.value} value={opt.value} label={opt.label}
                    checked={form.cara_mencari_kerja.includes(opt.value)}
                    onChange={() =>
                      set('cara_mencari_kerja', toggleArray(form.cara_mencari_kerja, opt.value))
                    } />
                ))}
              </div>
              <ErrorMsg field="cara_mencari_kerja" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <FieldLabel htmlFor="jumlah_lamaran" required>Jumlah lamaran</FieldLabel>
                <input id="jumlah_lamaran" type="number" min="0" className={inputClass('jumlah_lamaran')}
                  placeholder="0"
                  value={form.jumlah_lamaran}
                  onChange={(e) => set('jumlah_lamaran', e.target.value)} />
                <ErrorMsg field="jumlah_lamaran" />
              </div>
              <div>
                <FieldLabel htmlFor="jumlah_respons" required>Yang merespons</FieldLabel>
                <input id="jumlah_respons" type="number" min="0" className={inputClass('jumlah_respons')}
                  placeholder="0"
                  value={form.jumlah_respons}
                  onChange={(e) => set('jumlah_respons', e.target.value)} />
                <ErrorMsg field="jumlah_respons" />
              </div>
              <div>
                <FieldLabel htmlFor="jumlah_undangan_wawancara" required>Undangan wawancara</FieldLabel>
                <input id="jumlah_undangan_wawancara" type="number" min="0"
                  className={inputClass('jumlah_undangan_wawancara')}
                  placeholder="0"
                  value={form.jumlah_undangan_wawancara}
                  onChange={(e) => set('jumlah_undangan_wawancara', e.target.value)} />
                <ErrorMsg field="jumlah_undangan_wawancara" />
              </div>
            </div>
          </FormSection>

          {/* ── Aktivitas & Kesesuaian ── */}
          <FormSection title="Aktivitas & Kesesuaian Kerja">
            <div>
              <FieldLabel required>Aktif mencari kerja 4 minggu terakhir?</FieldLabel>
              <div className="space-y-2">
                {AKTIF_OPTIONS.map((opt) => (
                  <RadioOption key={opt.value} name="aktif_mencari" value={opt.value} label={opt.label}
                    current={form.aktif_mencari_kerja}
                    onChange={() => set('aktif_mencari_kerja', opt.value)} />
                ))}
              </div>
              <ErrorMsg field="aktif_mencari_kerja" />
            </div>

            <div>
              <FieldLabel hint="Bisa lebih dari satu">
                Jika pekerjaan tidak sesuai pendidikan, mengapa?
              </FieldLabel>
              <div className="space-y-2">
                {ALASAN_OPTIONS.map((opt) => (
                  <CheckOption key={opt.value} value={opt.value} label={opt.label}
                    checked={form.alasan_tidak_sesuai.includes(opt.value)}
                    onChange={() =>
                      set('alasan_tidak_sesuai', toggleArray(form.alasan_tidak_sesuai, opt.value))
                    } />
                ))}
              </div>
            </div>
          </FormSection>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white
                       font-medium py-3.5 rounded-xl transition-colors text-sm"
          >
            {submitting ? 'Mengirim...' : 'Kirim Formulir'}
          </button>

        </div>
      </form>
    </div>
  )
}
