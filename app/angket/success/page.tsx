'use client'

import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-slate-800 mb-2">
          Terima Kasih!
        </h1>

        <p className="text-slate-600 mb-6">
          Angket kepuasan mahasiswa Anda telah berhasil dikirim. Masukan Anda sangat berarti untuk perbaikan layanan akademik Program Studi Teknik Informatika UNIPAS Morotai.
        </p>

        <div className="space-y-3">
          <Link
            href="/angket"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            Isi Angket Lagi
          </Link>

          <Link
            href="/"
            className="block w-full bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium py-3 rounded-xl transition-colors text-sm"
          >
            Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  )
}
