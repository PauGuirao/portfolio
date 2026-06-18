'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TypingAnimation } from '@/components/typing-animation'

export function HomePageClient() {
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
        className={`flex flex-col items-center justify-start space-y-8 px-4 pt-24 sm:pt-32 pb-16 relative transition-opacity duration-1000 ${
          showDedication ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-start space-y-8 w-full max-w-xl text-left">
          <div className="flex flex-row items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full shadow-lg">
            <Image
              src="/profile.webp"
              alt="Pau Guirao"
              fill
              className="object-cover"
              priority
              sizes="80px"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoQABAAAkA4JaQAA3AA/v3VAAoA"
            />
          </div>
          <div className="space-y-1">
            <div className="relative inline-block">
              <h1 className="text-xl font-sans font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
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
            <p className="text-sm font-sans font-medium text-muted-foreground sm:text-base">
              <TypingAnimation words={['mid software engineer', 'mid padel player']} className="text-muted-foreground" />
            </p>
          </div>
          </div>
          <div className="flex flex-col items-start gap-4 self-start">
            <h3 className="text-base font-sans font-semibold text-foreground">Working</h3>
            <div className="flex flex-col gap-2 text-sm font-sans text-muted-foreground">
              <Link
                href="https://zernio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Image src="https://zernio.com/favicon.ico" alt="" width={14} height={14} className="rounded-sm" />
                Zernio
              </Link>
              <Link
                href="https://bright-shot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Image src="https://bright-shot.com/favicon.ico" alt="" width={14} height={14} className="rounded-sm" />
                BrightShot
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 self-start">
            <h3 className="text-base font-sans font-semibold text-foreground">Socials</h3>
            <div className="flex flex-col gap-2 text-sm font-sans text-muted-foreground">
              <Link
                href="https://github.com/PauGuirao"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/pauguirao"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn
              </Link>
              <Link
                href="https://x.com/guirao_pau"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                X
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Dedication Section - Hidden by default */}
      {showDedication && (
        <section className="h-screen flex flex-col items-center justify-center space-y-8 px-4 absolute inset-0 bg-background/95 backdrop-blur-sm animate-in fade-in duration-1000">
          <div className="text-center space-y-8 max-w-3xl">
            <div className="space-y-4">
              <div className="space-y-6 text-muted-foreground">
                <div className="space-y-3">
                  <h3 className="text-lg font-sans font-semibold text-foreground">
                    To my mom and dad:
                  </h3>
                  <p className="text-sm font-sans leading-relaxed">
                    Gràcies per creure sempre en mi. El vostre suport incondicional, les vostres paraules d'ànim fins a altes hores de la nit i la vostra fe indestructible han fet possible aquest viatge. M'heu ensenyat que amb esforç i determinació, qualsevol somni és possible, us estimo.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-sans font-semibold text-foreground">
                    To my grandpa:
                  </h3>
                  <p className="text-sm  font-sans leading-relaxed">
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
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2 text-sm font-medium font-sans shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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