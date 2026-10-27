import { getLocale, getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/payload-types'

import { MediaImage } from '../ui/MediaImage'

export type ProductCardData = Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'salePrice' | 'images' | 'weight'>

export async function ProductCard({ product }: { product: ProductCardData }) {
  const t = await getTranslations('Product')
  const locale = await getLocale()
  const onSale = product.salePrice != null && product.price != null && product.salePrice < product.price
  const shownPrice = onSale ? product.salePrice : product.price

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-sand">
        <MediaImage
          media={product.images?.[0]}
          size="card"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {onSale && (
          <span className="absolute top-3 left-3 rounded-full bg-sale px-2.5 py-0.5 text-xs font-semibold text-white">
            {t('sale')}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="line-clamp-2 font-heading text-base font-semibold text-ink sm:text-lg">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        {product.weight && <p className="mt-0.5 text-sm text-muted">{product.weight}</p>}
        <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
          {shownPrice != null ? (
            <>
              <span className={`text-lg font-bold ${onSale ? 'text-sale' : 'text-brand-700'}`}>
                ฿{formatPrice(shownPrice, locale)}
              </span>
              {onSale && (
                <span className="text-sm text-muted line-through">฿{formatPrice(product.price!, locale)}</span>
              )}
            </>
          ) : (
            <span className="font-semibold text-brand-700">{t('askPrice')}</span>
          )}
        </p>
      </div>
    </article>
  )
}
