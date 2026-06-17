export function Footer() {
	return (
		<footer className="mt-24 sm:mt-32">
			<div className="mx-auto max-w-xl px-4">
				<div className="flex items-center justify-between border-t py-5 text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()}</p>
					<p>Pau Guirao</p>
				</div>
			</div>
		</footer>
	)
}
