import { getTranslations } from 'next-intl/server'

import { PostCard, type PostCardData } from '../news/PostCard'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { SectionHeading } from '../ui/SectionHeading'

type Props = {
  heading?: string | null
  subheading?: string | null
  posts: PostCardData[]
}

export async function LatestNews({ heading, subheading, posts }: Props) {
  if (!posts.length) return null
  const t = await getTranslations('Home')
  return (
    <section aria-labelledby="news-heading" className="section bg-white">
      <div className="container-page">
        <SectionHeading id="news-heading" eyebrow={t('newsEyebrow')} heading={heading} subheading={subheading} />
        <ul className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Button href="/news" variant="outline">
            {t('allNews')}
            <Icon name="arrowRight" className="size-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
