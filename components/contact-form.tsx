'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { sendContactEmail } from '@/app/actions/contact'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    
    try {
      const result = await sendContactEmail(formData)
      
      if (result.success) {
        setStatus('success')
        setMessage('Thank you for your message! I\'ll get back to you soon.')
        // Reset form
        const form = document.getElementById('contact-form') as HTMLFormElement
        form?.reset()
      } else {
        setStatus('error')
        setMessage(result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {status === 'success' && (
        <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      <form id="contact-form" action={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Your full name"
              disabled={status === 'loading'}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="your.email@example.com"
              disabled={status === 'loading'}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="What's this about?"
            disabled={status === 'loading'}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Tell me about your project, ideas, or just say hello..."
            disabled={status === 'loading'}
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </button>
      </form>
      
      <p className="text-xs text-muted-foreground">
        * Required fields. Your information will be kept private and secure.
      </p>
    </div>
  )
}