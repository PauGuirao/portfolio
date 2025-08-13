import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { constructMetadata } from '@/lib/seo'
import { MDXContent } from '@/components/mdx-content'
import { TableOfContents } from '@/components/table-of-contents'

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {}
  }

  return constructMetadata({
    title: post.title,
    description: post.description,
    image: post.cover,
  })
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  const allPosts = await getAllPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  return (
    <article className="container py-16">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}
          <header className="mb-12 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground">{post.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Cover Image */}
            <div className="aspect-video overflow-hidden rounded-2xl border">
              <Image
                src={post.cover}
                alt={post.title}
                width={1200}
                height={675}
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXContent source={post.content} />
          </div>

          {/* Share */}
          <div className="mt-12 border-t pt-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">Share this post</h3>
                <p className="text-sm text-muted-foreground">
                  Help others discover this content
                </p>
              </div>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.description,
                      url: window.location.href,
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-12 flex items-center justify-between border-t pt-8">
            <div className="flex-1">
              {prevPost && (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex items-center gap-4 text-left"
                >
                  <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Previous post</p>
                    <p className="font-medium group-hover:text-primary">{prevPost.title}</p>
                  </div>
                </Link>
              )}
            </div>
            <div className="flex-1 text-right">
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex items-center justify-end gap-4 text-right"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Next post</p>
                    <p className="font-medium group-hover:text-primary">{nextPost.title}</p>
                  </div>
                  <ArrowLeft className="h-5 w-5 rotate-180 text-muted-foreground group-hover:text-foreground" />
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <TableOfContents content={post.content} />
          </div>
        </div>
      </div>
    </article>
  )
}