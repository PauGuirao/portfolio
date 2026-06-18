'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A self-contained Chrome-style offline T-Rex game rendered on a canvas.
 * Controls: Space / ArrowUp / click / tap to jump (and to start / restart).
 * Colors are read from the current theme so it works in light and dark mode.
 *
 * Beating the global #1 record (stored in Vercel Blob via /api/leaderboard)
 * pops an inline form to leave a name. Only the single top name is kept.
 */

// Logical pixel-dino, drawn as filled rectangles relative to its top-left.
// Coordinates live in a 40 (w) x 42 (h) box, head facing right.
const DINO_W = 40
const DINO_H = 42

type Rect = [x: number, y: number, w: number, h: number]

// Body parts that never change between animation frames.
const DINO_BODY: Rect[] = [
  [22, 0, 18, 16], // head
  [16, 12, 12, 16], // neck / upper body
  [10, 20, 22, 12], // belly
  [0, 16, 12, 8], // tail
  [32, 18, 6, 4], // little arm
]
// Eye cut-out (drawn with the background color).
const DINO_EYE: Rect = [33, 4, 4, 4]
// Two leg poses for the running animation.
const DINO_LEGS_A: Rect[] = [
  [12, 32, 6, 10],
  [22, 32, 6, 6],
]
const DINO_LEGS_B: Rect[] = [
  [12, 32, 6, 6],
  [22, 32, 6, 10],
]

const HEIGHT = 150
const GROUND_Y = 128
const MAX_NAME_LEN = 12

type Record = { name: string; score: number }

const pad = (n: number) => String(Math.floor(n)).padStart(5, '0')

export function DinoGame() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // The global #1 record shown to everyone.
  const [record, setRecord] = useState<Record>({ name: '', score: 0 })
  // A freshly-set score awaiting a name (null = no prompt open).
  const [pending, setPending] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Refs let the imperative game loop read live React state without re-binding.
  const recordRef = useRef(record)
  const pendingRef = useRef(false)
  const onGameOverRef = useRef<(score: number) => void>(() => {})

  useEffect(() => {
    recordRef.current = record
  }, [record])

  // Load the current record: local mirror first (instant), then the server.
  useEffect(() => {
    let cancelled = false
    try {
      const local = JSON.parse(localStorage.getItem('dino-top') || 'null')
      if (local && typeof local.score === 'number') {
        setRecord({ name: String(local.name || ''), score: local.score })
      }
    } catch {
      /* ignore */
    }
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data || typeof data.score !== 'number') return
        if (data.score > 0) {
          setRecord((prev) =>
            data.score >= prev.score
              ? { name: String(data.name || ''), score: data.score }
              : prev
          )
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Fires when a run ends; opens the name prompt if it beat the global record.
  onGameOverRef.current = (finalScore: number) => {
    if (finalScore > recordRef.current.score) {
      pendingRef.current = true
      setName('')
      setPending(finalScore)
    }
  }

  const closePrompt = () => {
    pendingRef.current = false
    setPending(null)
    setName('')
  }

  const submitName = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalScore = pending
    const nm = name.trim().slice(0, MAX_NAME_LEN)
    if (!nm || finalScore == null) return
    setSubmitting(true)
    const optimistic: Record = { name: nm, score: finalScore }
    // Mirror locally so it survives even if the network call fails.
    try {
      localStorage.setItem('dino-top', JSON.stringify(optimistic))
    } catch {
      /* ignore */
    }
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: nm, score: finalScore }),
      })
      const data = await res.json()
      if (data && typeof data.score === 'number' && data.score >= finalScore && data.name) {
        // Server may hold a higher record set by someone else meanwhile.
        setRecord({ name: String(data.name), score: data.score })
      } else {
        setRecord(optimistic)
      }
    } catch {
      setRecord(optimistic)
    } finally {
      setSubmitting(false)
      closePrompt()
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2))
    let fg = '#000'
    let bg = '#fff'

    const readColors = () => {
      fg = getComputedStyle(canvas).color || '#000'
      bg = getComputedStyle(document.body).backgroundColor || '#fff'
    }

    // Game state
    type Obstacle = { x: number; w: number; h: number }
    let dinoY = GROUND_Y - DINO_H // top of dino
    let velY = 0
    let obstacles: Obstacle[] = []
    let speed = 4.2
    let nextGap = 0
    let score = 0
    let state: 'idle' | 'running' | 'over' = 'idle'
    let frameTick = 0
    let raf = 0
    let lastTime = 0

    const GRAVITY = 0.6
    const JUMP_V = -10
    const START_SPEED = 4.2
    const MAX_SPEED = 9.5

    // Pixels until the next cactus. Always leaves enough room to clear a jump
    // (scales with speed), plus a random slice so the rhythm keeps changing.
    const computeGap = () => {
      const minClear = Math.max(speed * 34, 130)
      return minClear + 30 + Math.random() * 170
    }

    const resize = () => {
      width = Math.max(260, Math.min(wrapper.clientWidth, 560))
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2))
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(HEIGHT * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${HEIGHT}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      readColors()
    }

    const reset = () => {
      dinoY = GROUND_Y - DINO_H
      velY = 0
      obstacles = []
      speed = START_SPEED
      nextGap = computeGap()
      score = 0
      frameTick = 0
      readColors()
    }

    const jump = () => {
      if (state === 'idle' || state === 'over') {
        state = 'running'
        reset()
        velY = JUMP_V
        return
      }
      // Only jump when on the ground.
      if (dinoY >= GROUND_Y - DINO_H - 0.5) {
        velY = JUMP_V
      }
    }

    const spawnObstacle = () => {
      // Three cactus flavours: small, tall, and a wide double.
      const r = Math.random()
      let w = 12
      let h = 24
      if (r > 0.78) {
        w = 28
        h = 30
      } else if (r > 0.45) {
        w = 18
        h = 34
      }
      obstacles.push({ x: width + 10, w, h })
      nextGap = computeGap()
    }

    const drawRects = (rects: Rect[], ox: number, oy: number, color: string) => {
      ctx.fillStyle = color
      for (const [x, y, w, h] of rects) {
        ctx.fillRect(Math.round(ox + x), Math.round(oy + y), w, h)
      }
    }

    const drawDino = () => {
      const ox = 24
      const grounded = dinoY >= GROUND_Y - DINO_H - 0.5
      drawRects(DINO_BODY, ox, dinoY, fg)
      // Legs only animate while grounded and running.
      const legs = !grounded
        ? DINO_LEGS_A
        : Math.floor(frameTick / 6) % 2 === 0
          ? DINO_LEGS_A
          : DINO_LEGS_B
      drawRects(legs, ox, dinoY, fg)
      drawRects([DINO_EYE], ox, dinoY, bg)
    }

    const drawCactus = (o: Obstacle) => {
      ctx.fillStyle = fg
      const baseY = GROUND_Y - o.h
      // main column
      ctx.fillRect(Math.round(o.x), Math.round(baseY), o.w, o.h)
      // arms
      const armH = o.h * 0.4
      ctx.fillRect(Math.round(o.x - 5), Math.round(baseY + o.h * 0.35), 5, armH)
      ctx.fillRect(Math.round(o.x + o.w), Math.round(baseY + o.h * 0.25), 5, armH)
    }

    const drawGround = () => {
      ctx.strokeStyle = fg
      ctx.globalAlpha = 0.6
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, GROUND_Y + 1)
      ctx.lineTo(width, GROUND_Y + 1)
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    const drawText = (text: string, sub?: string) => {
      ctx.fillStyle = fg
      ctx.globalAlpha = 0.85
      ctx.textAlign = 'center'
      ctx.font = '600 13px ui-sans-serif, system-ui, sans-serif'
      ctx.fillText(text, width / 2, HEIGHT / 2 - 6)
      if (sub) {
        ctx.globalAlpha = 0.55
        ctx.font = '400 11px ui-sans-serif, system-ui, sans-serif'
        ctx.fillText(sub, width / 2, HEIGHT / 2 + 12)
      }
      ctx.globalAlpha = 1
      ctx.textAlign = 'start'
    }

    const drawHud = () => {
      // Top-right: global #1 record (name + score) followed by the current run.
      const rec = recordRef.current
      const hi =
        rec.score > 0
          ? `HI ${pad(rec.score)} ${(rec.name || '???').toUpperCase()}  `
          : ''
      ctx.fillStyle = fg
      ctx.globalAlpha = 0.6
      ctx.font = '500 11px ui-monospace, monospace'
      ctx.textAlign = 'right'
      ctx.fillText(`${hi}${pad(score)}`, width - 4, 16)
      ctx.globalAlpha = 1
      ctx.textAlign = 'start'
    }

    const collides = (o: Obstacle) => {
      const dx = 24 + 8
      const dw = DINO_W - 14
      const dy = dinoY + 4
      const dh = DINO_H - 6
      const ox = o.x
      const oy = GROUND_Y - o.h
      return dx < ox + o.w && dx + dw > ox && dy < GROUND_Y && dy + dh > oy
    }

    const loop = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 16.6667, 3) : 1
      lastTime = time
      ctx.clearRect(0, 0, width, HEIGHT)
      drawGround()

      if (state === 'running') {
        frameTick += dt
        // Physics
        velY += GRAVITY * dt
        dinoY += velY * dt
        if (dinoY > GROUND_Y - DINO_H) {
          dinoY = GROUND_Y - DINO_H
          velY = 0
        }
        // Obstacles
        for (const o of obstacles) o.x -= speed * dt
        obstacles = obstacles.filter((o) => o.x + o.w > -10)
        // Spawn once the last obstacle has travelled its randomized gap.
        const last = obstacles[obstacles.length - 1]
        if (!last || width - last.x >= nextGap) {
          spawnObstacle()
        }
        // Score + difficulty: speed ramps until it caps out.
        score += dt * 0.35
        if (speed < MAX_SPEED) speed = Math.min(MAX_SPEED, speed + dt * 0.0026)
        // Collision
        for (const o of obstacles) {
          if (collides(o)) {
            state = 'over'
            onGameOverRef.current(Math.floor(score))
          }
        }
      }

      for (const o of obstacles) drawCactus(o)
      drawDino()
      drawHud()

      if (state === 'idle') {
        drawText('Press space or tap to start', '\u{1F996} dodge the cacti')
      } else if (state === 'over' && !pendingRef.current) {
        drawText('Game over', 'Press space or tap to play again')
      }

      raf = requestAnimationFrame(loop)
    }

    const onKey = (e: KeyboardEvent) => {
      // While the name prompt is open, let the input handle keys normally.
      if (pendingRef.current) return
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
    }
    const onPointer = (e: Event) => {
      if (pendingRef.current) return
      e.preventDefault()
      jump()
    }

    resize()
    reset()
    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)
    window.addEventListener('keydown', onKey)
    canvas.addEventListener('mousedown', onPointer)
    canvas.addEventListener('touchstart', onPointer, { passive: false })
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('mousedown', onPointer)
      canvas.removeEventListener('touchstart', onPointer)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full select-none">
      <canvas
        ref={canvasRef}
        className="text-foreground cursor-pointer touch-none"
        aria-label="Playable dinosaur game"
        role="img"
      />

      {pending !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
          <form
            onSubmit={submitName}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 shadow-lg"
          >
            <p className="text-xs font-sans font-semibold text-foreground">
              New record! {pad(pending)} 🏆
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX_NAME_LEN}
              autoFocus
              placeholder="Your name"
              aria-label="Your name for the leaderboard"
              className="w-40 rounded-md border border-border bg-background px-2 py-1 text-center text-sm text-foreground outline-none focus:border-foreground"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {submitting ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={closePrompt}
                className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
