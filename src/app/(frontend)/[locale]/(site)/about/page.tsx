import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Icon } from '@/components/ui/Icon'
import { asMedia, MediaImage } from '@/components/ui/MediaImage'
import { PageHeader } from '@/components/ui/PageHeader'
import { RichText } from '@/components/ui/RichText'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getAboutPage, getCertificates } from '@/lib/data'
import { type LocaleParams, resolveLocale } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const about = await getAboutPage(locale)
  return pageMetadata({ locale, path: '/about', title: about.heading, description: about.intro, image: about.heroImage })
}

export default async function AboutPage({ params }: LocaleParams) {
  const { locale } = await resolveLocale(params)
  const [about, certificates, t] = await Promise.all([
    getAboutPage(locale),
    getCertificates(locale),
    getTranslations('About'),
  ])
  const founder = about.founder

  return (
    <>
      <PageHeader title={about.heading} intro={about.intro} crumbs={[{ label: about.heading }]} image={about.heroImage} />

      {about.story && (
        <section className="section bg-cream">
          <div className="container-page max-w-3xl">
            <RichText data={about.story} locale={locale} className="prose-lg" />
          </div>
        </section>
      )}

      {!!about.timeline?.length && (
        <section aria-labelledby="timeline-heading" className="section bg-white">
          <div className="container-page max-w-4xl">
            <SectionHeading id="timeline-heading" eyebrow={t('timelineEyebrow')} heading={about.timelineHeading} />
            <ol className="relative space-y-10 border-l-2 border-accent-400 pl-8 sm:pl-10">
              {about.timeline.map((item) => (
                <li key={item.id} className="relative">
                  <span
                    aria-hidden
                    className="absolute top-1 -left-[2.6rem] grid size-5 place-items-center rounded-full border-4 border-white bg-accent-500 sm:-left-[3.1rem]"
                  />
                  <p className="font-heading text-2xl font-bold text-accent-600">{item.year}</p>
                  <h3 className="mt-1 font-heading text-xl font-semibold text-brand-800">{item.title}</h3>
                  {item.description && <p className="mt-2 whitespace-pre-line text-muted">{item.description}</p>}
                  {asMedia(item.image) && (
                    <div className="relative mt-4 aspect-[16/9] max-w-xl overflow-hidden rounded-xl bg-sand">
                      <MediaImage media={item.image} size="card" fill sizes="(min-width: 640px) 36rem, 100vw" className="object-cover" />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {founder?.quote && (
        <section aria-label={t('founderLabel')} className="section bg-brand-800 text-white">
          <figure className="container-page grid max-w-5xl items-center gap-8 md:grid-cols-[14rem_1fr]">
            <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-full border-4 border-accent-500 bg-brand-700 md:w-56">
              {asMedia(founder.image) ? (
                <MediaImage media={founder.image} size="card" fill sizes="14rem" className="object-cover" />
              ) : (
                <span className="grid h-full place-items-center px-4 text-center text-sm text-white/60">{t('photoPlaceholder')}</span>
              )}
            </div>
            <div>
              <span aria-hidden className="font-heading text-7xl leading-none text-accent-500">“</span>
              <blockquote className="-mt-6 font-heading text-2xl leading-relaxed sm:text-3xl">
                <p className="whitespace-pre-line">{founder.quote}</p>
              </blockquote>
              <figcaption className="mt-6">
                <span className="block text-lg font-semibold text-accent-400">{founder.name}</span>
                {founder.role && <span className="text-white/70">{founder.role}</span>}
              </figcaption>
            </div>
          </figure>
        </section>
      )}

      {certificates.length > 0 && (
        <section aria-labelledby="certificates" className="section bg-cream">
          <div className="container-page">
            <SectionHeading id="certificates" eyebrow={t('certificatesEyebrow')} heading={about.certificatesHeading} />
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert) => {
                const file = asMedia(cert.file)
                return (
                  <li key={cert.id} className="flex gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                      <MediaImage media={cert.logo} size="thumbnail" fill sizes="80px" className="object-contain p-1" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <h3 className="font-heading text-lg font-semibold text-brand-800">{cert.name}</h3>
                      {cert.description && <p className="mt-1 text-sm text-muted">{cert.description}</p>}
                      {file?.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-brand-700 hover:underline"
                        >
                          <Icon name="download" className="size-4" />
                          {t('downloadPdf')}
                        </a>
                      )}
                    </div>
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
