'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { buttonClass } from '@/components/ui/Button'

import { type ContactField, type ContactState, submitContact } from './actions'

const inputClass =
  'mt-1 block w-full rounded-lg border border-line bg-white px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 aria-[invalid=true]:border-sale'

export function ContactForm() {
  const t = useTranslations('Contact')
  const locale = useLocale()
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: 'idle' })

  if (state.status === 'success') {
    return (
      <div role="status" className="rounded-[var(--radius-card)] bg-brand-50 p-8 text-center">
        <p className="font-heading text-2xl font-semibold text-brand-800">{t('successTitle')}</p>
        <p className="mt-2 text-muted">{t('successBody')}</p>
      </div>
    )
  }

  const invalid = (field: ContactField) => state.status === 'error' && !!state.fields?.includes(field)
  const fieldProps = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    'aria-invalid': invalid(field) || undefined,
    'aria-describedby': invalid(field) ? 'contact-error' : undefined,
    className: inputClass,
  })

  return (
    <form action={action} noValidate className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot for bots: hidden from people and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="contact-name" className="font-medium">
          {t('name')} <span className="text-sale">*</span>
        </label>
        <input {...fieldProps('name')} type="text" autoComplete="name" required maxLength={120} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="font-medium">{t('phone')}</label>
          <input {...fieldProps('phone')} type="tel" autoComplete="tel" inputMode="tel" maxLength={40} />
        </div>
        <div>
          <label htmlFor="contact-email" className="font-medium">{t('email')}</label>
          <input {...fieldProps('email')} type="email" autoComplete="email" maxLength={200} />
        </div>
      </div>
      <p className="-mt-3 text-sm text-muted">{t('replyHint')}</p>
      <div>
        <label htmlFor="contact-subject" className="font-medium">{t('subject')}</label>
        <input id="contact-subject" name="subject" type="text" maxLength={200} className={inputClass} />
      </div>
      <div>
        <label htmlFor="contact-message" className="font-medium">
          {t('message')} <span className="text-sale">*</span>
        </label>
        <textarea {...fieldProps('message')} rows={5} required maxLength={5000} />
      </div>

      {state.status === 'error' && (
        <p id="contact-error" role="alert" className="rounded-lg bg-sale/10 px-4 py-3 text-sale">
          {t(`error.${state.error}`)}
        </p>
      )}

      <button type="submit" disabled={pending} className={buttonClass('primary', 'w-full disabled:opacity-60 sm:w-auto')}>
        {pending ? t('sending') : t('send')}
      </button>
    </form>
  )
}
