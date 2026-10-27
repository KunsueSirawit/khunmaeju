import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { SiteShell } from '@/components/layout/SiteShell'
import { HomeView } from '@/components/sections/HomeView'
import { Button } from '@/components/ui/Button'
import type { Locale } from '@/i18n/locales'
import { fixtures } from '@/fixtures'

export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
}

const swatches = [
  ['brand-50', 'bg-brand-50'],
  ['brand-100', 'bg-brand-100'],
  ['brand-500', 'bg-brand-500'],
  ['brand-700', 'bg-brand-700'],
  ['brand-900', 'bg-brand-900'],
  ['accent-100', 'bg-accent-100'],
  ['accent-500', 'bg-accent-500'],
  ['accent-600', 'bg-accent-600'],
  ['cream', 'bg-cream'],
  ['sand', 'bg-sand'],
  ['ink', 'bg-ink'],
  ['muted', 'bg-muted'],
] as const

/**
 * Design-system preview: tokens + the full home page rendered from fixtures, no database needed.
 * Dev only (or ENABLE_STYLEGUIDE=true).
 */
export default async function StyleguidePage({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_STYLEGUIDE !== 'true') notFound()
  const locale = (await params).locale as Locale
  setRequestLocale(locale)
  const data = {
    settings: fixtures.siteSettings(locale),
    categories: fixtures.productCategories(locale),
    home: fixtures.homePage(locale),
    products: fixtures.products(locale).slice(0, 8),
    certificates: fixtures.certificates(locale),
    branches: fixtures.branches(locale).slice(0, 1),
    posts: fixtures.posts(locale).slice(0, 3),
  }

  return (
    <SiteShell settings={data.settings} categories={data.categories} mainBranch={data.branches[0]}>
      <section className="border-b border-line bg-white py-12">
        <div className="container-page space-y-10">
          <div>
            <p className="text-sm font-semibold text-accent-600">Design system · สีเป็น placeholder</p>
            <h1 className="mt-1 text-4xl font-bold text-brand-800">Styleguide</h1>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Colours</h2>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {swatches.map(([name, cls]) => (
                <li key={name}>
                  <div className={`h-16 rounded-lg border border-line ${cls}`} />
                  <p className="mt-1 text-sm text-muted">{name}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="mb-4 text-xl font-semibold">Typography</h2>
            <p className="font-heading text-5xl font-bold">Anuphan หัวข้อ 48px</p>
            <p className="font-heading text-3xl font-semibold">Anuphan หัวข้อรอง 30px</p>
            <p className="text-lg">IBM Plex Sans Thai เนื้อหา 18px ของฝากเมืองภูเก็ต สูตรดั้งเดิม</p>
            <p>IBM Plex Sans Thai เนื้อหา 16px ภาษาไทยมีสระบนและวรรณยุกต์ ต้องเว้นบรรทัดให้พอ</p>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Buttons</h2>
            <div className="flex flex-wrap gap-3 rounded-xl bg-brand-900 p-4">
              <Button href="#">Primary</Button>
              <Button href="#" variant="accent">Accent</Button>
              <Button href="#" variant="outlineLight">Outline light</Button>
              <Button href="#" variant="line">LINE</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button href="#" variant="outline">Outline</Button>
            </div>
          </div>
        </div>
      </section>

      <HomeView
        home={data.home}
        products={data.products}
        certificates={data.certificates}
        branches={data.branches}
        posts={data.posts}
      />
    </SiteShell>
  )
}
