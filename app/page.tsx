import { constructMetadata } from '@/lib/seo'
import { HomePageClient } from '@/components/home-page-client'
import { getLatestPosts } from '@/lib/mdx'

export const metadata = constructMetadata({
  title: 'Pau Guirao — Portfolio',
  description: 'Full-stack engineer specialized in AI, video processing, and data products.',
})

export default async function HomePage() {
  const posts = await getLatestPosts()
  return <HomePageClient posts={posts.slice(0, 5)} />
}