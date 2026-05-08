-- ============================================================
-- Tracer Study Schema — run this in Supabase SQL Editor
-- ============================================================

create table if not exists public.tracer_study (
  id                              uuid primary key default gen_random_uuid(),
  created_at                      timestamptz default now(),

  -- Data Diri
  nim_npm                         text not null,
  nama                            text not null,
  tahun_lulus                     smallint not null check (tahun_lulus between 2018 and 2030),
  no_telpon                       text not null,
  email                           text not null,
  npwp                            text,

  -- Status
  status_saat_ini                 text not null,

  -- Sumber Dana (array of enum strings)
  sumber_dana                     text[] not null default '{}',


  -- Kompetensi saat lulus (1–5)
  komp_lulus_etika                smallint not null check (komp_lulus_etika between 1 and 5),
  komp_lulus_keahlian_ilmu        smallint not null check (komp_lulus_keahlian_ilmu between 1 and 5),
  komp_lulus_bahasa_inggris       smallint not null check (komp_lulus_bahasa_inggris between 1 and 5),
  komp_lulus_teknologi_informasi  smallint not null check (komp_lulus_teknologi_informasi between 1 and 5),
  komp_lulus_komunikasi           smallint not null check (komp_lulus_komunikasi between 1 and 5),
  komp_lulus_kerja_sama_tim       smallint not null check (komp_lulus_kerja_sama_tim between 1 and 5),
  komp_lulus_pengembangan         smallint not null check (komp_lulus_pengembangan between 1 and 5),

  -- Kompetensi diperlukan pekerjaan (1–5)
  komp_kerja_etika                smallint not null check (komp_kerja_etika between 1 and 5),
  komp_kerja_keahlian_ilmu        smallint not null check (komp_kerja_keahlian_ilmu between 1 and 5),
  komp_kerja_bahasa_inggris       smallint not null check (komp_kerja_bahasa_inggris between 1 and 5),
  komp_kerja_teknologi_informasi  smallint not null check (komp_kerja_teknologi_informasi between 1 and 5),
  komp_kerja_komunikasi           smallint not null check (komp_kerja_komunikasi between 1 and 5),
  komp_kerja_kerja_sama_tim       smallint not null check (komp_kerja_kerja_sama_tim between 1 and 5),
  komp_kerja_pengembangan         smallint not null check (komp_kerja_pengembangan between 1 and 5),

  -- Metode pembelajaran (1–5)
  metode_perkuliahan              smallint not null check (metode_perkuliahan between 1 and 5),
  metode_demonstrasi              smallint not null check (metode_demonstrasi between 1 and 5),
  metode_proyek_riset             smallint not null check (metode_proyek_riset between 1 and 5),
  metode_magang                   smallint not null check (metode_magang between 1 and 5),
  metode_praktikum                smallint not null check (metode_praktikum between 1 and 5),
  metode_kerja_lapangan           smallint not null check (metode_kerja_lapangan between 1 and 5),
  metode_diskusi                  smallint not null check (metode_diskusi between 1 and 5),

  -- Pencarian kerja
  waktu_mulai_mencari             text not null,
  cara_mencari_kerja              text[] not null default '{}',
  jumlah_lamaran                  smallint not null check (jumlah_lamaran >= 0),
  jumlah_respons                  smallint not null check (jumlah_respons >= 0),
  jumlah_undangan_wawancara       smallint not null check (jumlah_undangan_wawancara >= 0),

  -- Aktivitas & kesesuaian
  aktif_mencari_kerja             text not null,
  alasan_tidak_sesuai             text[] default '{}'
);

-- Enable Row Level Security
alter table public.tracer_study enable row level security;

-- Allow anyone to insert (public survey)
create policy "Allow public insert"
  on public.tracer_study for insert
  with check (true);

-- Allow all users to read all data (for dashboard)
create policy "Allow public read"
  on public.tracer_study for select
  using (true);

-- Allow service role to delete (for admin dashboard)
create policy "Allow service role delete"
  on public.tracer_study for delete
  using (true);

-- ============================================================
-- Angket Kepuasan Mahasiswa Schema
-- ============================================================

create table if not exists public.angket_kepuasan (
  id                                      uuid primary key default gen_random_uuid(),
  created_at                              timestamptz default now(),

  -- Data Diri
  nama                                    text not null,
  angkatan                                text not null,
  jenis_kelamin                           text not null check (jenis_kelamin in ('Laki-Laki', 'Perempuan')),

  -- Sarana Pendidikan - Alat Perkuliahan, Media Pengajaran dan Prasarana Pendidikan (1-4)
  sarana_ruang_kuliah_bersih              smallint not null check (sarana_ruang_kuliah_bersih between 1 and 4),
  sarana_ruang_kuliah_nyaman              smallint not null check (sarana_ruang_kuliah_nyaman between 1 and 4),
  sarana_pembelajaran_ruang               smallint not null check (sarana_pembelajaran_ruang between 1 and 4),
  sarana_perpustakaan_lengkap             smallint not null check (sarana_perpustakaan_lengkap between 1 and 4),
  sarana_laboratorium_relevan             smallint not null check (sarana_laboratorium_relevan between 1 and 4),
  sarana_buku_referensi                   smallint not null check (sarana_buku_referensi between 1 and 4),
  sarana_fasilitas_kamar_kecil            smallint not null check (sarana_fasilitas_kamar_kecil between 1 and 4),
  sarana_fasilitas_ibadah                 smallint not null check (sarana_fasilitas_ibadah between 1 and 4),

  -- Perlakuan pada Mahasiswa (1-4)
  perlakuan_staf_santun                   smallint not null check (perlakuan_staf_santun between 1 and 4),
  perlakuan_dosen_pa                        smallint not null check (perlakuan_dosen_pa between 1 and 4),
  perlakuan_dosen_konseling                 smallint not null check (perlakuan_dosen_konseling between 1 and 4),
  perlakuan_sanksi_adil                    smallint not null check (perlakuan_sanksi_adil between 1 and 4),

  -- Kehandalan Dosen, Staf Akademik (1-4)
  kehandalan_materi_jelas                 smallint not null check (kehandalan_materi_jelas between 1 and 4),
  kehandalan_bahan_ajar                   smallint not null check (kehandalan_bahan_ajar between 1 and 4),
  kehandalan_waktu_diskusi                smallint not null check (kehandalan_waktu_diskusi between 1 and 4),
  kehandalan_penilaian_objektif           smallint not null check (kehandalan_penilaian_objektif between 1 and 4),
  kehandalan_dosen_tepat_waktu            smallint not null check (kehandalan_dosen_tepat_waktu between 1 and 4),
  kehandalan_jumlah_dosen                 smallint not null check (kehandalan_jumlah_dosen between 1 and 4),
  kehandalan_kemampuan_staf               smallint not null check (kehandalan_kemampuan_staf between 1 and 4),
  kehandalan_kualitas_layanan_staf        smallint not null check (kehandalan_kualitas_layanan_staf between 1 and 4),

  -- Pemahaman terhadap Kepentingan Mahasiswa (1-4)
  pemahaman_kepentingan_mahasiswa         smallint not null check (pemahaman_kepentingan_mahasiswa between 1 and 4),
  pemahaman_biaya_dibicarakan             smallint not null check (pemahaman_biaya_dibicarakan between 1 and 4),
  pemahaman_monitoring_pa                 smallint not null check (pemahaman_monitoring_pa between 1 and 4),
  pemahaman_minat_bakat                   smallint not null check (pemahaman_minat_bakat between 1 and 4),

  -- Sikap Tanggap (1-4)
  tanggap_dosen_konseling                 smallint not null check (tanggap_dosen_konseling between 1 and 4),
  tanggap_bantuan_tidak_mampu             smallint not null check (tanggap_bantuan_tidak_mampu between 1 and 4),
  tanggap_bantu_masalah_akademik          smallint not null check (tanggap_bantu_masalah_akademik between 1 and 4),
  tanggap_waktu_konsultasi_ortu           smallint not null check (tanggap_waktu_konsultasi_ortu between 1 and 4),

  -- Masukan
  masukan_layanan_akademik                text
);

-- Enable Row Level Security
alter table public.angket_kepuasan enable row level security;

-- Allow anyone to insert (public survey)
create policy "Allow public insert angket"
  on public.angket_kepuasan for insert
  with check (true);

-- Allow all users to read all data (for dashboard)
create policy "Allow public read angket"
  on public.angket_kepuasan for select
  using (true);

-- Allow service role to delete (for admin dashboard)
create policy "Allow service role delete angket"
  on public.angket_kepuasan for delete
  using (true);

-- ===========================================================
-- Kepuasan Pengguna Lulusan Table
-- ===========================================================

create table if not exists public.kepuasan_pengguna_lulusan (
  id                              uuid primary key default gen_random_uuid(),
  created_at                      timestamptz default now(),

  -- Data Responden
  nama_instansi_perusahaan           text not null,
  nama_penilai                    text not null,
  jabatan                         text not null,
  alamat_instansi                  text not null,
  nomor_telepon_email              text not null,
  nama_lulusan_yang_dinilai       text not null,
  tahun_lulus                     smallint not null,
  jabatan_lulusan_saat_ini         text not null,
  lama_bekerja                    text not null,

  -- Penilaian Kepuasan (1-4)
  integritas                      smallint check (integritas between 1 and 4),
  keahlian_bidang_ilmu            smallint check (keahlian_bidang_ilmu between 1 and 4),
  kemampuan_teknologi_informasi  smallint check (kemampuan_teknologi_informasi between 1 and 4),
  kemampuan_berkomunikasi         smallint check (kemampuan_berkomunikasi between 1 and 4),
  kemampuan_kerja_sama_tim        smallint check (kemampuan_kerja_sama_tim between 1 and 4),
  kemampuan_berpikir_kritis       smallint check (kemampuan_berpikir_kritis between 1 and 4),
  kreativitas_inovasi             smallint check (kreativitas_inovasi between 1 and 4),
  kemampuan_adaptasi_lingkungan   smallint check (kemampuan_adaptasi_lingkungan between 1 and 4),
  tanggung_jawab_pekerjaan       smallint check (tanggung_jawab_pekerjaan between 1 and 4),
  kepemimpinan                    smallint check (kepemimpinan between 1 and 4),
  kemampuan_manajemen_waktu       smallint check (kemampuan_manajemen_waktu between 1 and 4),
  kemampuan_bahasa_inggris        smallint check (kemampuan_bahasa_inggris between 1 and 4),
  motivasi_etos_kerja             smallint check (motivasi_etos_kerja between 1 and 4),
  kemampuan_analisis_keputusan    smallint check (kemampuan_analisis_keputusan between 1 and 4),
  kinerja_keseluruhan             smallint check (kinerja_keseluruhan between 1 and 4),

  -- Kepuasan Umum (1-4)
  kompetensi_sesuai_kebutuhan     smallint check (kompetensi_sesuai_kebutuhan between 1 and 4),
  kemampuan_bekerja_profesional    smallint check (kemampuan_bekerja_profesional between 1 and 4),
  kemampuan_adaptasi_budaya_kerja smallint check (kemampuan_adaptasi_budaya_kerja between 1 and 4),
  instansi_puas_kinerja            smallint check (instansi_puas_kinerja between 1 and 4),

  -- Masukan dan Saran
  kompetensi_dibutuhkan_dilingkungan text,
  kompetensi_perlu_ditingkatkan      text,
  saran_pengembangan_kurikulum     text,
  harapan_pengguna_lulusan         text
);

-- Enable Row Level Security
alter table public.kepuasan_pengguna_lulusan enable row level security;

-- Allow anyone to insert (public survey)
create policy "Allow public insert kepuasan"
  on public.kepuasan_pengguna_lulusan for insert
  with check (true);

-- Allow all users to read all data (for dashboard)
create policy "Allow public read kepuasan"
  on public.kepuasan_pengguna_lulusan for select
  using (true);

-- Allow service role to delete (for admin dashboard)
create policy "Allow service role delete kepuasan"
  on public.kepuasan_pengguna_lulusan for delete
  using (true);
