import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">Terima kasih!</h1>
        <p className="text-slate-500 text-sm mb-6">
          Jawaban anda telah berhasil disimpan. Data ini akan sangat membantu pengembangan program studi kami.
        </p>
        <div className="space-y-2">
          <Link
            href="/tracer"
            className="inline-block text-sm text-blue-600 hover:underline"
          >
            ← Isi formulir lagi
          </Link>
          <div>
            <Link
              href="/"
              className="inline-block text-sm text-slate-500 hover:text-slate-700"
            >
              Kembali ke halaman utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
