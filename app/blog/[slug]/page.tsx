import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { constructMetadata } from '@/lib/seo'
import { MDXContent } from '@/components/mdx-content'

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

  return (
    <article className="container py-16 max-w-2xl mx-auto">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        back
      </Link>

      <header className="mb-8">
        <time dateTime={post.date} className="text-xs font-mono text-muted-foreground">
          {formatDate(post.date)}
        </time>
        <h1 className="text-xl font-mono font-semibold mt-2">
          {post.title}
        </h1>
      </header>

      <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none font-mono">
        <MDXContent source={post.content} />
      </div>
    </article>
  )
}
