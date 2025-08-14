'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { useState } from 'react'

const socialLinks = [
	{
		name: 'GitHub',
		href: 'https://github.com/PauGuirao',
		icon: Github,
	},
	{
		name: 'Twitter',
		href: 'https://twitter.com/guiicas',
		icon: Twitter,
	},
	{
		name: 'LinkedIn',
		href: 'https://linkedin.com/in/pauguirao',
		icon: Linkedin,
	},
]

export function Footer() {
	const [emailCopied, setEmailCopied] = useState(false)
	
	const handleEmailClick = async () => {
		try {
			await navigator.clipboard.writeText('guiraocastells@gmail.com')
			setEmailCopied(true)
			setTimeout(() => setEmailCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy email:', err)
		}
	}

	return (
		<footer className="static md:fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex flex-col items-center justify-between gap-4 py-3 md:h-12 md:flex-row md:py-0">
				<div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
					<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
						Made by Pau
					</p>
				</div>
				<div className="flex items-center space-x-4">
					{socialLinks.map((link) => {
						const Icon = link.icon
						return (
							<Link
								key={link.name}
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								<Icon className="h-5 w-5" />
								<span className="sr-only">{link.name}</span>
							</Link>
						)
					})}
					<button
						onClick={handleEmailClick}
						className="text-muted-foreground transition-colors hover:text-foreground relative"
						title={emailCopied ? 'Email copied!' : 'Copy email'}
					>
						<Mail className="h-5 w-5" />
						<span className="sr-only">Copy email</span>
						{emailCopied && (
							<span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
								Copied!
							</span>
						)}
					</button>
				</div>
			</div>
		</footer>
	)
}