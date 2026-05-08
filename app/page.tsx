import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-slate-800 mb-2">Selamat Datang</h1>
        <p className="text-slate-500 text-sm mb-6">
          Silakan pilih formulir yang ingin Anda isi
        </p>

        <div className="space-y-3">
          <Link
            href="/tracer"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            Isi Tracer Study Alumni
          </Link>

          {/* <Link
            href="/angket"
            className="block w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 rounded-xl transition-colors text-sm"
          >
            Isi Angket Kepuasan alumni
          </Link> */}
        </div>
      </div>
    </div>
  )
}
