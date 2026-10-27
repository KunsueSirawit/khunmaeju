import { getTranslations } from 'next-intl/server'

import type { HomePage } from '@/payload-types'

import { Button } from '../ui/Button'
import { CMSLink } from '../ui/CMSLink'
import { Icon } from '../ui/Icon'
import { MediaImage } from '../ui/MediaImage'
import { SectionHeading } from '../ui/SectionHeading'

export async function ServicesGrid({ services }: { services: NonNullable<HomePage['services']> }) {
  if (!services.items?.length) return null
  const t = await getTranslations('Home')
  return (
    <section aria-labelledby="services-heading" className="section bg-sand">
      <div className="container-page">
        <SectionHeading id="services-heading" eyebrow={t('servicesEyebrow')} heading={services.heading} subheading={services.subheading} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((item) => (
            <li key={item.id}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-100">
                  <MediaImage
                    media={item.image}
                    size="card"
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-xl font-semibold text-brand-800">
                    <CMSLink href={item.href} className="after:absolute after:inset-0">
                      {item.title}
                    </CMSLink>
                  </h3>
                  {item.description && <p className="mt-2 text-muted">{item.description}</p>}
                  <span
                    aria-hidden
                    className="mt-auto grid size-10 place-items-center self-start rounded-full bg-accent-500 text-brand-900 transition-transform group-hover:translate-x-1"
                  >
                    <Icon name="arrowRight" className="size-5" />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Button href="/services" variant="outline">
            {t('allServices')}
            <Icon name="arrowRight" className="size-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
