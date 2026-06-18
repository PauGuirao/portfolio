'use client'

import { useEffect, useRef, useState } from 'react'
import { DinoGame } from '@/components/dino-game'
import { ChessPawnIcon } from '@/components/icons/chess-pawn-icon'

const DESCRIPTION = 'I love building cool products'
// Tall enough for the 150px game canvas plus a little breathing room.
const GAME_MAX_HEIGHT = 162
// Collapse down to one text line (matches the <p> min-height) instead of 0,
// so swapping the game out for the paragraph doesn't jump the layout.
const COLLAPSED_HEIGHT = 20

type Phase = 'text' | 'deleting' | 'typing'

export function MeDinoSection() {
  const [phase, setPhase] = useState<Phase>('text')
  const [typed, setTyped] = useState(DESCRIPTION)
  const [gameMounted, setGameMounted] = useState(false)
  const [gameExpanded, setGameExpanded] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Drive the typewriter erase / retype animations.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)

    if (phase === 'deleting') {
      if (typed.length === 0) {
        // Text is gone — mount the game collapsed, then expand it next frame.
        setGameMounted(true)
        return
      }
      timer.current = setTimeout(() => setTyped((t) => t.slice(0, -1)), 32)
    } else if (phase === 'typing') {
      if (typed.length === DESCRIPTION.length) {
        setPhase('text')
        return
      }
      timer.current = setTimeout(
        () => setTyped(DESCRIPTION.slice(0, typed.length + 1)),
        38
      )
    }

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [phase, typed])

  // Once the game is in the DOM (collapsed), flip to expanded on the next
  // frame so the max-height transition actually runs.
  useEffect(() => {
    if (!gameMounted) return
    const id = requestAnimationFrame(() => setGameExpanded(true))
    return () => cancelAnimationFrame(id)
  }, [gameMounted])

  const toggle = () => {
    if (gameMounted) {
      // Collapse the game smoothly; retype the text once it's closed.
      setGameExpanded(false)
    } else if (phase !== 'deleting') {
      // Erase the description first, then the game opens.
      setPhase('deleting')
    }
  }

  // When the collapse transition finishes, tear down the game and retype.
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'max-height' || gameExpanded) return
    setGameMounted(false)
    setPhase('typing')
  }

  const showingCaret = phase === 'deleting' || phase === 'typing'

  return (
    <div className="flex flex-col items-start gap-4 self-start w-full">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-sans font-semibold text-foreground">Me</h3>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={gameMounted}
          aria-label={gameMounted ? 'Close dinosaur game' : 'Play the dinosaur game'}
          title={gameMounted ? 'Close game' : 'Play the no-internet dino game'}
          className="text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
        >
          <ChessPawnIcon size={15} aria-hidden="true" />
        </button>
      </div>

      {gameMounted ? (
        <div
          className="dino-collapse w-full overflow-hidden"
          style={{
            maxHeight: gameExpanded ? GAME_MAX_HEIGHT : COLLAPSED_HEIGHT,
            opacity: gameExpanded ? 1 : 0,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <DinoGame />
        </div>
      ) : (
        <p className="text-sm font-sans text-muted-foreground min-h-[1.25rem]">
          {typed}
          {showingCaret && <span className="dino-caret">|</span>}
        </p>
      )}

      <style jsx>{`
        .dino-caret {
          display: inline-block;
          margin-left: 1px;
          font-weight: 400;
          color: hsl(var(--foreground));
          animation: dino-blink 1s steps(1) infinite;
        }
        @keyframes dino-blink {
          0%,
          50% {
            opacity: 1;
          }
          50.01%,
          100% {
            opacity: 0;
          }
        }
        .dino-collapse {
          transition:
            max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.4s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .dino-collapse {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}
