'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { Media } from '@/payload-types'

type Img = Pick<Media, 'id' | 'url' | 'alt' | 'width' | 'height' | 'focalX' | 'focalY'> & {
  sizes?: Media['sizes']
}

/** Main image + thumbnail strip. Thumbnails are buttons, so it works with keyboard too. */
export function ProductGallery({ images, labels }: { images: Img[]; labels: { thumb: string } }) {
  const [active, setActive] = useState(0)
  const current = images[active]
  if (!current) return <div className="aspect-square rounded-[var(--radius-card)] bg-sand" />

  const src = (img: Img, size?: 'card' | 'thumbnail') => (size && img.sizes?.[size]?.url) || img.url || ''
  const position = (img: Img) =>
    img.focalX != null && img.focalY != null ? { objectPosition: `${img.focalX}% ${img.focalY}%` } : undefined

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-sand shadow-[var(--shadow-card)]">
        <Image
          key={current.id}
          src={src(current)}
          alt={current.alt || ''}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          unoptimized={src(current).endsWith('.svg')}
          className="object-cover"
          style={position(current)}
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${labels.thumb} ${i + 1}`}
                aria-pressed={i === active}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg border-2 transition ${
                  i === active ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={src(img, 'thumbnail')}
                  alt=""
                  fill
                  sizes="96px"
                  unoptimized={src(img, 'thumbnail').endsWith('.svg')}
                  className="object-cover"
                  style={position(img)}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
