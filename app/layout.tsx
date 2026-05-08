import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tracer Study Alumni',
  description: 'Formulir tracer study untuk alumni',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
