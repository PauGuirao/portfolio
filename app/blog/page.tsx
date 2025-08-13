import { getAllPosts } from '@/lib/mdx'
import { BlogClient } from './blog-client'
import { constructMetadata } from '@/lib/seo'

export const metadata = constructMetadata({
  title: 'Blog',
  description: 'Thoughts on software development, AI, and building products.',
})

export default async function BlogPage() {
  const posts = await getAllPosts()

  // Get all unique tags for filtering
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).sort()

  return (
    <div className="container py-16">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Blog
        </h1>
        <p className="text-lg text-muted-foreground">
          Thoughts on software development, AI, and building products.
        </p>
      </div>

      <BlogClient posts={posts} tags={allTags} />
    </div>
  )
}