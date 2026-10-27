import type { HomePage } from '@/payload-types'

import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { MediaImage } from '../ui/MediaImage'

export function Hero({ hero }: { hero: HomePage['hero'] }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-900 text-white">
      <MediaImage
        media={hero.image}
        size="wide"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Left-to-right scrim keeps the text readable on any photo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/90 via-brand-900/65 to-brand-900/10"
      />
      <div className="container-page flex min-h-[72svh] flex-col justify-center py-20 sm:min-h-[78svh]">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold whitespace-pre-line sm:text-5xl lg:text-6xl">{hero.title}</h1>
          <span aria-hidden className="mt-5 block h-1 w-20 rounded-full bg-accent-500" />
          {hero.tagline && (
            <p className="mt-5 text-lg whitespace-pre-line text-white/90 sm:text-xl">{hero.tagline}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {hero.primaryCta?.label && (
              <Button href={hero.primaryCta.href} variant="accent">
                {hero.primaryCta.label}
                <Icon name="arrowRight" className="size-5" />
              </Button>
            )}
            {hero.secondaryCta?.label && (
              <Button href={hero.secondaryCta.href} variant="outlineLight">
                {hero.secondaryCta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
