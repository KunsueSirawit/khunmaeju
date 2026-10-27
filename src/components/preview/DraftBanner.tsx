import { getTranslations } from 'next-intl/server'
import NextLink from 'next/link'

import { isDraft } from '@/lib/data'
import { serverURL } from '@/lib/preview'

import { LivePreviewRefresh } from './LivePreviewRefresh'

/** Shown only in draft mode (editor previewing): a notice + live refresh on save. */
export async function DraftBanner() {
  if (!(await isDraft())) return null
  const t = await getTranslations('Preview')
  return (
    <>
      <LivePreviewRefresh serverURL={serverURL()} />
      <div className="sticky bottom-0 z-50 bg-accent-500 px-4 py-2 text-center text-sm font-semibold text-brand-900">
        {t('notice')}{' '}
        <NextLink href="/next/exit-preview" prefetch={false} className="underline">
          {t('exit')}
        </NextLink>
      </div>
    </>
  )
}
