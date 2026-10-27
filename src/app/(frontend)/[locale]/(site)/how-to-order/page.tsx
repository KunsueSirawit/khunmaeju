import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { buttonClass } from '@/components/ui/Button'
import { CMSLink } from '@/components/ui/CMSLink'
import { Icon, type IconName } from '@/components/ui/Icon'
import { MediaImage } from '@/components/ui/MediaImage'
import { PageHeader } from '@/components/ui/PageHeader'
import { RichText } from '@/components/ui/RichText'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getHowToOrderPage, getSiteSettings } from '@/lib/data'
import { telHref } from '@/lib/format'
import { type LocaleParams, resolveLocale } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import type { HowToOrderPage as HowToOrder } from '@/payload-types'

type ChannelType = NonNullable<HowToOrder['channels']>[number]['type']

const channelIcon: Record<ChannelType, IconName> = { line: 'line', phone: 'phone', store: 'mapPin', other: 'globe' }

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const page = await getHowToOrderPage(locale)
  return pageMetadata({ locale, path: '/how-to-order', title: page.heading, description: page.intro })
}

export default async function HowToOrderPage({ params }: LocaleParams) {
  const { locale } = await resolveLocale(params)
  const [page, settings, t] = await Promise.all([
    getHowToOrderPage(locale),
    getSiteSettings(locale),
    getTranslations('HowToOrder'),
  ])

  // Channels without their own link fall back to the shop's LINE / phone / contact page.
  const defaultHref: Record<ChannelType, string | null> = {
    line: settings.lineUrl ?? null,
    phone: telHref(settings.phone),
    store: '/contact',
    other: null,
  }
  const actionLabel: Record<ChannelType, string> = {
    line: t('actionLine'),
    phone: t('actionPhone'),
    store: t('actionStore'),
    other: t('actionOther'),
  }

  return (
    <>
      <PageHeader title={page.heading} intro={page.intro} crumbs={[{ label: page.heading }]} />

      {!!page.steps?.length && (
        <section aria-labelledby="steps-heading" className="section bg-cream">
          <div className="container-page">
            <SectionHeading id="steps-heading" heading={t('stepsHeading')} />
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {page.steps.map((step, i) => (
                <li key={step.id ?? i} className="relative rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
                  <span className="grid size-12 place-items-center rounded-full bg-brand-700 font-heading text-xl font-bold text-accent-400">
                    {i + 1}
                  </span>
                  {step.image && (
                    <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-lg bg-sand">
                      <MediaImage media={step.image} size="card" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                    </div>
                  )}
                  <h3 className="mt-4 font-heading text-xl font-semibold text-brand-800">{step.title}</h3>
                  {step.description && <p className="mt-2 whitespace-pre-line text-muted">{step.description}</p>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {!!page.channels?.length && (
        <section aria-labelledby="channels-heading" className="section bg-white">
          <div className="container-page">
            <SectionHeading id="channels-heading" heading={t('channelsHeading')} />
            <ul className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
              {page.channels.map((ch, i) => {
                const href = ch.href || defaultHref[ch.type]
                return (
                  <li key={ch.id ?? i} className="flex flex-col items-center rounded-[var(--radius-card)] border border-line p-6 text-center">
                    <span
                      className={`grid size-14 place-items-center rounded-full ${
                        ch.type === 'line' ? 'bg-[#06c755] text-white' : 'bg-brand-50 text-brand-700'
                      }`}
                    >
                      <Icon name={channelIcon[ch.type]} className="size-7" />
                    </span>
                    <h3 className="mt-4 font-heading text-xl font-semibold text-brand-800">{ch.title}</h3>
                    {ch.description && <p className="mt-2 whitespace-pre-line text-muted">{ch.description}</p>}
                    {href && (
                      <CMSLink href={href} className={buttonClass(ch.type === 'line' ? 'line' : 'primary', 'mt-auto')}>
                        {actionLabel[ch.type]}
                      </CMSLink>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {page.note && (
        <section className="pb-16">
          <div className="container-page max-w-3xl rounded-[var(--radius-card)] bg-accent-100 p-6 sm:p-8">
            <h2 className="mb-3 font-heading text-xl font-semibold text-brand-800">{t('noteHeading')}</h2>
            <RichText data={page.note} locale={locale} />
          </div>
        </section>
      )}
    </>
  )
}
