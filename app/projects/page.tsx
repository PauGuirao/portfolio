import { getAllProjects } from '@/lib/mdx'
import { ProjectsClient } from './projects-client'
import { constructMetadata } from '@/lib/seo'

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
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="text-lg text-muted-foreground">
          A collection of projects I've built, ranging from AI-powered applications
          to data processing tools and web platforms.
        </p>
      </div>

      <ProjectsClient projects={projects} technologies={allTechnologies} />
    </div>
  )
}