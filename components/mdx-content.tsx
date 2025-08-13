import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import Link from 'next/link'
import { highlight } from 'sugar-high'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

interface MDXContentProps {
  source: string
}

// Custom components for MDX
const components = {
  // Custom image component with Next.js optimization
  Image: ({ src, alt, width, height, ...props }: any) => (
    <div className="my-8">
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 400}
        className="rounded-lg border"
        sizes="(max-width: 768px) 100vw, 800px"
        {...props}
      />
    </div>
  ),
  
  // Custom link component
  a: ({ href, children, ...props }: any) => {
    if (href?.startsWith('http')) {
      return (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          {...props}
        >
          {children}
        </Link>
      )
    }
    return (
      <Link href={href} className="text-primary hover:underline" {...props}>
        {children}
      </Link>
    )
  },
  
  // Custom code block with syntax highlighting
  pre: ({ children, ...props }: any) => {
    const codeElement = children?.props?.children
    if (typeof codeElement === 'string') {
      const highlightedCode = highlight(codeElement)
      return (
        <pre
          className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm"
          {...props}
        >
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      )
    }
    return (
      <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm" {...props}>
        {children}
      </pre>
    )
  },
  
  // Custom inline code
  code: ({ children, ...props }: any) => (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
      {...props}
    >
      {children}
    </code>
  ),
  
  // Callout component
  Callout: ({ type = 'info', children, ...props }: any) => {
    const typeStyles = {
      info: 'callout-info',
      warning: 'callout-warning',
      error: 'callout-error',
      success: 'callout-success',
    }
    
    return (
      <div className={`callout ${typeStyles[type as keyof typeof typeStyles] || typeStyles.info}`} {...props}>
        <div className="flex-1">{children}</div>
      </div>
    )
  },
  
  // Custom button component
  Button: ({ href, children, variant = 'default', ...props }: any) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
    const variants = {
      default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
      secondary: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    }
    
    const className = `${baseClasses} ${variants[variant as keyof typeof variants] || variants.default}`
    
    if (href) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      )
    }
    
    return (
      <button className={className} {...props}>
        {children}
      </button>
    )
  },
  
  // Custom headings with better styling
  h1: ({ children, ...props }: any) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="mt-6 mb-3 text-xl font-semibold tracking-tight" {...props}>
      {children}
    </h3>
  ),
  
  // Custom blockquote
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),
  
  // Custom table styling
  table: ({ children, ...props }: any) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th
      className="border border-border bg-muted px-4 py-2 text-left font-semibold"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
  ),
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={
        {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'wrap',
                  properties: {
                    className: ['anchor'],
                  },
                },
              ],
            ],
          },
        }
      }
    />
  )
}