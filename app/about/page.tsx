import Image from 'next/image'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { constructMetadata } from '@/lib/seo'
import VisitedGlobe from '@/components/VisitedGlobe'
import { TypingAnimation } from '@/components/typing-animation'
import visitedCountriesData from '@/data/visited-countries.json'


export const metadata = constructMetadata({
  title: 'About',
  description: 'Learn more about Pau Guirao, a full-stack engineer specialized in AI, video processing, and data products.',
})

export default function AboutPage() {
  const countries = visitedCountriesData.visitedCountries.map(location => location.country + '!');
  return (
    <div className="container py-16">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              About Me
            </h1>
            
            {/* Who I Am Section */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Who I Am</h2>
              <p className="text-sm text-muted-foreground">
                Hello! I'm Pau, a Barcelona-based engineer passionate about building tools that solve real-world problems. 
                I've been coding since 2017, working with AI, full-stack development, video processing, and scalable data products.
              </p>
            </div>

            {/* What I Do Section */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">What I Do</h2>
              <p className="text-sm text-muted-foreground">
                Currently working as a full-stack engineer, specializing in AI-powered solutions and building 
                innovative applications.
              </p>
            </div>

            {/* My Journey Section */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">My Journey</h2>
              <p className="text-sm text-muted-foreground">
                Over 5 years of experience building scalable web applications and AI solutions. Led product development 
                across multiple projects, focusing on video processing, data products, and workflow automation.
              </p>
            </div>

            {/* Vision Section */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">Vision</h2>
              <p className="text-sm text-muted-foreground">
                AI and machine learning will transform how we work and interact with technology. I strive to stay 
                at the forefront of this transformation.
              </p>
            </div>

            {/* Beyond Code Section */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Beyond Code</h2>
              <p className="text-sm text-muted-foreground">
                When I'm not coding, I love traveling the world and exploring new cultures. 
                There's something incredible about experiencing different perspectives and ways of life 
                that constantly inspires my approach to building technology.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Link
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative h-full w-full overflow-hidden lg:ml-5">
              <h3 className="text-m font-semibold mb-2 text-center">
                  I've been to <TypingAnimation words={countries} className="text-blue-600 dark:text-blue-400" /> 
              </h3>
              <VisitedGlobe />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}