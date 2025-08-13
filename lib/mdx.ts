import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const contentDirectory = path.join(process.cwd(), 'content')

export interface Project {
  slug: string
  title: string
  summary: string
  date: string
  cover: string
  stack: string[]
  featured: boolean
  links: {
    demo?: string
    repo?: string
  }
  impact: string[]
  content: string
}

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  cover: string
  content: string
  readingTime: string
}

export async function getAllProjects(): Promise<Project[]> {
  const projectsDirectory = path.join(contentDirectory, 'projects')
  
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(projectsDirectory)
  const projects = filenames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const filePath = path.join(projectsDirectory, name)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      const slug = name.replace(/\.mdx$/, '')

      return {
        slug,
        title: data.title,
        summary: data.summary,
        date: data.date,
        cover: data.cover,
        stack: data.stack || [],
        featured: data.featured || false,
        links: data.links || {},
        impact: data.impact || [],
        content,
      } as Project
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return projects
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const filePath = path.join(contentDirectory, 'projects', `${slug}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      summary: data.summary,
      date: data.date,
      cover: data.cover,
      stack: data.stack || [],
      featured: data.featured || false,
      links: data.links || {},
      impact: data.impact || [],
      content,
    } as Project
  } catch (error) {
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(contentDirectory, 'posts')
  
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(postsDirectory)
  const posts = filenames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const filePath = path.join(postsDirectory, name)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      const slug = name.replace(/\.mdx$/, '')
      const readTime = readingTime(content)

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        tags: data.tags || [],
        cover: data.cover,
        content,
        readingTime: readTime.text,
      } as Post
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(contentDirectory, 'posts', `${slug}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const readTime = readingTime(content)

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      tags: data.tags || [],
      cover: data.cover,
      content,
      readingTime: readTime.text,
    } as Post
  } catch (error) {
    return null
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects()
  return projects.filter((project) => project.featured).slice(0, 3)
}

export async function getLatestPosts(): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.slice(0, 3)
}