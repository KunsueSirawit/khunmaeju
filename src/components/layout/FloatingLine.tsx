import { getTranslations } from 'next-intl/server'

import { Icon } from '../ui/Icon'

/** Always-visible "order via LINE" button, bottom-right. Hidden until a LINE link is set. */
export async function FloatingLine({ href }: { href?: string | null }) {
  if (!href) return null
  const t = await getTranslations('Common')
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-full bg-[#06c755] py-2.5 pr-5 pl-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <Icon name="line" className="size-7" />
      {t('orderViaLine')}
    </a>
  )
}
