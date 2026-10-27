import type { SiteSetting } from '@/payload-types'

import { Icon, type IconName } from '../ui/Icon'

type Props = {
  settings: Pick<SiteSetting, 'facebookUrl' | 'instagramUrl' | 'lineUrl'>
  className?: string
  itemClassName?: string
}

export function SocialLinks({ settings, className = '', itemClassName = '' }: Props) {
  const items: { name: IconName; label: string; href?: string | null }[] = [
    { name: 'facebook', label: 'Facebook', href: settings.facebookUrl },
    { name: 'instagram', label: 'Instagram', href: settings.instagramUrl },
    { name: 'line', label: 'LINE', href: settings.lineUrl },
  ]
  const visible = items.filter((item) => item.href)
  if (!visible.length) return null

  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {visible.map((item) => (
        <li key={item.name}>
          <a
            href={item.href!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={`grid size-9 place-items-center rounded-full transition-colors ${itemClassName}`}
          >
            <Icon name={item.name} className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  )
}
