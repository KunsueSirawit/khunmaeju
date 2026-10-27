import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { MediaImage } from '@/components/ui/MediaImage'
import { PageHeader } from '@/components/ui/PageHeader'
import { RichText } from '@/components/ui/RichText'
import { getServicesPage } from '@/lib/data'
import { type LocaleParams, resolveLocale } from '@/lib/locale'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const page = await getServicesPage(locale)
  return { title: page.heading, description: page.intro ?? undefined }
}

/** One page, one section per service, each reachable at /services#anchor. */
export default async function ServicesPage({ params }: LocaleParams) {
  const { locale } = await resolveLocale(params)
  const [page, t] = await Promise.all([getServicesPage(locale), getTranslations('Services')])
  const sections = page.sections ?? []

  return (
    <>
      <PageHeader title={page.heading} intro={page.intro} crumbs={[{ label: page.heading }]} />

      {sections.length > 1 && (
        <nav aria-label={t('jumpTo')} className="sticky top-[6.5rem] z-30 border-b border-line bg-white/95 backdrop-blur lg:top-[7.5rem]">
          <ul className="container-page flex gap-2 overflow-x-auto py-3">
            {sections.map((s) => (
              <li key={s.id ?? s.anchor} className="shrink-0">
                <a
                  href={`#${s.anchor}`}
                  className="block rounded-full border border-line px-4 py-1.5 whitespace-nowrap hover:border-brand-500 hover:text-brand-700"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {sections.map((s, i) => (
        <section
          key={s.id ?? s.anchor}
          id={s.anchor}
          aria-labelledby={`${s.anchor}-heading`}
          className={`section ${i % 2 ? 'bg-white' : 'bg-cream'}`}
        >
          <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-sand shadow-[var(--shadow-card)] ${i % 2 ? 'lg:order-last' : ''}`}>
              <MediaImage media={s.image} size="wide" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 id={`${s.anchor}-heading`} className="text-3xl font-bold text-brand-800 sm:text-4xl">
                {s.title}
              </h2>
              <span aria-hidden className="mt-4 mb-6 block h-1 w-14 rounded-full bg-accent-500" />
              <RichText data={s.body} locale={locale} />
              {s.cta?.label && (
                <Button href={s.cta.href} className="mt-8">
                  {s.cta.label}
                  <Icon name="arrowRight" className="size-5" />
                </Button>
              )}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
