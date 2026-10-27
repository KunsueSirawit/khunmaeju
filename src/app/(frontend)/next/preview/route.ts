import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { payloadClient } from '@/lib/payload'

/**
 * Entry point for the admin "Preview" button and Live Preview iframe.
 * Only a logged-in admin/editor can turn on draft mode; the path must be on this site.
 */
export async function GET(req: NextRequest): Promise<Response> {
  const path = req.nextUrl.searchParams.get('path') || ''
  if (!/^\/(th|en)\/[a-z0-9/_-]*$/i.test(path)) {
    return new Response('Invalid preview path', { status: 400 })
  }

  const payload = await payloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return new Response('You must be logged in to preview', { status: 403 })
  }

  ;(await draftMode()).enable()
  redirect(path)
}
