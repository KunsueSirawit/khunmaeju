import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound, permanentRedirect } from 'next/navigation'

import { ProductCard } from '@/components/product/ProductCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { ProductGallery } from '@/components/product/ProductGallery'
import { buttonClass } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { asMedia } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link } from '@/i18n/navigation'
import { getProduct, getRelatedProducts, getSiteSettings } from '@/lib/data'
import { formatPrice, telHref } from '@/lib/format'
import { type LocaleParams, resolveLocale } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { productSchema } from '@/lib/structured-data'
import type { Media, ProductCategory } from '@/payload-types'

type Props = LocaleParams<{ slug: string }> & { searchParams: Promise<{ from?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await resolveLocale(params)
  const product = await getProduct(locale, slug)
  if (!product) return {}
  return pageMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.meta?.title || product.name,
    description: product.meta?.description || product.shortDescription,
    image: product.meta?.image || product.images?.[0],
  })
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { locale, slug } = await resolveLocale(params)
  const product = await getProduct(locale, slug)
  if (!product) {
    // Old-site link (see legacy-redirects.ts) to a product that has no matching slug here.
    if ((await searchParams).from === 'legacy') permanentRedirect(`/${locale}/products`)
    notFound()
  }

  const [settings, related, t, nav] = await Promise.all([
    getSiteSettings(locale),
    getRelatedProducts(locale, product),
    getTranslations('Product'),
    getTranslations('Nav'),
  ])

  const images = (product.images ?? []).map(asMedia).filter((m): m is Media => !!m)
  const categories = (product.categories ?? []).filter((c): c is ProductCategory => typeof c === 'object')
  const onSale = product.salePrice != null && product.price != null && product.salePrice < product.price
  const price = onSale ? product.salePrice : product.price
  const tel = telHref(settings.phone)

  const specs = [
    { label: t('weight'), value: product.weight },
    { label: t('shelfLife'), value: product.shelfLife },
    { label: t('sku'), value: product.sku },
  ].filter((s) => s.value)

  return (
    <>
      <JsonLd data={productSchema(product, settings, locale)} />
      <div className="container-page pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <li>
              <Link href="/" className="hover:text-brand-700">{nav('home')}</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/products" className="hover:text-brand-700">{nav('products')}</Link>
            </li>
            {categories[0] && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link href={`/products/category/${categories[0].slug}`} className="hover:text-brand-700">
                    {categories[0].name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">{product.name}</li>
          </ol>
        </nav>
      </div>

      <section className="container-page grid gap-8 py-8 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <ProductGallery images={images} labels={{ thumb: t('image') }} />

        <div>
          {categories.length > 0 && (
            <ul className="mb-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/products/category/${c.slug}`}
                    className="rounded-full bg-accent-100 px-3 py-1 text-sm font-medium text-accent-600 hover:bg-accent-400 hover:text-brand-900"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <h1 className="text-3xl font-bold text-brand-800 sm:text-4xl">{product.name}</h1>

          <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
            {price != null ? (
              <>
                <span className={`text-3xl font-bold ${onSale ? 'text-sale' : 'text-brand-700'}`}>
                  ฿{formatPrice(price, locale)}
                </span>
                {onSale && <span className="text-lg text-muted line-through">฿{formatPrice(product.price!, locale)}</span>}
              </>
            ) : (
              <span className="text-2xl font-semibold text-brand-700">{t('askPrice')}</span>
            )}
          </p>

          {product.shortDescription && <p className="mt-4 text-lg text-muted">{product.shortDescription}</p>}

          {specs.length > 0 && (
            <dl className="mt-6 divide-y divide-line rounded-xl border border-line bg-white">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-muted">{s.label}</dt>
                  <dd className="text-right font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {settings.lineUrl && (
              <a href={settings.lineUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('line')}>
                <Icon name="line" className="size-6" />
                {t('orderLine')}
              </a>
            )}
            {tel && (
              <a href={tel} className={buttonClass('outline')}>
                <Icon name="phone" className="size-5" />
                {t('orderPhone')}
              </a>
            )}
          </div>
          <p className="mt-3 text-sm text-muted">
            {t('orderHint')}{' '}
            <Link href="/how-to-order" className="font-medium text-brand-700 underline">
              {nav('howToOrder')}
            </Link>
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 pb-14 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-bold text-brand-800">{t('details')}</h2>
          <RichText data={product.description} locale={locale} />
        </div>
        <aside className="space-y-6">
          {product.storage && (
            <div className="rounded-xl bg-brand-50 p-5">
              <h2 className="mb-2 font-heading text-lg font-semibold text-brand-800">{t('storage')}</h2>
              <p className="whitespace-pre-line text-muted">{product.storage}</p>
            </div>
          )}
          {product.ingredients && (
            <div className="rounded-xl bg-sand p-5">
              <h2 className="mb-2 font-heading text-lg font-semibold text-brand-800">{t('ingredients')}</h2>
              <p className="whitespace-pre-line text-muted">{product.ingredients}</p>
            </div>
          )}
        </aside>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="section bg-white">
          <div className="container-page">
            <SectionHeading id="related-heading" heading={t('related')} />
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
