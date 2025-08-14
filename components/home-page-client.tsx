'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { TypingAnimation } from '@/components/typing-animation'
import { LocationGreeting } from '@/components/location-greeting'
import { ChatWidget } from '@/components/chat-widget'

export function HomePageClient() {
  return (
    <div className="flex flex-col">
      {/* Main Hero Section - Full screen */}
      <section id="main-section" className="h-screen flex flex-col items-center justify-center space-y-8 px-4 relative">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-lg">
            <Image
              src="/profile.webp"
              alt="Pau Guirao"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-mono font-bold tracking-tight sm:text-5xl md:text-6xl">
              Hi, I'm{' '}
              <span className="text-foreground">
                Pau Guirao
              </span>
            </h1>
            <p className="text-lg font-mono font-medium text-muted-foreground sm:text-xl">
              AI Software <TypingAnimation words={['Engineer', 'Developer', 'Expert (Not really)']} className="text-foreground" />
            </p>
            <p className="mx-auto max-w-[600px] text-sm text-muted-foreground sm:text-base font-mono">
              Full-stack engineer specialized in AI, video processing, and data products.
              I build scalable solutions that solve real-world problems.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium font-mono text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              View Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/pauguirao/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium font-mono shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get in Touch
            </Link>
          </div>
          <LocationGreeting className="mt-4" />
        </div>
      </section>
      {/* Chat Widget
      <ChatWidget />*/}
    </div>
  )
}