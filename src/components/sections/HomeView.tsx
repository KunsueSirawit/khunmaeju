import type { Branch, Certificate, HomePage } from '@/payload-types'

import type { PostCardData } from '../news/PostCard'
import type { ProductCardData } from '../product/ProductCard'
import { AboutIntro } from './AboutIntro'
import { BranchesSection } from './BranchesSection'
import { CertificatesBand } from './CertificatesBand'
import { FeaturedProducts } from './FeaturedProducts'
import { Hero } from './Hero'
import { LatestNews } from './LatestNews'
import { ServicesGrid } from './ServicesGrid'

export type HomeViewProps = {
  home: HomePage
  products: ProductCardData[]
  certificates: Pick<Certificate, 'id' | 'name' | 'logo'>[]
  branches: Pick<Branch, 'id' | 'name' | 'address' | 'openingHours' | 'phone' | 'mapUrl' | 'image'>[]
  posts: PostCardData[]
}

/** The home page, section by section, in the order of the brief. */
export function HomeView({ home, products, certificates, branches, posts }: HomeViewProps) {
  return (
    <>
      <Hero hero={home.hero} />
      {home.about && <AboutIntro about={home.about} />}
      <FeaturedProducts intro={home.featuredProducts ?? {}} products={products} />
      {home.services && <ServicesGrid services={home.services} />}
      <CertificatesBand
        heading={home.certificatesSection?.heading}
        subheading={home.certificatesSection?.subheading}
        certificates={certificates}
      />
      <BranchesSection
        heading={home.branchesSection?.heading}
        subheading={home.branchesSection?.subheading}
        branches={branches}
      />
      <LatestNews heading={home.newsSection?.heading} subheading={home.newsSection?.subheading} posts={posts} />
    </>
  )
}
