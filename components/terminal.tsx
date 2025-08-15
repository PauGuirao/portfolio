'use client'

import { useState, useEffect, useRef } from 'react'

interface Command {
  command: string
  output: string[]
  error?: boolean
}

const commands = {
  help: {
    description: 'Show available commands',
    output: [
      'Available commands:',
      '',
      'Information:',
      '  about      - Learn about Pau Guirao',
      '  skills     - View technical skills',
      '  experience - Show work experience',
      '  projects   - List recent projects',
      '  contact    - Get contact information',
      '  education  - View educational background',
      '  fetch      - Display neofetch-style info card',
      '',
      'Navigation & Actions:',
      '  open       - Navigate to pages (e.g., open /projects)',
      '  cv         - Download CV/resume',
      '  email      - Copy email to clipboard',
      '  social     - Show social media links',
      '',
      'Visual & Fun:',
      '  banner     - Display ASCII banner',
      '  matrix     - Start matrix rain animation',
      '  theme      - Change theme (light/dark/matrix)',
      '',
      'System:',
      '  whoami     - Display current user info',
      '  clear      - Clear the terminal',
      '  pwd        - Print working directory',
      '  ls         - List directory contents',
      '  cat        - Display file contents',
      '  help       - Show this help message',
      '',
      'Type any command to get started!'
    ]
  },
  banner: {
    description: 'Display ASCII banner',
    output: [
      '',
      '██████╗  █████╗ ██╗   ██╗     ██████╗ ██╗   ██╗██╗██████╗  █████╗  ██████╗ ',
      '██╔══██╗██╔══██╗██║   ██║    ██╔════╝ ██║   ██║██║██╔══██╗██╔══██╗██╔═══██╗',
      '██████╔╝███████║██║   ██║    ██║  ███╗██║   ██║██║██████╔╝███████║██║   ██║',
      '██╔═══╝ ██╔══██║██║   ██║    ██║   ██║██║   ██║██║██╔══██╗██╔══██║██║   ██║',
      '██║     ██║  ██║╚██████╔╝    ╚██████╔╝╚██████╔╝██║██║  ██║██║  ██║╚██████╔╝',
      '╚═╝     ╚═╝  ╚═╝ ╚═════╝      ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ',
      '',
      '                    Full-Stack Engineer & AI Specialist',
      '                           Barcelona, Spain',
      ''
    ]
  },
  fetch: {
    description: 'Display neofetch-style info card',
    output: [
      '',
      '                 .-.           pauguirao@portfolio',
      '        .-\'\'\'-.  `-\'          ─────────────────',
      '       /       \\               OS: Portfolio v2024',
      '      |  .--.   |              Host: Barcelona, Spain',
      '      | /    \\  |              Kernel: Full-Stack Engineer',
      '      |/      \\ |              Uptime: 7+ years coding',
      '       \\      / /              Packages: React, Node, Python, AI',
      '        \\    /_/               Shell: TypeScript',
      '         \\  /                  Resolution: Scalable Solutions',
      '          \\/                   Theme: Innovation & Growth',
      '                               Memory: Constantly Learning',
      '                               CPU: Problem Solver',
      '',
    ]
  },
  matrix: {
    description: 'Start matrix rain animation',
    output: [
      '🟢 MATRIX MODE ACTIVATED 🟢',
      '',
      '░░░░░░░▓▓▓▓▓▓▓▓░░░░░░░',
      '░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░',
      '░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░',
      '░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░',
      '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░',
      '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
      '░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░',
      '░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░',
      '░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░',
      '░░░░░░░▓▓▓▓▓▓▓▓░░░░░░░',
      '',
      'Welcome to the Matrix, Neo...',
      'Reality is that which, when you stop believing in it,',
      'doesn\'t go away. - Philip K. Dick',
      '',
      'Type "theme light" to exit matrix mode',
    ]
  },
  theme: {
    description: 'Change theme',
    output: [
      'Theme Command Usage:',
      '',
      '  theme light   - Switch to light theme',
      '  theme dark    - Switch to dark theme (default)',
      '  theme matrix  - Enter the Matrix',
      '',
      'Current theme: dark',
      '',
      'Note: Theme changes are visual only in this demo.'
    ]
  },
  social: {
    description: 'Show social media links',
    output: [
      'Social Media & Links:',
      '',
      '🐙 GitHub:    https://github.com/pauguirao',
      '💼 LinkedIn:  https://linkedin.com/in/pauguirao',
      '🌐 Website:   https://pauguirao.vercel.app',
      '🚀 Bright Shot: https://bright-shot.com',
      '📧 Email:     guiraocastells@gmail.com',
      '',
      '💡 Tip: Use "email" command to copy email to clipboard',
      '💡 Tip: Use "open /projects" to view my work'
    ]
  },
  email: {
    description: 'Copy email to clipboard',
    output: [
      '📧 Email copied to clipboard!',
      '',
      'guiraocastells@gmail.com',
      '',
      'Feel free to reach out for opportunities or collaborations!'
    ]
  },
  cv: {
    description: 'Download CV/resume',
    output: [
      '📄 Downloading CV...',
      '',
      '✅ Download started: pau_guirao_cv.pdf',
      '',
      'Opening PDF in new tab...'
    ]
  },
  open: {
    description: 'Navigate to pages',
    output: [
      'Navigation Command Usage:',
      '',
      '  open /projects    - View my projects',
      '  open /about       - Learn about me',
      '  open /experience  - See my work history',
      '  open /contact     - Get in touch',
      '  open /terminal    - Stay here (you are here!)',
      '',
      'Example: open /projects'
    ]
  },
  about: {
    description: 'Learn about Pau Guirao',
    output: [
      'Pau Guirao - Full-Stack Engineer',
      '',
      'Hello! I\'m Pau, a Barcelona-based engineer passionate about building',
      'tools that solve real-world problems. I\'ve been coding since 2017,',
      'working with AI, full-stack development, video processing, and',
      'scalable data products.',
      '',
      'I believe AI and machine learning will transform how we work and',
      'interact with technology, and I strive to stay at the forefront',
      'of this transformation.'
    ]
  },
  skills: {
    description: 'View technical skills',
    output: [
      'Technical Skills:',
      '',
      'Frontend:',
      '  ├── React / Next.js',
      '  ├── TypeScript',
      '  ├── Tailwind CSS',
      '  └── JavaScript',
      '',
      'Backend:',
      '  ├── Node.js',
      '  ├── Python',
      '  ├── PostgreSQL',
      '  └── Redis',
      '',
      'AI & Data:',
      '  ├── OpenAI APIs',
      '  ├── TensorFlow',
      '  ├── Pandas',
      '  └── Machine Learning',
      '',
      'Tools & Cloud:',
      '  ├── Docker',
      '  ├── AWS',
      '  ├── Vercel',
      '  └── Git'
    ]
  },
  experience: {
    description: 'Show work experience',
    output: [
      'Work Experience:',
      '',
      '2025 - Present  │ Founder @ Bright Shot',
      '                │ • Built end-to-end AI image pipeline from scratch',
      '                │ • Scaled product for 1,000+ professionals worldwide',
      '                │ • Led marketing & SEO strategy for organic growth',
      '',
      '2024 - Present  │ Lead Software Engineer @ Capgemini',
      '                │ • Architected scalable data pipeline infrastructure',
      '                │ • Built real-time analytics dashboards',
      '                │ • Led team of 5 developers on critical projects',
      '',
      '2021 - 2024     │ Software Developer @ Capgemini',
      '                │ • Developed responsive web applications',
      '                │ • Improved performance by 40% through optimization',
      '                │ • Mentored junior developers'
    ]
  },
  projects: {
    description: 'List recent projects',
    output: [
      'Recent Projects:',
      '',
      '🚀 Bright Shot',
      '   Online software for real-estate photo enhancement',
      '   Tech: React, TypeScript, Node.js, Python, AWS',
      '',
      '🎯 AI Video Processor',
      '   Advanced video processing with machine learning',
      '   Tech: Python, TensorFlow, OpenCV',
      '',
      '🛒 E-commerce Platform',
      '   Full-stack e-commerce solution',
      '   Tech: Next.js, PostgreSQL, Stripe',
      '',
      'View more at: /projects'
    ]
  },
  contact: {
    description: 'Get contact information',
    output: [
      'Contact Information:',
      '',
      '📧 Email:    guiraocastells@gmail.com',
      '💼 LinkedIn: linkedin.com/in/pauguirao',
      '🐙 GitHub:   github.com/pauguirao',
      '🌐 Website:  pauguirao.vercel.app',
      '📍 Location: Barcelona, Spain',
      '',
      'Feel free to reach out for collaborations or opportunities!'
    ]
  },
  education: {
    description: 'View educational background',
    output: [
      'Education:',
      '',
      '2022 - 2023  │ Masters in IT Project Management',
      '             │ University of La Salle, Barcelona',
      '             │ • Specialized in AI project management',
      '             │ • Completed ML optimization capstone project',
      '',
      '2018 - 2022  │ Bachelor\'s in Computer Engineering',
      '             │ University of La Salle, Barcelona',
      '             │ • Specialized in AI and machine learning',
      '             │ • Strong foundation in computer science'
    ]
  },
  whoami: {
    description: 'Display current user info',
    output: [
      'guest@pau-portfolio:~$ whoami',
      'guest',
      '',
      'You are currently exploring Pau Guirao\'s interactive terminal.',
      'Type "help" to see available commands.'
    ]
  },
  pwd: {
    description: 'Print working directory',
    output: ['/home/pau/portfolio']
  },
  ls: {
    description: 'List directory contents',
    output: [
      'total 7',
      'drwxr-xr-x  2 pau pau 4096 Dec 15 2024 about.txt',
      'drwxr-xr-x  2 pau pau 4096 Dec 15 2024 skills.txt',
      'drwxr-xr-x  2 pau pau 4096 Dec 15 2024 experience.txt',
      'drwxr-xr-x  2 pau pau 4096 Dec 15 2024 projects.txt',
      'drwxr-xr-x  2 pau pau 4096 Dec 15 2024 contact.txt',
      'drwxr-xr-x  2 pau pau 4096 Dec 15 2024 education.txt',
      'drwxr-xr-x  2 pau pau 4096 Dec 15 2024 README.md',
      '',
      'Use "cat <filename>" to read file contents'
    ]
  }
}

export function TerminalComponent() {
  const [history, setHistory] = useState<Command[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light' | 'matrix'>('dark')
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Welcome message
    setHistory([
      {
        command: '',
        output: [
          '╭─────────────────────────────────────────────────────╮',
          '│              Welcome to Pau\'s Terminal              │',
          '│                                                     │',
          '│  Explore information about Pau Guirao through       │',
          '│  command line interface. Type "help" to get started │',
          '╰─────────────────────────────────────────────────────╯',
          ''
        ]
      }
    ])
  }, [])

  useEffect(() => {
    // Auto-focus input and scroll to bottom
    if (inputRef.current) {
      inputRef.current.focus()
    }
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    const newCommand: Command = {
      command: cmd,
      output: []
    }

    if (trimmedCmd === '') {
      setHistory(prev => [...prev, newCommand])
      return
    }

    if (trimmedCmd === 'clear') {
      setHistory([])
      return
    }

    // Handle special commands with side effects
    if (trimmedCmd === 'email') {
      // Copy email to clipboard
      navigator.clipboard.writeText('pau@example.com').then(() => {
        newCommand.output = commands.email.output
        setHistory(prev => [...prev, newCommand])
      }).catch(() => {
        newCommand.output = ['Failed to copy email to clipboard', 'Email: pau@example.com']
        newCommand.error = true
        setHistory(prev => [...prev, newCommand])
      })
      return
    }

    if (trimmedCmd === 'cv') {
      // Simulate CV download
      newCommand.output = commands.cv.output
      setHistory(prev => [...prev, newCommand])
      // In a real app, you'd trigger the download here:
      // window.open('/cv.pdf', '_blank')
      return
    }

    // Handle theme command
    if (trimmedCmd.startsWith('theme ')) {
      const theme = trimmedCmd.substring(6).trim()
      if (['light', 'dark', 'matrix'].includes(theme)) {
        setCurrentTheme(theme as 'dark' | 'light' | 'matrix')
        newCommand.output = [
          `🎨 Theme changed to: ${theme}`,
          '',
          `Switching to ${theme} mode...`,
          theme === 'matrix' ? '🟢 Welcome to the Matrix!' : '',
          theme === 'light' ? '☀️ Light mode activated!' : '',
          theme === 'dark' ? '🌙 Dark mode activated!' : ''
        ].filter(Boolean)
      } else {
        newCommand.output = [
          'Theme Command Usage:',
          '',
          '  theme light   - Switch to light theme',
          '  theme dark    - Switch to dark theme (default)',
          '  theme matrix  - Enter the Matrix',
          '',
          `Current theme: ${currentTheme}`,
          '',
          'Available themes: light, dark, matrix'
        ]
      }
      setHistory(prev => [...prev, newCommand])
      return
    }

    // Handle open command
    if (trimmedCmd.startsWith('open ')) {
      const path = trimmedCmd.substring(5).trim()
      const validPaths = ['/projects', '/about', '/experience', '/contact', '/terminal', '/stats', '/fun']
      
      if (validPaths.includes(path)) {
        newCommand.output = [
          `🚀 Navigating to ${path}...`,
          '',
          `Opening ${path} in current tab...`
        ]
        setHistory(prev => [...prev, newCommand])
        
        // Navigate after a short delay for better UX
        setTimeout(() => {
          window.location.href = path
        }, 1000)
      } else {
        newCommand.output = [
          `❌ Invalid path: ${path}`,
          '',
          'Available paths:',
          '  /projects - View my projects',
          '  /about - Learn about me', 
          '  /experience - See my work history',
          '  /contact - Get in touch',
          '  /terminal - Stay here',
          '  /stats - View GitHub stats',
          '  /fun - Fun interactive features'
        ]
        newCommand.error = true
        setHistory(prev => [...prev, newCommand])
      }
      return
    }

    // Handle cat command
    if (trimmedCmd.startsWith('cat ')) {
      const filename = trimmedCmd.substring(4).trim()
      const fileMap: { [key: string]: keyof typeof commands } = {
        'about.txt': 'about',
        'skills.txt': 'skills',
        'experience.txt': 'experience',
        'projects.txt': 'projects',
        'contact.txt': 'contact',
        'education.txt': 'education',
        'readme.md': 'help'
      }
      
      if (fileMap[filename]) {
        newCommand.output = commands[fileMap[filename]].output
      } else {
        newCommand.output = [`cat: ${filename}: No such file or directory`]
        newCommand.error = true
      }
    } else if (commands[trimmedCmd as keyof typeof commands]) {
      newCommand.output = commands[trimmedCmd as keyof typeof commands].output
    } else {
      newCommand.output = [
        `bash: ${trimmedCmd}: command not found`,
        'Type "help" to see available commands.'
      ]
      newCommand.error = true
    }

    setHistory(prev => [...prev, newCommand])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTyping) return;

    setIsTyping(true);
    handleCommand(currentInput);
    setCurrentInput('');

    // let React finish rendering, then clear isTyping
    requestAnimationFrame(() => setIsTyping(false));
    };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setHistory([])
    }
  }

  // Theme styles
  const getThemeStyles = () => {
    switch (currentTheme) {
      case 'light':
        return {
          container: 'bg-gray-50 border-gray-300 text-gray-800',
          text: 'text-gray-800',
          prompt: 'text-blue-600',
          input: 'text-purple-600 caret-purple-600',
          error: 'text-red-600'
        }
      case 'matrix':
        return {
          container: 'bg-black border-green-500 text-green-400 shadow-green-500/20',
          text: 'text-green-400',
          prompt: 'text-green-300',
          input: 'text-green-200 caret-green-200',
          error: 'text-red-400'
        }
      default: // dark
        return {
          container: 'bg-black border-gray-700 text-green-400',
          text: 'text-green-400',
          prompt: 'text-blue-400',
          input: 'text-green-400 caret-green-400',
          error: 'text-red-400'
        }
    }
  }

  const themeStyles = getThemeStyles()

  return (
    <div className="flex justify-center">
      <div 
        ref={terminalRef}
        className={`w-full max-w-4xl h-[65vh] overflow-y-auto p-6 ${themeStyles.container} rounded-sm shadow-2xl font-mono text-sm transition-all duration-300`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="w-full">
          {/* Command history */}
          {history.map((cmd, index) => (
            <div key={index} className="mb-2">
              {cmd.command && (
                <div className="flex">
                  <span className={themeStyles.prompt}>guest@pau-portfolio</span>
                  <span className={currentTheme === 'light' ? 'text-gray-600' : 'text-white'}>:</span>
                  <span className={themeStyles.prompt}>~</span>
                  <span className={currentTheme === 'light' ? 'text-gray-600' : 'text-white'}>$ </span>
                  <span className={themeStyles.input}>{cmd.command}</span>
                </div>
              )}
              <div className={cmd.error ? themeStyles.error : themeStyles.text}>
                {cmd.output.map((line, lineIndex) => (
                  <div key={lineIndex} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Current input */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className={themeStyles.prompt}>guest@pau-portfolio</span>
            <span className={currentTheme === 'light' ? 'text-gray-600' : 'text-white'}>:</span>
            <span className={themeStyles.prompt}>~</span>
            <span className={currentTheme === 'light' ? 'text-gray-600' : 'text-white'}>$ </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 bg-transparent outline-none ${themeStyles.input} ml-1`}
              readOnly={isTyping}
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
