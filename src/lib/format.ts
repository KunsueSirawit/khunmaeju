export const formatPrice = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    maximumFractionDigits: 2,
  }).format(value)

export const formatDate = (iso: string, locale: string): string =>
  new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(iso))

/** "+66 76 123 456" → "tel:+6676123456" */
export const telHref = (phone: string | null | undefined): string | null =>
  phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : null
