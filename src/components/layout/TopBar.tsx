import { telHref } from '@/lib/format'
import type { SiteSetting } from '@/payload-types'

import { Icon } from '../ui/Icon'
import { MaybeLink } from '../ui/MaybeLink'
import { SocialLinks } from './SocialLinks'

export function TopBar({ settings }: { settings: SiteSetting }) {
  const tel = telHref(settings.phone)
  return (
    <div className="bg-brand-900 text-sm text-white/90">
      <div className="container-page flex min-h-10 items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          {settings.phoneDisplay && (
            <MaybeLink href={tel} className="inline-flex items-center gap-1.5 hover:text-accent-400">
              <Icon name="phone" className="size-4" />
              {settings.phoneDisplay}
            </MaybeLink>
          )}
          {settings.lineId && (
            <MaybeLink
              href={settings.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 hover:text-accent-400 sm:inline-flex"
            >
              <Icon name="line" className="size-4" />
              {settings.lineId}
            </MaybeLink>
          )}
        </div>
        <SocialLinks settings={settings} itemClassName="size-8 hover:bg-white/10 hover:text-accent-400" />
      </div>
    </div>
  )
}
