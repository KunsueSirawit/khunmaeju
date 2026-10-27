import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'

import { MediaImage } from './MediaImage'
import type { Media } from '@/payload-types'

export type Crumb = { label: string; href?: string }

type Props = {
  title: string
  intro?: string | null
  crumbs?: Crumb[]
  image?: number | Media | null
}

/** Banner at the top of every inner page: breadcrumb, title, optional intro and photo. */
export async function PageHeader({ title, intro, crumbs = [], image }: Props) {
  const t = await getTranslations('Nav')
  const trail: Crumb[] = [{ label: t('home'), href: '/' }, ...crumbs]

  return (
    <section className="relative isolate overflow-hidden bg-brand-800 text-white">
      {image && (
        <>
          <MediaImage media={image} size="wide" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/95 via-brand-900/85 to-brand-900/70" />
        </>
      )}
      <div className="container-page py-10 sm:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 text-sm text-white/70">
            {trail.map((crumb, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {crumb.href && i < trail.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current={i === trail.length - 1 ? 'page' : undefined} className="text-white">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        <span aria-hidden className="mt-4 block h-1 w-14 rounded-full bg-accent-500" />
        {intro && <p className="mt-4 max-w-2xl text-lg whitespace-pre-line text-white/85">{intro}</p>}
      </div>
    </section>
  )
}
