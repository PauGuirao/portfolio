'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/mdx'

interface BlogClientProps {
  posts: Post[]
  tags: string[]
}

export function BlogClient({ posts, tags }: BlogClientProps) {
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredPosts = useMemo(() => {
    if (selectedTag === 'all') {
      return posts
    }
    return posts.filter((post) => post.tags.includes(selectedTag))
  }, [posts, selectedTag])

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="space-y-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground md:hidden"
        >
          <Filter className="h-4 w-4" />
          Filter by tag
        </button>
        
        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('all')}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedTag === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              All ({posts.length})
            </button>
            {tags.map((tag) => {
              const count = posts.filter((post) => post.tags.includes(tag)).length
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {tag} ({count})
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article
            key={post.slug}
            className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-video overflow-hidden">
              <Image
                src={post.cover}
                alt={post.title}
                width={400}
                height={225}
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readingTime}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`} className="stretched-link">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-2 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-block text-sm font-medium text-primary hover:underline relative z-10"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No posts found with the selected tag.
          </p>
        </div>
      )}
    </div>
  )
}