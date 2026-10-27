import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/Button'

export default async function NotFound() {
  const t = await getTranslations('NotFound')
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="font-heading text-7xl font-bold text-accent-500">404</p>
        <h1 className="mt-4 text-3xl font-bold text-brand-800">{t('title')}</h1>
        <p className="mt-3 text-muted">{t('body')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">{t('home')}</Button>
          <Button href="/products" variant="outline">
            {t('products')}
          </Button>
        </div>
      </div>
    </section>
  )
}
