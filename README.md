# Tracer Study Alumni — Next.js + Supabase

Formulir tracer study alumni berbasis Next.js 14 (App Router) dan Supabase PostgreSQL.

---

## Tech Stack

- **Next.js 14** — App Router, Server Components, API Routes
- **TypeScript** — type safety penuh
- **Tailwind CSS** — styling
- **Supabase** — PostgreSQL database + Row Level Security

---

## Setup

### 1. Clone & install

```bash
npm install
```

### 2. Buat project Supabase

1. Buka [supabase.com](https://supabase.com) → New Project
2. Catat **Project URL** dan **Anon Key** dari Settings → API

### 3. Jalankan SQL migration

Di Supabase Dashboard → **SQL Editor**, paste isi file `supabase-migration.sql` dan klik **Run**.

Ini akan membuat tabel `tracer_study` beserta:
- Constraint validasi (rating 1–5, tahun lulus, dsb.)
- Row Level Security (RLS)
- Policy: publik bisa **insert**, hanya authenticated user yang bisa **select**

### 4. Konfigurasi environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — akan redirect ke `/tracer`.

---

## Struktur Project

```
tracer-study/
├── app/
│   ├── api/tracer/route.ts     ← POST & GET endpoint
│   ├── tracer/
│   │   ├── page.tsx            ← Halaman formulir utama
│   │   └── success/page.tsx    ← Halaman sukses
│   ├── layout.tsx
│   ├── page.tsx                ← Redirect ke /tracer
│   └── globals.css
├── components/
│   ├── CompetencyTable.tsx     ← Tabel rating kompetensi
│   ├── FieldLabel.tsx          ← Label dengan tanda *
│   ├── FormSection.tsx         ← Card wrapper per seksi
│   └── RatingButtons.tsx       ← Tombol rating 1–5
├── lib/
│   └── supabase.ts             ← Supabase client
├── types/
│   └── tracer.ts               ← TypeScript types
├── supabase-migration.sql      ← SQL untuk Supabase
└── .env.local.example
```

---

## API Endpoints

### `POST /api/tracer`
Simpan satu jawaban tracer study ke Supabase.

**Body**: JSON sesuai schema `tracer_study` (lihat `types/tracer.ts`)

**Response**: `{ success: true, id: "uuid" }`

### `GET /api/tracer`
Ambil semua data (memerlukan authenticated session Supabase).

---

## Production Deploy

```bash
npm run build
npm start
```

Atau deploy ke **Vercel** — tambahkan environment variables di dashboard Vercel.

---

## Melihat Data di Supabase

Buka Supabase Dashboard → **Table Editor** → tabel `tracer_study`.

Untuk export ke Excel: klik tombol **Export** di Table Editor.
