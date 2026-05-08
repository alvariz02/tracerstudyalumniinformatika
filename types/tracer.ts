export type RatingValue = 1 | 2 | 3 | 4 | 5

export interface TracerStudyForm {
  // Data Diri
  nim_npm: string
  nama: string
  tahun_lulus: number
  no_telpon: string
  email: string
  npwp?: string

  // Status
  status_saat_ini: StatusSaatIni

  // Dana
  sumber_dana: SumberDana[]

  // Kompetensi saat lulus (1–5)
  komp_lulus_etika: RatingValue
  komp_lulus_keahlian_ilmu: RatingValue
  komp_lulus_bahasa_inggris: RatingValue
  komp_lulus_teknologi_informasi: RatingValue
  komp_lulus_komunikasi: RatingValue
  komp_lulus_kerja_sama_tim: RatingValue
  komp_lulus_pengembangan: RatingValue

  // Kompetensi diperlukan pekerjaan (1–5)
  komp_kerja_etika: RatingValue
  komp_kerja_keahlian_ilmu: RatingValue
  komp_kerja_bahasa_inggris: RatingValue
  komp_kerja_teknologi_informasi: RatingValue
  komp_kerja_komunikasi: RatingValue
  komp_kerja_kerja_sama_tim: RatingValue
  komp_kerja_pengembangan: RatingValue

  // Metode pembelajaran (1–5)
  metode_perkuliahan: RatingValue
  metode_demonstrasi: RatingValue
  metode_proyek_riset: RatingValue
  metode_magang: RatingValue
  metode_praktikum: RatingValue
  metode_kerja_lapangan: RatingValue
  metode_diskusi: RatingValue

  // Pencarian kerja
  waktu_mulai_mencari: WaktuMencariKerja
  cara_mencari_kerja: CaraMencariKerja[]
  jumlah_lamaran: number
  jumlah_respons: number
  jumlah_undangan_wawancara: number

  // Aktivitas
  aktif_mencari_kerja: AktifMencariKerja
  alasan_tidak_sesuai?: AlasanTidakSesuai[]
}

export type StatusSaatIni =
  | 'bekerja_fulltime_parttime'
  | 'belum_memungkinkan_bekerja'
  | 'wiraswasta'
  | 'melanjutkan_pendidikan'
  | 'tidak_kerja_mencari_kerja'

export type SumberDana =
  | 'biaya_sendiri_keluarga'
  | 'beasiswa_adik'
  | 'beasiswa_bidikmisi'
  | 'beasiswa_ppa'
  | 'beasiswa_afirmasi'
  | 'beasiswa_perusahaan_swasta'
  | 'lainnya'

export type WaktuMencariKerja =
  | '6_bulan_sebelum_lulus'
  | '3_bulan_sebelum_lulus'
  | '1_bulan_sebelum_lulus'
  | 'saat_lulus'
  | '1_3_bulan_setelah_lulus'
  | '4_6_bulan_setelah_lulus'
  | 'lebih_6_bulan_setelah_lulus'

export type CaraMencariKerja =
  | 'iklan_koran_majalah'
  | 'melamar_tanpa_lowongan'
  | 'bursa_pameran_kerja'
  | 'internet_online'
  | 'dihubungi_perusahaan'
  | 'menghubungi_kemenakertrans'
  | 'agen_tenaga_kerja'
  | 'pusat_karir_kampus'
  | 'kantor_kemahasiswaan_alumni'
  | 'networking_kuliah'
  | 'relasi'
  | 'bisnis_sendiri'
  | 'penempatan_magang'
  | 'tempat_kerja_sama_kuliah'
  | 'lainnya'

export type AktifMencariKerja =
  | 'tidak'
  | 'tidak_menunggu_hasil'
  | 'ya_mulai_2minggu'
  | 'ya_belum_pasti'
  | 'lainnya'

export type AlasanTidakSesuai =
  | 'sudah_sesuai'
  | 'belum_dapat_sesuai'
  | 'prospek_karir_baik'
  | 'suka_bidang_berbeda'
  | 'dipromosikan_kurang_sesuai'
  | 'pendapatan_lebih_tinggi'
  | 'pekerjaan_lebih_aman'
  | 'pekerjaan_lebih_menarik'
  | 'jadwal_fleksibel'
  | 'lokasi_dekat_rumah'
  | 'jamin_keluarga'
  | 'harus_terima_di_awal_karir'
  | 'lainnya'
