import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllPosts } from '@/lib/mdx'
import { constructMetadata } from '@/lib/seo'
import { formatDate } from '@/lib/utils'

export const metadata = constructMetadata({
  title: 'Blog',
  description: 'Thoughts, stories, and interesting things from my journey.',
})

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="container py-16 max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        back
      </Link>

      <h1 className="text-xl font-mono font-semibold mb-8">
        Blog
      </h1>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group flex items-baseline justify-between gap-4">
                <h2 className="text-sm font-mono group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <time dateTime={post.date} className="text-xs text-muted-foreground shrink-0">
                  {formatDate(post.date)}
                </time>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
