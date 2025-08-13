import type { Metadata } from 'next'

const siteConfig = {
  name: 'Pau Guirao — Portfolio',
  description: 'Full-stack engineer specialized in AI, video processing, and data products.',
  url: 'https://pauguirao.com',
  ogImage: '/og-image.png',
  creator: 'Pau Guirao',
  twitterCreator: '@pauguirao',
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    keywords: [
      'Pau Guirao',
      'Full-stack engineer',
      'AI',
      'Video processing',
      'Data products',
      'Next.js',
      'TypeScript',
      'React',
      'Node.js',
    ],
    authors: [
      {
        name: siteConfig.creator,
      },
    ],
    creator: siteConfig.creator,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: siteConfig.twitterCreator,
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

export function generatePageTitle(title: string): string {
  return `${title} | ${siteConfig.name}`
}