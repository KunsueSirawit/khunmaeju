import { Link } from '@/i18n/navigation'
import type { SiteSetting } from '@/payload-types'

import { MediaImage, asMedia } from '../ui/MediaImage'

type Props = {
  settings: Pick<SiteSetting, 'siteName' | 'logo' | 'logoLight'>
  tone?: 'dark' | 'light'
  className?: string
}

/** Uploaded logo when there is one, otherwise a text wordmark (placeholder until the vector logo arrives). */
export function Logo({ settings, tone = 'dark', className = '' }: Props) {
  const logo = asMedia(tone === 'light' ? settings.logoLight || settings.logo : settings.logo)
  return (
    <Link href="/" className={`inline-flex items-center gap-3 ${className}`} aria-label={settings.siteName}>
      {logo ? (
        <MediaImage media={logo} className="h-12 w-auto sm:h-14" priority />
      ) : (
        <>
          <span
            aria-hidden
            className={`grid size-11 place-items-center rounded-full font-heading text-xl font-bold ${
              tone === 'light' ? 'bg-accent-500 text-brand-900' : 'bg-brand-700 text-accent-400'
            }`}
          >
            จู้
          </span>
          <span className="leading-tight whitespace-nowrap">
            <span className={`block font-heading text-lg font-bold ${tone === 'light' ? 'text-white' : 'text-brand-800'}`}>
              คุณแม่จู้
            </span>
            <span className={`block text-xs ${tone === 'light' ? 'text-white/70' : 'text-muted'}`}>
              ของฝากเมืองภูเก็ต
            </span>
          </span>
        </>
      )}
    </Link>
  )
}
