import { getAllProjects } from '@/lib/mdx'
import { ProjectsClient } from './projects-client'
import { constructMetadata } from '@/lib/seo'
import ContributionsCalendar from '@/components/contributions-calendar'

export const metadata = constructMetadata({
  title: 'Projects',
  description: 'Explore my portfolio of AI-powered applications, video processing tools, and data products.',
})

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  // Get all unique technologies for filtering
  const allTechnologies = Array.from(
    new Set(projects.flatMap((project) => project.stack))
  ).sort()

  return (
    <div className="container py-16">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="text-m text-muted-foreground">
          A collection of projects I've built, ranging from AI-powered applications
          to data processing tools and web platforms.
        </p>
      </div>

      {/* Working on it section */}
      <div className="mt-16 space-y-8 flex flex-col items-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground font-mono">
            I'm working on it.... is not that easy.
          </p>
        </div>
        
        {/* GitHub Contributions Calendar */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <ContributionsCalendar />
          </div>
        </div>
      </div>
    </div>
  )
}