import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { AudioGuide } from '@/components/audio-guide'
import { cn } from '@/lib/utils'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Pau Guirao — Portfolio',
    template: '%s | Pau Guirao',
  },
  description: 'Full-stack engineer specialized in AI, video processing, and data products.',
  keywords: ['Pau Guirao', 'Full-stack engineer', 'AI', 'Video processing', 'Data products', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Pau Guirao' }],
  creator: 'Pau Guirao',
  metadataBase: new URL('https://pauguirao.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pauguirao.vercel.app',
    title: 'Pau Guirao — Portfolio',
    description: 'Full-stack engineer specialized in AI, video processing, and data products.',
    siteName: 'Pau Guirao Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pau Guirao — Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pau Guirao — Portfolio',
    description: 'Full-stack engineer specialized in AI, video processing, and data products.',
    images: ['/og-image.png'],
    creator: '@pauguirao',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        jetbrainsMono.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          {/* Audio Guide - Available on all pages */}
          <AudioGuide />
        </ThemeProvider>
      </body>
    </html>
  )
}