import { constructMetadata } from '@/lib/seo'
import { TerminalComponent } from '@/components/terminal'

export const metadata = constructMetadata({
  title: 'Terminal',
  description: 'Interactive terminal to explore information about Pau Guirao through command line interface.',
})

export default function TerminalPage() {
  return (
    <div className="container py-16">
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
  )
}
