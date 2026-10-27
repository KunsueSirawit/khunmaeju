'use client'

import type { ComponentProps } from 'react'

import { Link, usePathname } from '@/i18n/navigation'

/** Menu link that marks itself aria-current="page" on its own section (/products also matches /products/x). */
export function NavLink({ href, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname()
  const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
  return <Link href={href} aria-current={active ? 'page' : undefined} {...rest} />
}
