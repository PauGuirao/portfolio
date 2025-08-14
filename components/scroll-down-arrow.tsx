'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScrollDownArrowProps {
  onToggle: () => void
  showFunSection: boolean
  className?: string
}

export function ScrollDownArrow({ onToggle, showFunSection, className }: ScrollDownArrowProps) {
  const handleClick = () => {
    if (showFunSection) {
      // If fun section is visible, scroll back to main section
      const mainSection = document.getElementById('main-section')
      if (mainSection) {
        mainSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
      setTimeout(() => onToggle(), 500) // Hide fun section after scroll
    } else {
      // If fun section is hidden, show it and scroll to it
      onToggle()
      setTimeout(() => {
        const funSection = document.getElementById('fun-section')
        if (funSection) {
          funSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 100)
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-12 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 opacity-100",
        className
      )}
    >
      <button
        onClick={handleClick}
        className="group flex h-12 w-12 items-center justify-center rounded-full hover:scale-130"
        aria-label={showFunSection ? "Go back to main section" : "Show fun section"}
      >
        {showFunSection ? (
          <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors animate-bounce" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors animate-bounce" />
        )}
      </button>
    </div>
  )
}