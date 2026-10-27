import type { ComponentProps } from 'react'

/**
 * A plain <a> when there is somewhere to go, otherwise a <span> with the same content.
 * Contact details can be filled in before their URL (e.g. a LINE ID without the add-friend link),
 * and an <a> without href is not a link for keyboards, screen readers or search engines.
 */
export function MaybeLink({ href, ...props }: Omit<ComponentProps<'a'>, 'href'> & { href?: string | null }) {
  if (!href) {
    const { className, children } = props
    return <span className={className}>{children}</span>
  }
  return <a href={href} {...props} />
}
