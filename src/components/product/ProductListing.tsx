import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import type { Paginated } from '@/lib/data'
import type { Product, ProductCategory } from '@/payload-types'

import { Pagination } from '../ui/Pagination'
import { ProductCard } from './ProductCard'

type Props = {
  result: Paginated<Product>
  categories: ProductCategory[]
  activeSlug?: string
  basePath: string
}

/** Category menu (sidebar on desktop, scrolling chips on mobile) + product grid + pagination. */
export async function ProductListing({ result, categories, activeSlug, basePath }: Props) {
  const t = await getTranslations('Products')
  const items: { slug?: string; name: string; href: string }[] = [
    { name: t('all'), href: '/products' },
    ...categories.map((c) => ({ slug: c.slug, name: c.name, href: `/products/category/${c.slug}` })),
  ]

  return (
    <div className="container-page grid grid-cols-1 gap-8 py-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-14">
      <nav aria-label={t('categories')} className="min-w-0">
        <h2 className="mb-3 hidden font-heading text-lg font-semibold text-brand-800 lg:block">{t('categories')}</h2>
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
          {items.map((item) => {
            const active = item.slug === activeSlug
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`block rounded-full border px-4 py-2 whitespace-nowrap transition-colors lg:rounded-lg lg:border-0 ${
                    active
                      ? 'border-brand-700 bg-brand-700 font-semibold text-white'
                      : 'border-line bg-white text-ink hover:border-brand-500 hover:text-brand-700 lg:bg-transparent lg:hover:bg-brand-50'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div>
        <p className="mb-5 text-sm text-muted">{t('count', { count: result.totalDocs })}</p>
        {result.docs.length ? (
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {result.docs.map((product, i) => (
              <li key={product.id}>
                {/* The first mobile row is above the fold and usually the LCP. */}
                <ProductCard product={product} priority={i < 2} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">{t('empty')}</p>
        )}
        <Pagination page={result.page} totalPages={result.totalPages} basePath={basePath} />
      </div>
    </div>
  )
}
