import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import { getFeaturedProjects, getLatestPosts } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { constructMetadata } from '@/lib/seo'

export const metadata = constructMetadata({
  title: 'Pau Guirao — Portfolio',
  description: 'Full-stack engineer specialized in AI, video processing, and data products.',
})

export default async function HomePage() {
  const [featuredProjects, latestPosts] = await Promise.all([
    getFeaturedProjects(),
    getLatestPosts(),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center space-y-8 py-24 md:py-32">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-border">
            <Image
              src="/images/profile.jpg"
              alt="Pau Guirao"
              fill
              className="object-cover"
              priority
              sizes="128px"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Pau Guirao
              </span>
            </h1>
            <p className="text-xl font-medium text-muted-foreground sm:text-2xl">
              AI Software Engineer
            </p>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              Full-stack engineer specialized in AI, video processing, and data products.
              I build scalable solutions that solve real-world problems.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              View Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}