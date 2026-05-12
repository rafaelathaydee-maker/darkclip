import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ToastProvider } from '@/lib/toast'
import { ConversionProvider } from '@/lib/conversion'
import { FounderProvider } from '@/lib/founder'
import { EarlyAccessModal } from '@/components/conversion/EarlyAccessModal'
import { SignInModal } from '@/components/auth/SignInModal'
import { FounderPanel } from '@/components/debug/FounderPanel'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DarkTrend — Viral Content Intelligence',
  description: 'Discover viral clips and fast-growing trends before anyone else. The secret weapon for dark-page creators.',
  keywords: ['viral content', 'dark page', 'trending videos', 'content creator', 'viral clips'],
  openGraph: {
    title: 'DarkTrend — Viral Content Intelligence',
    description: 'The secret weapon for dark-page creators.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <FounderProvider>
          <ConversionProvider>
            <ToastProvider>
              {children}
              <EarlyAccessModal />
              <SignInModal />
              <FounderPanel />
            </ToastProvider>
          </ConversionProvider>
        </FounderProvider>
      </body>
    </html>
  )
}
