import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'

import { Icon } from './Icon'

type Props = {
  page: number
  totalPages: number
  /** Path without query, e.g. /products or /products/category/snacks */
  basePath: string
  /** Extra query params to keep (e.g. the news category filter). */
  query?: Record<string, string | undefined>
}

/** Page numbers with ellipses: 1 … 4 5 6 … 12 */
const pageList = (page: number, total: number): (number | '…')[] => {
  const pages = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total))
  const sorted = [...pages].sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? (['…', p] as const) : [p]))
}

export async function Pagination({ page, totalPages, basePath, query = {} }: Props) {
  if (totalPages <= 1) return null
  const t = await getTranslations('Pagination')

  const href = (p: number) => {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([k, v]) => v && params.set(k, v))
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const linkClass = 'grid size-11 place-items-center rounded-full font-semibold transition-colors'

  return (
    <nav aria-label={t('label')} className="mt-12 flex justify-center">
      <ul className="flex flex-wrap items-center gap-1.5">
        <li>
          {page > 1 ? (
            <Link href={href(page - 1)} rel="prev" aria-label={t('previous')} className={`${linkClass} hover:bg-brand-50`}>
              <Icon name="arrowRight" className="size-5 rotate-180" />
            </Link>
          ) : (
            <span aria-hidden className={`${linkClass} text-line`}>
              <Icon name="arrowRight" className="size-5 rotate-180" />
            </span>
          )}
        </li>
        {pageList(page, totalPages).map((p, i) =>
          p === '…' ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={href(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={t('page', { page: p })}
                className={`${linkClass} ${p === page ? 'bg-brand-700 text-white' : 'hover:bg-brand-50'}`}
              >
                {p}
              </Link>
            </li>
          ),
        )}
        <li>
          {page < totalPages ? (
            <Link href={href(page + 1)} rel="next" aria-label={t('next')} className={`${linkClass} hover:bg-brand-50`}>
              <Icon name="arrowRight" className="size-5" />
            </Link>
          ) : (
            <span aria-hidden className={`${linkClass} text-line`}>
              <Icon name="arrowRight" className="size-5" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
