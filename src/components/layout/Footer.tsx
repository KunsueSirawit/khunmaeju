import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { telHref } from '@/lib/format'
import { mainNav } from '@/lib/nav'
import type { Branch, ProductCategory, SiteSetting } from '@/payload-types'

import { Icon } from '../ui/Icon'
import { MaybeLink } from '../ui/MaybeLink'
import { MediaImage } from '../ui/MediaImage'
import { Logo } from './Logo'
import { SocialLinks } from './SocialLinks'

type Props = {
  settings: SiteSetting
  categories: Pick<ProductCategory, 'id' | 'name' | 'slug'>[]
  mainBranch?: Pick<Branch, 'name' | 'mapEmbedUrl' | 'mapUrl'> | null
}

const headingClass = 'mb-4 font-heading text-lg font-semibold text-accent-400'
const linkClass = 'inline-block py-1 text-white/80 transition-colors hover:text-white'

export async function Footer({ settings, categories, mainBranch }: Props) {
  const t = await getTranslations('Footer')
  const nav = await getTranslations('Nav')
  const tel = telHref(settings.phone)
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-900 text-white">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-12">
        <div className="col-span-2 lg:col-span-4">
          <Logo settings={settings} tone="light" />
          {settings.tagline && <p className="mt-4 max-w-sm text-white/75">{settings.tagline}</p>}
          <SocialLinks
            settings={settings}
            className="mt-5"
            itemClassName="bg-white/10 hover:bg-accent-500 hover:text-brand-900"
          />
        </div>

        <nav aria-labelledby="footer-menu" className="lg:col-span-2">
          <h2 id="footer-menu" className={headingClass}>
            {t('menu')}
          </h2>
          <ul>
            {mainNav.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={linkClass}>
                  {nav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-categories" className="lg:col-span-2">
          <h2 id="footer-categories" className={headingClass}>
            {t('categories')}
          </h2>
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/products/category/${cat.slug}`} className={linkClass}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 lg:col-span-4">
          <h2 className={headingClass}>{t('contact')}</h2>
          <ul className="space-y-3 text-white/80">
            {settings.address && (
              <li className="flex gap-3">
                <Icon name="mapPin" className="mt-1 size-5 shrink-0 text-accent-400" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
            {settings.phoneDisplay && (
              <li className="flex gap-3">
                <Icon name="phone" className="mt-1 size-5 shrink-0 text-accent-400" />
                <MaybeLink href={tel} className="hover:text-white">
                  {settings.phoneDisplay}
                </MaybeLink>
              </li>
            )}
            {settings.lineId && (
              <li className="flex gap-3">
                <Icon name="line" className="mt-1 size-5 shrink-0 text-accent-400" />
                <MaybeLink href={settings.lineUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {settings.lineId}
                </MaybeLink>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-3">
                <Icon name="mail" className="mt-1 size-5 shrink-0 text-accent-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
          {mainBranch?.mapEmbedUrl ? (
            <iframe
              src={mainBranch.mapEmbedUrl}
              title={`${t('map')}: ${mainBranch.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-5 aspect-[16/9] w-full rounded-xl border-0"
            />
          ) : (
            <div className="mt-5 grid aspect-[16/9] place-items-center rounded-xl border border-dashed border-white/25 text-sm text-white/50">
              {t('mapPlaceholder')}
            </div>
          )}
        </div>
      </div>

      {!!settings.mediaMentions?.length && (
        <div className="border-t border-white/10">
          <div className="container-page py-8">
            <h2 className="mb-4 text-sm font-semibold text-white/60">{t('mediaMentions')}</h2>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {settings.mediaMentions.map((m) => {
                const content = m.logo ? (
                  <MediaImage media={m.logo} size="thumbnail" className="h-10 w-auto opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" />
                ) : (
                  <span className="text-white/75">{m.name}</span>
                )
                return (
                  <li key={m.id}>
                    {m.url ? (
                      <a href={m.url} target="_blank" rel="noopener noreferrer" aria-label={m.name}>
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      <div className="border-t border-white/10">
        <p className="container-page py-5 text-center text-sm text-white/55">
          © {year} {settings.siteName}. {t('rights')}
        </p>
      </div>
    </footer>
  )
}
