import type { Metadata } from 'next'
import { Syne, DM_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RentProof -- Property Management That Works',
  description:
    'Track rent, automate reminders, document units, manage maintenance, and win deposit disputes. The property operating system for landlords and property managers.',
  openGraph: {
    title: 'RentProof',
    description: 'The property operating system for landlords and property managers.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
