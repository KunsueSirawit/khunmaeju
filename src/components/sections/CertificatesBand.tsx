import { getTranslations } from 'next-intl/server'

import type { Certificate } from '@/payload-types'

import { Button } from '../ui/Button'
import { MediaImage } from '../ui/MediaImage'
import { SectionHeading } from '../ui/SectionHeading'

type Props = {
  heading?: string | null
  subheading?: string | null
  certificates: Pick<Certificate, 'id' | 'name' | 'logo'>[]
}

export async function CertificatesBand({ heading, subheading, certificates }: Props) {
  if (!certificates.length) return null
  const t = await getTranslations('Home')
  return (
    <section aria-labelledby="certificates-heading" className="section bg-brand-800">
      <div className="container-page">
        <SectionHeading
          id="certificates-heading"
          tone="light"
          eyebrow={t('certificatesEyebrow')}
          heading={heading}
          subheading={subheading}
        />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {certificates.map((cert) => (
            <li key={cert.id} className="flex flex-col items-center gap-3 text-center">
              <div className="relative grid aspect-square w-full max-w-36 place-items-center rounded-2xl bg-white p-4">
                <MediaImage media={cert.logo} size="thumbnail" className="h-full w-full object-contain" />
              </div>
              <p className="text-sm text-white/85">{cert.name}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Button href="/about#certificates" variant="outlineLight">
            {t('allCertificates')}
          </Button>
        </div>
      </div>
    </section>
  )
}
