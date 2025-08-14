'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'About', href: '/about' },
	{ name: 'Experience', href: '/experience' },
	{ name: 'Projects', href: '/projects' },
]

export function Nav() {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center justify-between">
				{/* Left side - Logo/Name */}
				<Link 
					href="/" 
					className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
				>
					<span className="font-bold font-mono relative">
						Pau Guirao
						<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out"></span>
					</span>
				</Link>

				{/* Right side - Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-6 text-sm font-medium font-mono">
					{navigation.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'relative px-3 py-2 rounded-md transition-all duration-300 ease-out transform hover:scale-105',
								'before:absolute before:inset-0 before:rounded-md before:bg-primary/10',
								'before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
								'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5',
								'after:bg-primary after:transition-all after:duration-300',
								'hover:after:w-full hover:shadow-lg hover:shadow-primary/20',
								pathname === item.href
									? 'text-foreground after:w-full'
									: 'text-foreground/60 hover:text-foreground'
							)}
						>
							{item.name}
						</Link>
					))}
				</nav>

				{/* Mobile menu button */}
				<button
					className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 px-2 text-base hover:bg-primary/10 focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden transform hover:scale-110 hover:rotate-180"
					type="button"
					onClick={() => setIsOpen(!isOpen)}
				>
					<div className="transition-transform duration-300">
						{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</div>
					<span className="sr-only">Toggle Menu</span>
				</button>
			</div>

			{/* Mobile Navigation */}
			{isOpen && (
				<div className="border-b md:hidden animate-in slide-in-from-top-2 duration-300">
					<nav className="flex flex-col space-y-1 p-4 font-mono">
						{navigation.map((item, index) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'relative px-3 py-3 rounded-lg transition-all duration-300 ease-out',
									'hover:bg-primary/10',
									'hover:translate-x-2 hover:shadow-md transform',
									'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-6',
									'before:bg-primary before:transition-all before:duration-300',
									'hover:before:w-1 before:rounded-full',
									pathname === item.href
										? 'text-foreground bg-primary/10 before:w-1'
										: 'text-foreground/60 hover:text-foreground'
								)}
								onClick={() => setIsOpen(false)}
								style={{
									animationDelay: `${index * 50}ms`,
									animation: 'slideInLeft 0.3s ease-out forwards'
								}}
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