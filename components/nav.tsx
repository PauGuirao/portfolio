'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export function Nav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Pau Guirao
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle Menu</span>
        </button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <span className="font-bold">Pau Guirao</span>
            </Link>
          </div>
          <nav className="flex items-center">
            <ThemeToggle />
          </nav>
        </div>
      </div>
      {isOpen && (
        <div className="border-b md:hidden">
          <nav className="flex flex-col space-y-3 p-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}