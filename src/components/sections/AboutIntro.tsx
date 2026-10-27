import { getTranslations } from 'next-intl/server'

import type { HomePage } from '@/payload-types'

import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { MediaImage } from '../ui/MediaImage'

export async function AboutIntro({ about }: { about: NonNullable<HomePage['about']> }) {
  const t = await getTranslations('Home')
  return (
    <section aria-labelledby="about-heading" className="section bg-cream">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-last lg:order-first">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-sand shadow-[var(--shadow-card)]">
            <MediaImage
              media={about.image}
              size="wide"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <span
            aria-hidden
            className="absolute -right-3 -bottom-3 -z-10 hidden size-40 rounded-[var(--radius-card)] bg-accent-100 sm:block"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold tracking-wide text-accent-600">{t('aboutEyebrow')}</p>
          <h2 id="about-heading" className="text-3xl font-bold text-brand-800 sm:text-4xl">
            {about.heading}
          </h2>
          <span aria-hidden className="mt-4 block h-1 w-14 rounded-full bg-accent-500" />
          {about.body && <p className="mt-5 text-lg whitespace-pre-line text-muted">{about.body}</p>}

          {!!about.stats?.length && (
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {about.stats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-col-reverse rounded-xl border border-line bg-white px-4 py-4 text-center"
                >
                  <dt className="mt-1 text-sm text-muted">{stat.label}</dt>
                  <dd className="font-heading text-3xl font-bold text-brand-700">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {about.cta?.label && (
            <Button href={about.cta.href} className="mt-8">
              {about.cta.label}
              <Icon name="arrowRight" className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
