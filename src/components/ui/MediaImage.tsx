import Image from 'next/image'

import type { Media } from '@/payload-types'

type Size = 'thumbnail' | 'card' | 'wide'

/** Narrows a Payload upload field (id or populated doc) to the doc. */
export const asMedia = (value: number | Media | null | undefined): Media | null =>
  value && typeof value === 'object' ? value : null

type Props = {
  media: number | Media | null | undefined
  /** Pre-generated size to use; falls back to the original file. */
  size?: Size
  /** Fill the (relatively positioned) parent instead of using intrinsic dimensions. */
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
}

export function MediaImage({ media, size, fill, sizes, priority, className }: Props) {
  const doc = asMedia(media)
  if (!doc) return null

  const variant = size ? doc.sizes?.[size] : undefined
  const src = variant?.url || doc.url
  if (!src) return null
  const width = variant?.width || doc.width || 1200
  const height = variant?.height || doc.height || 1200
  const objectPosition =
    doc.focalX != null && doc.focalY != null ? `${doc.focalX}% ${doc.focalY}%` : undefined

  return (
    <Image
      src={src}
      alt={doc.alt || ''}
      {...(fill ? { fill: true } : { width, height })}
      sizes={sizes}
      priority={priority}
      // SVG placeholders (styleguide fixtures) are not run through the optimizer.
      unoptimized={src.endsWith('.svg')}
      className={className}
      style={objectPosition ? { objectPosition } : undefined}
    />
  )
}
