import { Anuphan, IBM_Plex_Sans_Thai } from 'next/font/google'

// Self-hosted at build time by next/font: no request to Google from visitors' browsers.
// `subsets` only picks what is preloaded: Latin files still load on demand (unicode-range),
// so preloading Thai alone keeps the first render light on mobile.
export const headingFont = Anuphan({
  subsets: ['thai'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-heading-face',
})

export const bodyFont = IBM_Plex_Sans_Thai({
  subsets: ['thai'],
  // Each weight is a separate file (unlike Anuphan, which is variable); font-medium falls back to 400.
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-body',
})
