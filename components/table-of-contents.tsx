'use client'

import { useEffect, useState } from 'react'
import { List } from 'lucide-react'

interface TableOfContentsProps {
  content: string
}

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from MDX content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const extractedHeadings: Heading[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      extractedHeadings.push({ id, text, level })
    }

    setHeadings(extractedHeadings)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    )

    const headingElements = headings.map((heading) =>
      document.getElementById(heading.id)
    ).filter(Boolean)

    headingElements.forEach((element) => {
      if (element) observer.observe(element)
    })

    return () => {
      headingElements.forEach((element) => {
        if (element) observer.unobserve(element)
      })
    }
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <List className="h-4 w-4" />
        Table of Contents
      </div>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={`block w-full text-left text-sm transition-colors hover:text-foreground ${
              activeId === heading.id
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            }`}
            style={{
              paddingLeft: `${(heading.level - 1) * 12}px`,
            }}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  )
}