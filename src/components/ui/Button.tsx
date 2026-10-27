import type { ReactNode } from 'react'

import { CMSLink } from './CMSLink'

type Variant = 'primary' | 'accent' | 'outline' | 'outlineLight' | 'line'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800',
  accent: 'bg-accent-500 text-brand-900 hover:bg-accent-400',
  outline: 'border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white',
  outlineLight: 'border border-white/70 text-white hover:bg-white hover:text-brand-800',
  line: 'bg-[#06c755] text-white hover:bg-[#05b14c]',
}

export const buttonClass = (variant: Variant = 'primary', extra = '') =>
  `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-base font-semibold transition-colors ${variants[variant]} ${extra}`

type Props = {
  href: string | null | undefined
  variant?: Variant
  className?: string
  children: ReactNode
}

export function Button({ href, variant = 'primary', className = '', children }: Props) {
  return (
    <CMSLink href={href} className={buttonClass(variant, className)}>
      {children}
    </CMSLink>
  )
}
