'use client'
import VisitedGlobe from '@/components/VisitedGlobe';
import ContributionsCalendar from '@/components/contributions-calendar';
import { TypingAnimation } from '@/components/typing-animation';
import visitedCountriesData from '@/data/visited-countries.json';

export function FunSection() {
	// Extract country names from the visited countries data
	const countries = visitedCountriesData.visitedCountries.map(location => location.country);

	return (
		<section id="fun-section" className="min-h-screen flex flex-col py-8">
			<div className="container">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-[150px] max-w-8xl mx-auto items-start flex-1">
					{/* Left: Globe */}
					<div className="flex flex-col items-center h-full">
						<h3 className="text-m font-semibold mb-2 text-center">
							I've been to <TypingAnimation words={countries} className="text-blue-600 dark:text-blue-400" />
						</h3>
						<VisitedGlobe />
					</div>
					
					{/* Middle: GitHub Calendar */}
					<div className="flex flex-col items-center h-full">
						<h3 className="text-m font-semibold mb-6 text-center">Coding Activity</h3>
						<ContributionsCalendar />
					</div>
					
					{/* Right: Empty space for future content */}
					<div className="flex flex-col items-center h-full">
						<h3 className="text-m font-semibold mb-6 text-center">Coming Soon</h3>
						<div className="flex justify-center items-center min-h-[300px]">
							<div className="text-center text-muted-foreground">
								<p className="text-sm">More fun content on the way...</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}