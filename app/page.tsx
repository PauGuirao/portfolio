import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { constructMetadata } from '@/lib/seo'
import { TypingAnimation } from '@/components/typing-animation'
import { LocationGreeting } from '@/components/location-greeting'
import { ChatWidget } from '@/components/chat-widget'
import { HomePageClient } from '@/components/home-page-client'

export const metadata = constructMetadata({
  title: 'Pau Guirao — Portfolio',
  description: 'Full-stack engineer specialized in AI, video processing, and data products.',
})

export default function HomePage() {
  return <HomePageClient />
}