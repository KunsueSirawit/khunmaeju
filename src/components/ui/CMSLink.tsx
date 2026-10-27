import type { ComponentProps, ReactNode } from 'react'

import { Link } from '@/i18n/navigation'

type Props = Omit<ComponentProps<'a'>, 'href'> & {
  href: string | null | undefined
  children: ReactNode
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href)

/**
 * Link typed by an editor in the CMS. Site paths ("/products") get the current
 * locale prefix; full URLs, tel: and mailto: are used as-is.
 */
export function CMSLink({ href, children, ...rest }: Props) {
  if (!href) return <span className={rest.className}>{children}</span>
  if (isExternal(href)) {
    const external = href.startsWith('http')
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}
