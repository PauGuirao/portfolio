'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TypingAnimation } from '@/components/typing-animation'
import { LocationGreeting } from '@/components/location-greeting'
import type { Post } from '@/lib/mdx'

interface HomePageClientProps {
  posts: Post[]
}

export function HomePageClient({ posts }: HomePageClientProps) {
  const [clickCount, setClickCount] = useState(0)
  const [showDedication, setShowDedication] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleNameClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    
    // Show confetti animation
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1000)
    
    if (newCount === 5) {
      setTimeout(() => {
        setShowDedication(true)
      }, 500)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Main Hero Section - Full screen */}
      <section 
        id="main-section" 
        className={`h-screen flex flex-col items-center justify-center space-y-8 px-4 relative transition-opacity duration-1000 ${
          showDedication ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-lg">
            <Image
              src="/profile.webp"
              alt="Pau Guirao"
              fill
              className="object-cover"
              priority
              sizes="128px"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoQABAAAkA4JaQAA3AA/v3VAAoA"
            />
          </div>
          <div className="space-y-4">
            <div className="relative inline-block">
              <h1 className="text-3xl font-mono font-bold tracking-tight sm:text-4xl md:text-5xl">
                Hi, I'm{' '}
                <span 
                  className="text-foreground cursor-pointer transition-colors hover:text-primary select-none relative"
                  onClick={handleNameClick}
                  title={clickCount > 0 ? `${5 - clickCount} more clicks...` : ''}
                >
                  Pau
                  {/* Confetti particles */}
                  {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 rounded-full animate-pulse"
                          style={{
                            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'][i % 6],
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `confetti-${i % 4} 1s ease-out forwards`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </span>
                {' '}
                <span className="text-foreground">
                  Guirao
                </span>
              </h1>
              
              {/* Confetti animation styles */}
              {showConfetti && (
                <style jsx>{`
                  @keyframes confetti-0 {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(-50px) translateX(-30px) rotate(180deg); opacity: 0; }
                  }
                  @keyframes confetti-1 {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(-60px) translateX(40px) rotate(-180deg); opacity: 0; }
                  }
                  @keyframes confetti-2 {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(-40px) translateX(-50px) rotate(90deg); opacity: 0; }
                  }
                  @keyframes confetti-3 {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(-70px) translateX(20px) rotate(-90deg); opacity: 0; }
                  }
                `}</style>
              )}
            </div>
            <p className="text-lg font-mono font-medium text-muted-foreground sm:text-xl">
              AI Software <TypingAnimation words={['Engineer', 'Developer', 'Founder', 'Expert (Not really)']} className="text-foreground" />
            </p>
            <p className="mx-auto max-w-[600px] text-xs text-muted-foreground sm:text-sm font-mono">
              Full-stack engineer specialized in AI, video processing, and data products.
              I build scalable solutions that solve real-world problems.
            </p>
          </div>
          <div className="flex items-center gap-5 text-sm font-mono text-muted-foreground">
            <Link
              href="https://bright-shot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Image src="https://bright-shot.com/favicon.ico" alt="" width={14} height={14} className="rounded-sm" />
              BrightShot
            </Link>
            <span>·</span>
            <Link
              href="https://transcriu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Image src="https://transcriu.com/favicon.ico" alt="" width={14} height={14} className="rounded-sm" />
              Transcriu
            </Link>
            <span>·</span>
            <Link
              href="https://getlate.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Image src="https://getlate.dev/favicon.ico" alt="" width={14} height={14} className="rounded-sm" />
              Late
            </Link>
          </div>
          <LocationGreeting className="mt-4" />
        </div>

        {/* Blog sidebar - right side, desktop only */}
        {posts.length > 0 && (
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Recent posts</h3>
              <ul className="space-y-2">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors block max-w-[200px] truncate"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog"
                className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                View all →
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Dedication Section - Hidden by default */}
      {showDedication && (
        <section className="h-screen flex flex-col items-center justify-center space-y-8 px-4 absolute inset-0 bg-background/95 backdrop-blur-sm animate-in fade-in duration-1000">
          <div className="text-center space-y-8 max-w-3xl">
            <div className="space-y-4">
              <div className="space-y-6 text-muted-foreground">
                <div className="space-y-3">
                  <h3 className="text-lg font-mono font-semibold text-foreground">
                    To my mom and dad:
                  </h3>
                  <p className="text-sm font-mono leading-relaxed">
                    Gràcies per creure sempre en mi. El vostre suport incondicional, les vostres paraules d'ànim fins a altes hores de la nit i la vostra fe indestructible han fet possible aquest viatge. M'heu ensenyat que amb esforç i determinació, qualsevol somni és possible, us estimo.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-mono font-semibold text-foreground">
                    To my grandpa:
                  </h3>
                  <p className="text-sm  font-mono leading-relaxed">
                    T'extranyo cada dia. Aquest portafoli és la prova que les teves lliçons perduraran per sempre.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowDedication(false)
                setClickCount(0)
              }}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2 text-sm font-medium font-mono shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Back to Portfolio
            </button>
          </div>
        </section>
      )}
      
      {/* Chat Widget
      <ChatWidget />*/}
    </div>
  )
}