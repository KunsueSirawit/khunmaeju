import { Anuphan, IBM_Plex_Sans_Thai } from 'next/font/google'

// Self-hosted at build time by next/font: no request to Google from visitors' browsers.
export const headingFont = Anuphan({
  subsets: ['thai', 'latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-heading-face',
})

export const bodyFont = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
})
