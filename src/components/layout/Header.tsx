import { getTranslations } from 'next-intl/server'

import { mainNav } from '@/lib/nav'
import type { SiteSetting } from '@/payload-types'

import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { LocaleSwitcher } from './LocaleSwitcher'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { NavLink } from './NavLink'
import { TopBar } from './TopBar'

export async function Header({ settings }: { settings: SiteSetting }) {
  const t = await getTranslations('Nav')
  const items = mainNav.map((item) => ({ href: item.href, label: t(item.key) }))

  return (
    <header className="sticky top-0 z-40">
      <TopBar settings={settings} />
      <div className="relative border-b border-line bg-white/95 backdrop-blur">
        <div className="container-page flex h-18 items-center justify-between gap-4 lg:h-20">
          <Logo settings={settings} />

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center">
              {items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="relative px-3 py-2 font-medium whitespace-nowrap text-ink transition-colors hover:text-brand-600 aria-[current=page]:text-brand-700 aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-0.5 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-accent-500"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher className="hidden sm:flex" />
            {/* Wrapper carries the breakpoint: the button's own inline-flex would override `hidden`. */}
            <div className="hidden xl:block">
              <Button href="/contact" className="!min-h-10 !px-5">
                {t('contact')}
                <Icon name="phone" className="size-4" />
              </Button>
            </div>
            <MobileMenu items={items} />
          </div>
        </div>
      </div>
    </header>
  )
}
