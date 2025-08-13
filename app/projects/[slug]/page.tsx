import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github, Calendar } from 'lucide-react'
import { getAllProjects, getProjectBySlug } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { constructMetadata } from '@/lib/seo'
import { MDXContent } from '@/components/mdx-content'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug)
  
  if (!project) {
    return {}
  }

  return constructMetadata({
    title: project.title,
    description: project.summary,
    image: project.cover,
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug)
  
  if (!project) {
    notFound()
  }

  const allProjects = await getAllProjects()
  const currentIndex = allProjects.findIndex((p) => p.slug === params.slug)
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  return (
    <article className="container py-16">
      {/* Back Button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      {/* Header */}
      <header className="mb-12 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={project.date}>{formatDate(project.date)}</time>
            </div>
            {project.featured && (
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Featured Project
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="text-xl text-muted-foreground">{project.summary}</p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-secondary px-3 py-1 text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          {project.links.demo && (
            <Link
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" />
              View Demo
            </Link>
          )}
          {project.links.repo && (
            <Link
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Github className="h-4 w-4" />
              View Source
            </Link>
          )}
        </div>

        {/* Cover Image */}
        <div className="aspect-video overflow-hidden rounded-2xl border">
          <Image
            src={project.cover}
            alt={project.title}
            width={1200}
            height={675}
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>

        {/* Impact */}
        {project.impact.length > 0 && (
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Impact & Results</h2>
            <ul className="space-y-2">
              {project.impact.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent source={project.content} />
      </div>

      {/* Navigation */}
      <nav className="mt-16 flex items-center justify-between border-t pt-8">
        <div className="flex-1">
          {prevProject && (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex items-center gap-4 text-left"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Previous project</p>
                <p className="font-medium group-hover:text-primary">{prevProject.title}</p>
              </div>
            </Link>
          )}
        </div>
        <div className="flex-1 text-right">
          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex items-center justify-end gap-4 text-right"
            >
              <div>
                <p className="text-sm text-muted-foreground">Next project</p>
                <p className="font-medium group-hover:text-primary">{nextProject.title}</p>
              </div>
              <ArrowLeft className="h-5 w-5 rotate-180 text-muted-foreground group-hover:text-foreground" />
            </Link>
          )}
        </div>
      </nav>
    </article>
  )
}