import { constructMetadata } from '@/lib/seo'
import { HomePageClient } from '@/components/home-page-client'

export const metadata = constructMetadata({
  title: 'Pau Guirao — Portfolio',
  description: 'Full-stack engineer specialized in AI, video processing, and data products.',
})

export default function HomePage() {
  return <HomePageClient />
}