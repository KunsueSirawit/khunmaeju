import { getTranslations } from 'next-intl/server'

import { telHref } from '@/lib/format'
import type { Branch } from '@/payload-types'

import { buttonClass } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { MediaImage } from '../ui/MediaImage'
import { SectionHeading } from '../ui/SectionHeading'

type Props = {
  heading?: string | null
  subheading?: string | null
  branches: Pick<Branch, 'id' | 'name' | 'address' | 'openingHours' | 'phone' | 'mapUrl' | 'image'>[]
}

export async function BranchesSection({ heading, subheading, branches }: Props) {
  if (!branches.length) return null
  const t = await getTranslations('Home')
  return (
    <section aria-labelledby="branches-heading" className="section bg-cream">
      <div className="container-page">
        <SectionHeading id="branches-heading" eyebrow={t('branchesEyebrow')} heading={heading} subheading={subheading} />
        <ul className={`grid gap-6 ${branches.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : 'mx-auto max-w-4xl'}`}>
          {branches.map((branch) => {
            const tel = telHref(branch.phone)
            return (
              <li key={branch.id}>
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] ${
                    branches.length === 1 ? 'md:flex-row' : ''
                  }`}
                >
                  <div className={`relative aspect-[16/10] bg-sand ${branches.length === 1 ? 'md:aspect-auto md:w-1/2' : ''}`}>
                    <MediaImage media={branch.image} size="card" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h3 className="font-heading text-2xl font-semibold text-brand-800">{branch.name}</h3>
                    <p className="flex gap-3 text-muted">
                      <Icon name="mapPin" className="mt-1 size-5 shrink-0 text-accent-500" />
                      <span className="whitespace-pre-line">{branch.address}</span>
                    </p>
                    {branch.openingHours && (
                      <p className="flex gap-3 text-muted">
                        <Icon name="clock" className="mt-1 size-5 shrink-0 text-accent-500" />
                        {branch.openingHours}
                      </p>
                    )}
                    {branch.phone && (
                      <p className="flex gap-3 text-muted">
                        <Icon name="phone" className="mt-1 size-5 shrink-0 text-accent-500" />
                        {tel ? <a href={tel} className="hover:text-brand-700">{branch.phone}</a> : branch.phone}
                      </p>
                    )}
                    {branch.mapUrl && (
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClass('primary', 'mt-auto self-start')}
                      >
                        <Icon name="mapPin" className="size-5" />
                        {t('directions')}
                      </a>
                    )}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
