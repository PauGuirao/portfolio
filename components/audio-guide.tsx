'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

interface TourStep {
  id: string
  title: string
  description: string
  audioUrl: string
  route?: string
  duration: number // in seconds
  autoNavigate?: boolean
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome!',
    description: 'Hello and welcome to my portfolio!',
    audioUrl: '/audio/welcome.mp3',
    route: '/',
    duration: 40,
    autoNavigate: true
  },
  {
    id: 'about',
    title: 'About Me',
    description: 'Let me tell you a bit about myself.',
    audioUrl: '/audio/about.mp3',
    route: '/about',
    duration: 20,
    autoNavigate: true
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Here\'s my professional journey',
    audioUrl: '/audio/experience.mp3',
    route: '/experience',
    duration: 18,
    autoNavigate: true
  }
]

export function AudioGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [tourStarted, setTourStarted] = useState(false)
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false)
  const [isNavigatingProgrammatically, setIsNavigatingProgrammatically] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  
  const currentStep = tourSteps[currentStepIndex]

  // Auto-play audio when page changes if tour is active
  useEffect(() => {
    if (!tourStarted) return

    // Find the step that matches the current page
    const matchingStepIndex = tourSteps.findIndex(step => step.route === pathname)
    
    if (matchingStepIndex !== -1 && matchingStepIndex !== currentStepIndex) {
      // Always update the step to match the current page
      setCurrentStepIndex(matchingStepIndex)
      setProgress(0)
      setIsPlaying(false)
      setAudioLoaded(false)
      
      // Only auto-play if auto-play is enabled
      if (autoPlayEnabled) {
        setTimeout(() => {
          playAudio()
        }, 150)
      }
    }
  }, [pathname, tourStarted, autoPlayEnabled])

  // Update progress
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      const progress = (audio.currentTime / audio.duration) * 100
      setProgress(progress)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (autoPlayEnabled) {
        // Add a small delay to ensure audio has completely finished
        setTimeout(() => {
          nextStep()
        }, 100)
      }
    }

    const handleLoadedData = () => {
      setAudioLoaded(true)
      // Auto-play when new audio loads if tour is active and auto-play is enabled
      if (tourStarted && autoPlayEnabled && !isPlaying) {
        playAudio()
      }
    }

    const handleCanPlayThrough = () => {
      setAudioLoaded(true)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('canplaythrough', handleCanPlayThrough)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
    }
  }, [currentStepIndex, tourStarted, autoPlayEnabled])

  // Navigate when step changes (only if auto-navigate is enabled for that step and we're in auto mode)
  useEffect(() => {
    if (!tourStarted || !autoPlayEnabled) return
    
    // Only navigate programmatically if we're in auto mode and the current page doesn't match the step
    if (currentStep.autoNavigate && currentStep.route && pathname !== currentStep.route && !isNavigatingProgrammatically) {
      setIsNavigatingProgrammatically(true)
      router.push(currentStep.route)
      // Reset the flag after navigation
      setTimeout(() => setIsNavigatingProgrammatically(false), 300)
    }
  }, [currentStepIndex, tourStarted, autoPlayEnabled, router, pathname, isNavigatingProgrammatically])

  const startTour = () => {
    setTourStarted(true)
    setAutoPlayEnabled(false)
    setIsOpen(true)
    setAudioLoaded(false)
    
    // Find the step that matches the current page or start from beginning
    const matchingStepIndex = tourSteps.findIndex(step => step.route === pathname)
    if (matchingStepIndex !== -1) {
      setCurrentStepIndex(matchingStepIndex)
      // Wait a bit for the audio element to update with the new source
      setTimeout(() => {
        playAudio()
      }, 100)
    } else {
      // Start from beginning if no matching route
      setCurrentStepIndex(0)
      setTimeout(() => {
        playAudio()
      }, 100)
    }
  }

  const playAudio = () => {
    const audio = audioRef.current
    if (audio) {
      // Ensure the audio is loaded before attempting to play
      const attemptPlay = () => {
        audio.play().catch(error => {
          console.log('Audio play failed:', error)
          // Handle autoplay restrictions
        })
        setIsPlaying(true)
      }

      if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or better
        attemptPlay()
      } else {
        // Wait for audio to load
        const onCanPlay = () => {
          attemptPlay()
          audio.removeEventListener('canplay', onCanPlay)
        }
        audio.addEventListener('canplay', onCanPlay)
        audio.load() // Force reload if needed
      }
    }
  }

  const pauseAudio = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio()
    } else {
      if (!tourStarted) {
        startTour()
      } else {
        playAudio()
      }
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (audio) {
      audio.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleAutoPlay = () => {
    setAutoPlayEnabled(!autoPlayEnabled)
    if (!autoPlayEnabled && tourStarted) {
      // If enabling auto-play and tour is active, start playing current audio
      playAudio()
    }
  }

  const nextStep = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      const nextStepIndex = currentStepIndex + 1
      setCurrentStepIndex(nextStepIndex)
      setProgress(0)
      setIsPlaying(false)
      setAudioLoaded(false)
      
      // Navigate to the next page if not in auto mode
      if (!autoPlayEnabled && tourSteps[nextStepIndex].route) {
        router.push(tourSteps[nextStepIndex].route)
      }
    } else {
      // Tour completed
      setTourStarted(false)
      setAutoPlayEnabled(false)
      setIsPlaying(false)
      setCurrentStepIndex(0)
      setProgress(0)
      setAudioLoaded(false)
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevStepIndex = currentStepIndex - 1
      setCurrentStepIndex(prevStepIndex)
      setProgress(0)
      setIsPlaying(false)
      setAudioLoaded(false)
      
      // Navigate to the previous page if not in auto mode
      if (!autoPlayEnabled && tourSteps[prevStepIndex].route) {
        router.push(tourSteps[prevStepIndex].route)
      }
    }
  }

  const closeTour = () => {
    pauseAudio()
    setIsOpen(false)
    setTourStarted(false)
    setAutoPlayEnabled(false)
    setCurrentStepIndex(0)
    setProgress(0)
    setAudioLoaded(false)
  }

  return (
    <>
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentStep.audioUrl}
        preload="metadata"
        muted={isMuted}
      />

      {/* Floating Audio Guide Button */}
      {!isOpen && (
        <button
          onClick={startTour}
          className="fixed bottom-3 sm:bottom-14 left-3 z-40 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          aria-label="Start audio tour"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      )}

      {/* Audio Guide Widget */}
      {isOpen && (
        <>
          {/* Mobile: Fixed bottom bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border p-3 sm:hidden">
            <div className="flex items-center justify-between">
              {/* Left side: Title and step info */}
              <div className="flex-1 min-w-0 mr-3">
                <h4 className="font-medium text-sm truncate">{currentStep.title}</h4>
                <p className="text-xs text-muted-foreground">
                  Step {currentStepIndex + 1} of {tourSteps.length}
                  {autoPlayEnabled && <span className="ml-2 text-primary">• Auto</span>}
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-1 mt-2">
                  <div
                    className="bg-primary h-1 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Right side: Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous step"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={currentStepIndex === tourSteps.length - 1}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next step"
                >
                  <SkipForward className="h-4 w-4" />
                </button>

                <button
                  onClick={toggleAutoPlay}
                  className={`p-2 rounded transition-colors ${
                    autoPlayEnabled 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label="Toggle auto-play"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
                
                <button
                  onClick={closeTour}
                  className="p-2 text-muted-foreground hover:text-foreground"
                  aria-label="Close tour"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop: Popup widget */}
          <div className="hidden sm:block fixed bottom-14 left-3 z-40 bg-background border border-border rounded-lg shadow-lg p-4 w-[280px] sm:w-[300px] max-w-[calc(100vw-1.5rem)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm mb-1">{currentStep.title}</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleAutoPlay}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    autoPlayEnabled 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  aria-label="Toggle auto-play"
                >
                  Auto
                </button>
                <button
                  onClick={closeTour}
                  className="text-muted-foreground hover:text-foreground p-1"
                  aria-label="Close tour"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Current Step Info */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentStep.description}
              </p>
              <div className="text-xs text-muted-foreground mt-1">
                Step {currentStepIndex + 1} of {tourSteps.length}
                {autoPlayEnabled && <span className="ml-2 text-primary">• Auto-playing</span>}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-1 mb-4">
              <div
                className="bg-primary h-1 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous step"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={currentStepIndex === tourSteps.length - 1}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next step"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={toggleMute}
                className="p-2 text-muted-foreground hover:text-foreground"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}