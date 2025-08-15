import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ExternalLink } from 'lucide-react'
import { constructMetadata } from '@/lib/seo'

export const metadata = constructMetadata({
  title: 'Experience',
  description: 'Explore my professional experience, skills, and educational background in full-stack engineering and AI.',
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
    year: '2025 - Present',
    title: 'Founder',
    company: 'Bright Shot',
    companyLink: 'https://bright-shot.com/',
    companyLogo: '/logos/logo.png', // Add your logo to public/logos/bright-shot.png
    description: 'Online software helping 1,000+ professionals worldwide enhance real-estate photos with virtual staging, decluttering, lighting fixes, and style restyles to create market-ready visuals that drive results.',
    location: 'Remote',
    bulletPoints: [
      'Built the end-to-end AI image pipeline from scratch (upload → transforms → export).',
      'Shipped core features: virtual staging, decluttering, lighting enhancement, style restyles, and window-view swaps',
      'Scaled product for 1,000+ professionals with seamless onboarding, Google sign-in, and Stripe payments',
      'Led marketing & SEO strategy (site architecture, content, landing pages, analytics) to drive organic growth',
      'Engineered a Node.js backend and trained/customized the AI model in Python on AWS (GPU inference, CDN delivery)',
      
    ],
    technologies: ['React', 'TypeScript', 'Astro', 'Node.js', 'Python', 'AWS','PostgreSQL']
  },
  {
    year: '2024 - Present',
    title: 'Lead Software Engineer',
    company: 'Capgemini',
    description: 'Built scalable data pipelines and real-time analytics dashboards using React, Node.js, and PostgreSQL.',
    location: 'Barcelona, Spain',
    bulletPoints: [
      'Architected and developed scalable data pipeline infrastructure',
      'Built real-time analytics dashboards for enterprise clients',
      'Led team of 5 developers on mission-critical projects',
      'Improved system performance by 40% through code optimization'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
  },
  {
    year: '2021 - 2024',
    title: 'Software Developer',
    company: 'Capgemini',
    description: 'Developed responsive web applications and improved site performance by 40% through optimization techniques.',
    location: 'Barcelona, Spain',
    bulletPoints: [
      'Developed responsive web applications for enterprise clients',
      'Implemented performance optimizations reducing load times by 40%',
      'Collaborated with cross-functional teams on agile projects',
      'Mentored junior developers on best practices and code quality'
    ],
    technologies: ['JavaScript', 'React', 'CSS', 'Node.js', 'Git']
  },
  {
    year: '2022 - 2023',
    title: 'Masters Degree in IT Project Management',
    company: 'University of La Salle',
    description: 'Specializing in artificial intelligence and software engineering.',
    location: 'Barcelona, Spain',
    bulletPoints: [
      'Specialized in AI project management and software architecture',
      'Completed capstone project on machine learning optimization',
      'Studied agile methodologies and team leadership'
    ],
    technologies: ['Python', 'Machine Learning', 'Project Management', 'Agile']
  },
  {
    year: '2018 - 2022',
    title: 'Bachelors Degree in Computer Engineering',
    company: 'University of La Salle',
    description: 'Specializing in artificial intelligence and software engineering.',
    location: 'Barcelona, Spain',
    bulletPoints: [
      'Strong foundation in computer science and software engineering',
      'Specialized in artificial intelligence and machine learning',
      'Completed multiple projects in web development and data structures'
    ],
    technologies: ['Java', 'Python', 'C++', 'Algorithms', 'Data Structures']
  },
]

export default function ExperiencePage() {
  return (
    <div className="container py-16">
      {/* Header */}
      <div className="mb-16 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          My Journey
        </h1>
        <p className="text-m text-muted-foreground">
          My professional journey, skills, and educational background in full-stack engineering and AI.
        </p>
      </div>

      {/* Timeline Section */}
      <section>
        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div key={index} className="relative flex gap-6">
              {/* Timeline line */}
              {index !== timeline.length - 1 && (
                <div className="absolute left-2 top-6 h-full w-px bg-border" />
              )}
              
              {/* Timeline dot */}
              <div className="relative z-10 flex h-4 w-4 items-center justify-center">
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
                
                {/* Company name with optional link and logo */}
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">
                    {item.title} • 
                    {item.companyLink ? (
                      <Link 
                        href={item.companyLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline ml-1"
                      >
                        {item.company}
                      </Link>
                    ) : (
                      <span className="ml-1">{item.company}</span>
                    )}
                  </h3>
                  
                  {/* Company logo */}
                  {item.companyLogo && (
                    <div className="relative h-6 w-6 ml-2">
                      <Image
                        src={item.companyLogo}
                        alt={`${item.company} logo`}
                        fill
                        className="object-contain"
                        sizes="24px"
                      />
                    </div>
                  )}
                </div>
                
                <p className="text-muted-foreground">{item.description}</p>
                
                {/* Bullet Points */}
                <ul className="mt-3 space-y-1 text-sm text-foreground">
                  {item.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Technology Tags */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {item.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section 
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
      */}
    </div>
  )
}