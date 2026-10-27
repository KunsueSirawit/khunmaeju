'use server'

import { headers } from 'next/headers'

import { payloadClient } from '@/lib/payload'

export type ContactField = 'name' | 'phone' | 'email' | 'message'
export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; error: 'invalid' | 'rateLimited' | 'server'; fields?: ContactField[] }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[+\d][\d\s-]{6,19}$/

// Simple per-IP limit: 5 messages per 10 minutes. In-memory is enough for a single VPS process.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > MAX_PER_WINDOW
}

const text = (form: FormData, key: string, max: number) => String(form.get(key) ?? '').trim().slice(0, max)

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (text(form, 'website', 200)) return { status: 'success' }

  const data = {
    name: text(form, 'name', 120),
    phone: text(form, 'phone', 40),
    email: text(form, 'email', 200),
    subject: text(form, 'subject', 200),
    message: text(form, 'message', 5000),
    locale: text(form, 'locale', 5) || 'th',
  }

  const invalid: ContactField[] = []
  if (!data.name) invalid.push('name')
  if (!data.message) invalid.push('message')
  if (data.email && !EMAIL.test(data.email)) invalid.push('email')
  if (data.phone && !PHONE.test(data.phone)) invalid.push('phone')
  // We need at least one way to reply.
  if (!data.email && !data.phone) invalid.push('phone', 'email')
  if (invalid.length) return { status: 'error', error: 'invalid', fields: [...new Set(invalid)] }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  if (rateLimited(ip)) return { status: 'error', error: 'rateLimited' }

  if (process.env.USE_FIXTURES === 'true' && process.env.NODE_ENV !== 'production') {
    console.info('[contact] fixture mode, not saved:', data)
    return { status: 'success' }
  }

  try {
    const payload = await payloadClient()
    // The collection blocks public creates; this server-side call is the only way in.
    await payload.create({ collection: 'contact-submissions', data, overrideAccess: true })
    return { status: 'success' }
  } catch (err) {
    console.error('[contact] save failed', err)
    return { status: 'error', error: 'server' }
  }
}
