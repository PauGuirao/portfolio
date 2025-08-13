import Image from 'next/image'
import Link from 'next/link'
import { Download, MapPin, Calendar } from 'lucide-react'
import { constructMetadata } from '@/lib/seo'

export const metadata = constructMetadata({
  title: 'About',
  description: 'Learn more about Pau Guirao, a full-stack engineer specialized in AI, video processing, and data products.',
})

const skills = [
  {
    category: 'Frontend',
    technologies: [
      { name: 'React', logo: '/images/skills/react.svg' },
      { name: 'Next.js', logo: '/images/skills/nextjs.svg' },
      { name: 'TypeScript', logo: '/images/skills/typescript.svg' },
      { name: 'Tailwind CSS', logo: '/images/skills/tailwind.svg' },
    ],
  },
  {
    category: 'Backend',
    technologies: [
      { name: 'Node.js', logo: '/images/skills/nodejs.svg' },
      { name: 'Python', logo: '/images/skills/python.svg' },
      { name: 'PostgreSQL', logo: '/images/skills/postgresql.svg' },
      { name: 'Redis', logo: '/images/skills/redis.svg' },
    ],
  },
  {
    category: 'AI & Data',
    technologies: [
      { name: 'OpenAI', logo: '/images/skills/openai.svg' },
      { name: 'TensorFlow', logo: '/images/skills/tensorflow.svg' },
      { name: 'Pandas', logo: '/images/skills/pandas.svg' },
      { name: 'Jupyter', logo: '/images/skills/jupyter.svg' },
    ],
  },
  {
    category: 'Tools & Cloud',
    technologies: [
      { name: 'Docker', logo: '/images/skills/docker.svg' },
      { name: 'AWS', logo: '/images/skills/aws.svg' },
      { name: 'Vercel', logo: '/images/skills/vercel.svg' },
      { name: 'Git', logo: '/images/skills/git.svg' },
    ],
  },
]

const timeline = [
  {
    year: '2024',
    title: 'Senior Full-Stack Engineer',
    company: 'TechCorp',
    description: 'Leading AI-powered video processing initiatives, reducing processing time by 60% and improving user experience for 100k+ users.',
    location: 'Remote',
  },
  {
    year: '2022',
    title: 'Full-Stack Developer',
    company: 'DataFlow Solutions',
    description: 'Built scalable data pipelines and real-time analytics dashboards using React, Node.js, and PostgreSQL.',
    location: 'Barcelona, Spain',
  },
  {
    year: '2020',
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    description: 'Developed responsive web applications and improved site performance by 40% through optimization techniques.',
    location: 'Madrid, Spain',
  },
  {
    year: '2019',
    title: 'Computer Science Degree',
    company: 'University of Barcelona',
    description: 'Graduated with honors, specializing in artificial intelligence and software engineering.',
    location: 'Barcelona, Spain',
  },
]

export default function AboutPage() {
  return (
    <div className="container py-16">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About Me
            </h1>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                I'm a passionate full-stack engineer with over 5 years of experience
                building scalable web applications and AI-powered solutions. My journey
                started with a curiosity about how technology can solve real-world problems,
                and it has led me to specialize in AI, video processing, and data products.
              </p>
              <p>
                When I'm not coding, you can find me exploring the latest AI research,
                contributing to open-source projects, or hiking in the mountains around
                Barcelona. I believe in continuous learning and sharing knowledge with
                the developer community.
              </p>
              <p>
                I'm currently focused on building innovative solutions that leverage
                artificial intelligence to create meaningful user experiences and
                drive business value.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative h-96 w-80 overflow-hidden rounded-2xl">
              <Image
                src="/images/about-hero.jpg"
                alt="Pau Guirao working"
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-3xl font-bold tracking-tight">Skills & Technologies</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skillGroup) => (
            <div key={skillGroup.category} className="space-y-4">
              <h3 className="text-lg font-semibold">{skillGroup.category}</h3>
              <div className="grid grid-cols-2 gap-4">
                {skillGroup.technologies.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                  >
                    <div className="relative h-8 w-8">
                      <Image
                        src={tech.logo}
                        alt={tech.name}
                        fill
                        className="object-contain"
                        sizes="32px"
                      />
                    </div>
                    <span className="text-sm font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section>
        <h2 className="mb-8 text-3xl font-bold tracking-tight">Experience & Education</h2>
        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div key={index} className="relative flex gap-6">
              {/* Timeline line */}
              {index !== timeline.length - 1 && (
                <div className="absolute left-6 top-12 h-full w-px bg-border" />
              )}
              
              {/* Timeline dot */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background">
                <div className="h-3 w-3 rounded-full bg-primary" />
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-2 pb-8">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-sm font-medium text-primary">{item.year}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{item.location}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="font-medium text-muted-foreground">{item.company}</p>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}