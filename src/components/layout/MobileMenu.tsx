'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useId, useState } from 'react'

import { Icon } from '../ui/Icon'
import { LocaleSwitcher } from './LocaleSwitcher'
import { NavLink } from './NavLink'

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const t = useTranslations('Nav')

  // Close on Escape, and lock page scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t(open ? 'closeMenu' : 'openMenu')}
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-full text-brand-800 hover:bg-brand-50"
      >
        <Icon name={open ? 'close' : 'menu'} className="size-6" />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-7rem)] overflow-y-auto border-t border-line bg-white"
      >
        {/* Any link click closes the menu. */}
        <nav aria-label="Mobile" className="container-page py-4" onClick={() => setOpen(false)}>
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="flex min-h-12 items-center justify-between py-3 text-lg font-medium aria-[current=page]:text-brand-700"
                >
                  {item.label}
                  <Icon name="arrowRight" className="size-5 text-accent-500" />
                </NavLink>
              </li>
            ))}
          </ul>
          <LocaleSwitcher className="mt-6 w-fit" />
        </nav>
      </div>
    </div>
  )
}
