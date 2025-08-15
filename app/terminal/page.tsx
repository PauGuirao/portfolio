import { constructMetadata } from '@/lib/seo'
import { TerminalComponent } from '@/components/terminal'

export const metadata = constructMetadata({
  title: 'Terminal',
  description: 'Interactive terminal to explore information about Pau Guirao through command line interface.',
})

export default function TerminalPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Desktop: normal layout with padding and description */}
      <div className="hidden sm:block container py-12 overflow-hidden">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Explore information about Pau Guirao through a command line interface. 
              Type "help" to see available commands.
            </p>
          </div>
          <TerminalComponent />
        </div>
      </div>
      
      {/* Mobile: full screen terminal */}
      <div className="sm:hidden flex-1 flex flex-col">
        <TerminalComponent />
      </div>
    </div>
  )
}
