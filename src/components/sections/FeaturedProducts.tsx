import { getTranslations } from 'next-intl/server'

import type { HomePage } from '@/payload-types'

import { ProductCard, type ProductCardData } from '../product/ProductCard'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { SectionHeading } from '../ui/SectionHeading'

type Props = {
  intro: Pick<NonNullable<HomePage['featuredProducts']>, 'heading' | 'subheading'>
  products: ProductCardData[]
}

export async function FeaturedProducts({ intro, products }: Props) {
  if (!products.length) return null
  const t = await getTranslations('Home')
  return (
    <section aria-labelledby="featured-heading" className="section bg-white">
      <div className="container-page">
        <SectionHeading id="featured-heading" eyebrow={t('productsEyebrow')} heading={intro.heading} subheading={intro.subheading} />
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Button href="/products" variant="outline">
            {t('allProducts')}
            <Icon name="arrowRight" className="size-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
