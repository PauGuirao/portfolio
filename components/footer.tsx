import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

const socialLinks = [
	{
		name: 'GitHub',
		href: 'https://github.com/PauGuirao',
		icon: Github,
	},
	{
		name: 'Twitter',
		href: 'https://twitter.com/pauguirao',
		icon: Twitter,
	},
	{
		name: 'LinkedIn',
		href: 'https://linkedin.com/in/pauguirao',
		icon: Linkedin,
	},
	{
		name: 'Email',
		href: 'mailto:me@yourdomain.com',
		icon: Mail,
	},
]

export function Footer() {
	return (
		<footer className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
				</div>
			</div>
		</footer>
	)
}