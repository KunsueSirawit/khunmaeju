import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import type { Branch, ProductCategory, SiteSetting } from '@/payload-types'

import { FloatingLine } from './FloatingLine'
import { Footer } from './Footer'
import { Header } from './Header'

type Props = {
  settings: SiteSetting
  categories: Pick<ProductCategory, 'id' | 'name' | 'slug'>[]
  mainBranch?: Pick<Branch, 'name' | 'mapEmbedUrl' | 'mapUrl'> | null
  children: ReactNode
}

/** Header + footer around every public page. Data is passed in so the styleguide can use fixtures. */
export async function SiteShell({ settings, categories, mainBranch, children }: Props) {
  const t = await getTranslations('Common')
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        {t('skipToContent')}
      </a>
      <Header settings={settings} />
      <main id="main">{children}</main>
      <Footer settings={settings} categories={categories} mainBranch={mainBranch} />
      <FloatingLine href={settings.lineUrl} />
    </>
  )
}
