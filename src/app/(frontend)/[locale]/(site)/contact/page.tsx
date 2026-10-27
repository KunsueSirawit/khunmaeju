import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { buttonClass } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { getBranches, getSiteSettings } from '@/lib/data'
import { telHref } from '@/lib/format'
import { type LocaleParams, resolveLocale } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'

import { ContactForm } from './ContactForm'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const t = await getTranslations({ locale, namespace: 'Contact' })
  return pageMetadata({ locale, path: '/contact', title: t('title'), description: t('intro') })
}

export default async function ContactPage({ params }: LocaleParams) {
  const { locale } = await resolveLocale(params)
  const [settings, branches, t] = await Promise.all([
    getSiteSettings(locale),
    getBranches(locale),
    getTranslations('Contact'),
  ])
  const tel = telHref(settings.phone)

  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} crumbs={[{ label: t('title') }]} />

      <section className="container-page grid gap-10 py-12 lg:grid-cols-5 lg:py-16">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-2xl font-bold text-brand-800">{t('channels')}</h2>
          {settings.lineUrl && (
            <a href={settings.lineUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('line', 'w-full')}>
              <Icon name="line" className="size-6" />
              {settings.lineId || 'LINE'}
            </a>
          )}
          {tel && (
            <a href={tel} className={buttonClass('outline', 'w-full')}>
              <Icon name="phone" className="size-5" />
              {settings.phoneDisplay || settings.phone}
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className={buttonClass('outline', 'w-full')}>
              <Icon name="mail" className="size-5" />
              {settings.email}
            </a>
          )}
          {settings.address && (
            <p className="flex gap-3 rounded-xl bg-white p-4 text-muted">
              <Icon name="mapPin" className="mt-1 size-5 shrink-0 text-accent-500" />
              <span className="whitespace-pre-line">{settings.address}</span>
            </p>
          )}
        </div>

        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8 lg:col-span-3">
          <h2 className="mb-6 text-2xl font-bold text-brand-800">{t('formHeading')}</h2>
          <ContactForm />
        </div>
      </section>

      {branches.length > 0 && (
        <section aria-labelledby="branches" className="section bg-white">
          <div className="container-page">
            <h2 id="branches" className="mb-8 text-3xl font-bold text-brand-800">
              {t('branches')}
            </h2>
            <ul className="space-y-8">
              {branches.map((b) => {
                const branchTel = telHref(b.phone)
                return (
                  <li key={b.id} className="grid overflow-hidden rounded-[var(--radius-card)] border border-line lg:grid-cols-2">
                    <div className="space-y-3 p-6 sm:p-8">
                      <h3 className="font-heading text-2xl font-semibold text-brand-800">{b.name}</h3>
                      <p className="flex gap-3 text-muted">
                        <Icon name="mapPin" className="mt-1 size-5 shrink-0 text-accent-500" />
                        <span className="whitespace-pre-line">{b.address}</span>
                      </p>
                      {b.openingHours && (
                        <p className="flex gap-3 text-muted">
                          <Icon name="clock" className="mt-1 size-5 shrink-0 text-accent-500" />
                          {b.openingHours}
                        </p>
                      )}
                      {b.phone && (
                        <p className="flex gap-3 text-muted">
                          <Icon name="phone" className="mt-1 size-5 shrink-0 text-accent-500" />
                          {branchTel ? <a href={branchTel} className="hover:text-brand-700">{b.phone}</a> : b.phone}
                        </p>
                      )}
                      {b.mapUrl && (
                        <a href={b.mapUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('primary', 'mt-2')}>
                          <Icon name="mapPin" className="size-5" />
                          {t('directions')}
                        </a>
                      )}
                    </div>
                    {b.mapEmbedUrl ? (
                      <iframe
                        src={b.mapEmbedUrl}
                        title={`${t('map')}: ${b.name}`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="min-h-72 w-full border-0"
                      />
                    ) : (
                      <div className="grid min-h-72 place-items-center bg-sand text-sm text-muted">{t('mapPlaceholder')}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
