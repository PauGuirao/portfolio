import { constructMetadata } from '@/lib/seo'
import { ContactForm } from '@/components/contact-form'
import { Mail, MapPin, Phone } from 'lucide-react'

export const metadata = constructMetadata({
  title: 'Contact',
  description: 'Get in touch with me for collaborations, opportunities, or just to say hello.',
})

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground">
            Have a project in mind? Let's discuss how we can work together.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-2xl font-semibold">Let's Connect</h2>
              <p className="text-muted-foreground">
                I'm always interested in hearing about new opportunities, 
                collaborations, or just having a chat about technology and innovation.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">me@yourdomain.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-muted-foreground">Barcelona, Spain</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Response Time</h3>
                  <p className="text-muted-foreground">Usually within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <h3 className="mb-3 font-semibold">What I'm Looking For</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Full-stack development projects</li>
                <li>• AI and machine learning collaborations</li>
                <li>• Video processing and media solutions</li>
                <li>• Technical consulting opportunities</li>
                <li>• Open source contributions</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="mb-6 text-2xl font-semibold">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's your typical response time?</h3>
              <p className="text-muted-foreground">
                I usually respond to emails within 24 hours during weekdays. 
                For urgent matters, please mention it in the subject line.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Do you work on small projects?</h3>
              <p className="text-muted-foreground">
                Yes! I enjoy working on projects of all sizes, from quick 
                consultations to long-term collaborations.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What technologies do you specialize in?</h3>
              <p className="text-muted-foreground">
                I specialize in React, Next.js, Node.js, Python, AI/ML, 
                and video processing technologies.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Are you available for remote work?</h3>
              <p className="text-muted-foreground">
                Absolutely! I work with clients globally and am comfortable 
                with remote collaboration across different time zones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}