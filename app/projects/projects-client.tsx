'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/lib/mdx'

interface ProjectsClientProps {
  projects: Project[]
  technologies: string[]
}

export function ProjectsClient({ projects, technologies }: ProjectsClientProps) {
  const [selectedTech, setSelectedTech] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProjects = useMemo(() => {
    if (selectedTech === 'all') {
      return projects
    }
    return projects.filter((project) => project.stack.includes(selectedTech))
  }, [projects, selectedTech])

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="space-y-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground md:hidden"
        >
          <Filter className="h-4 w-4" />
          Filter by technology
        </button>
        
        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTech('all')}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedTech === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              All ({projects.length})
            </button>
            {technologies.map((tech) => {
              const count = projects.filter((project) => project.stack.includes(tech)).length
              return (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    selectedTech === tech
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {tech} ({count})
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <article
            key={project.slug}
            className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-video overflow-hidden">
              <Image
                src={project.cover}
                alt={project.title}
                width={400}
                height={225}
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <time className="text-xs text-muted-foreground">
                    {formatDate(project.date)}
                  </time>
                  {project.featured && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.summary}</p>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-secondary px-2 py-1 text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Impact */}
              {project.impact.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Impact:</h4>
                  <ul className="space-y-1">
                    {project.impact.slice(0, 2).map((item, index) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Learn more →
                </Link>
                <div className="flex items-center gap-2">
                  {project.links.demo && (
                    <Link
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                      title="View Demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                  {project.links.repo && (
                    <Link
                      href={project.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                      title="View Source"
                    >
                      <Github className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects found with the selected technology.
          </p>
        </div>
      )}
    </div>
  )
}