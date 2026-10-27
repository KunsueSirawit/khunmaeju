import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

// Next.js 16 "proxy" (formerly middleware): adds the /th or /en prefix to front-end URLs.
export default createMiddleware(routing)

export const config = {
  // Skip Payload (admin, api), the draft-preview route, Next internals and files with an extension.
  matcher: ['/((?!admin|api|next|_next|_vercel|.*\\..*).*)'],
}
