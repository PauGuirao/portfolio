import { NextResponse } from 'next/server'
import { list, put } from '@vercel/blob'

// Single global record for the dino game, stored as one tiny JSON blob.
// No database: just `{ name, score }` in Vercel Blob.

export const dynamic = 'force-dynamic'

const BLOB_PATH = 'dino-leaderboard.json'
const MAX_NAME_LEN = 12
const MAX_SCORE = 1_000_000

type Record = { name: string; score: number }

const EMPTY: Record = { name: '', score: 0 }

function configured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

async function readRecord(): Promise<Record> {
  const { blobs } = await list({ prefix: BLOB_PATH })
  const blob = blobs.find((b) => b.pathname === BLOB_PATH)
  if (!blob) return EMPTY
  const res = await fetch(blob.url, { cache: 'no-store' })
  if (!res.ok) return EMPTY
  const data = (await res.json()) as Partial<Record>
  return {
    name: typeof data.name === 'string' ? data.name : '',
    score: typeof data.score === 'number' ? data.score : 0,
  }
}

function sanitizeName(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  // Drop control characters, collapse whitespace, trim, then cap length.
  const cleaned = Array.from(raw)
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0
      return code >= 32 && code !== 127
    })
    .join('')
  return cleaned.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LEN)
}

export async function GET() {
  if (!configured()) {
    return NextResponse.json({ ...EMPTY, configured: false })
  }
  try {
    const record = await readRecord()
    return NextResponse.json({ ...record, configured: true })
  } catch {
    return NextResponse.json({ ...EMPTY, configured: true })
  }
}

export async function POST(request: Request) {
  if (!configured()) {
    return NextResponse.json(
      { ...EMPTY, configured: false, error: 'leaderboard-not-configured' },
      { status: 200 }
    )
  }

  let body: { name?: unknown; score?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid-json' }, { status: 400 })
  }

  const name = sanitizeName(body.name)
  const score = Math.floor(Number(body.score))

  if (!name) {
    return NextResponse.json({ error: 'name-required' }, { status: 400 })
  }
  if (!Number.isFinite(score) || score <= 0 || score > MAX_SCORE) {
    return NextResponse.json({ error: 'invalid-score' }, { status: 400 })
  }

  try {
    const current = await readRecord()
    // Only overwrite if this genuinely beats the global record.
    if (score <= current.score) {
      return NextResponse.json({ ...current, configured: true, beaten: false })
    }
    const next: Record = { name, score }
    await put(BLOB_PATH, JSON.stringify(next), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 0,
    })
    return NextResponse.json({ ...next, configured: true, beaten: true })
  } catch {
    return NextResponse.json({ error: 'write-failed' }, { status: 500 })
  }
}
