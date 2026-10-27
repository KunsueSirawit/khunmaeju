/**
 * Static data for /[locale]/styleguide, which renders the real home page components
 * without a database. Mirrors what `npm run seed` creates.
 */
import type { HomeViewProps } from '@/components/sections/HomeView'
import type { Locale } from '@/i18n/locales'
import type { Media, SiteSetting } from '@/payload-types'

const stamp = '2026-01-01T00:00:00.000Z'

const media = (id: number, name: string, width: number, height: number, alt: string): Media => ({
  id,
  alt,
  url: `/styleguide/${name}.svg`,
  width,
  height,
  updatedAt: stamp,
  createdAt: stamp,
})

const copy = {
  th: {
    todo: '[รอข้อมูล]',
    siteName: 'คุณแม่จู้ของฝากเมืองภูเก็ต',
    heroTitle: 'คุณแม่จู้\nของฝากเมืองภูเก็ต',
    primaryCta: 'ดูสินค้า',
    secondaryCta: 'สั่งซื้อผ่าน LINE',
    aboutHeading: 'รู้จักคุณแม่จู้',
    aboutCta: 'อ่านเรื่องราวของเรา',
    featured: 'สินค้าแนะนำ',
    services: 'บริการของเรา',
    serviceTitles: ['ขายส่ง', 'ของฝาก/กระเช้า', 'รับผลิต OEM', '[รอข้อมูล] บริการที่ 4'],
    certificates: 'มาตรฐานและใบรับรอง',
    branches: 'หน้าร้านของเรา',
    news: 'ข่าวสารล่าสุด',
    newsCategory: 'ข่าวสาร',
    promoCategory: 'โปรโมชั่น',
    product: 'สินค้าตัวอย่าง',
    weight: '200 กรัม',
    certificate: 'ใบรับรอง',
    branch: 'สาขาหลัก',
    address: 'ที่อยู่สาขา จ.ภูเก็ต',
    hours: 'เวลาเปิด-ปิด',
    newsTitle: 'ข่าวตัวอย่าง',
    newsExcerpt: 'สรุปข่าวตัวอย่าง',
    stat: 'ตัวเลขที่',
    shopAddress: 'ที่อยู่ร้าน จ.ภูเก็ต',
    media: 'ชื่อสื่อ',
    categories: ['อาหารพื้นเมือง', 'ขนมพื้นเมือง', 'อาหารทะเลแปรรูป', 'ผลไม้อบแห้ง', 'ขนมขบเคี้ยว'],
  },
  en: {
    todo: '[PLACEHOLDER]',
    siteName: 'Khunmaeju Phuket',
    heroTitle: 'Khunmaeju Phuket',
    primaryCta: 'View products',
    secondaryCta: 'Order via LINE',
    aboutHeading: 'About Khunmaeju',
    aboutCta: 'Read our story',
    featured: 'Featured Products',
    services: 'Our Services',
    serviceTitles: ['Wholesale', 'Gift Sets', 'OEM Manufacturing', '[PLACEHOLDER] Service 4'],
    certificates: 'Standards & Certificates',
    branches: 'Our Shops',
    news: 'Latest News',
    newsCategory: 'News',
    promoCategory: 'Promotion',
    product: 'Sample product',
    weight: '200 g',
    certificate: 'Certificate',
    branch: 'Main branch',
    address: 'Branch address, Phuket',
    hours: 'Opening hours',
    newsTitle: 'Sample news',
    newsExcerpt: 'Summary of sample news',
    stat: 'Stat',
    shopAddress: 'Shop address, Phuket',
    media: 'Media name',
    categories: ['Local Food', 'Local Desserts', 'Processed Seafood', 'Dried Fruits', 'Snacks'],
  },
} as const

const slugs = ['local-food', 'local-desserts', 'processed-seafood', 'dried-fruits', 'snacks']

export function styleguideData(locale: Locale) {
  const c = copy[locale]
  const T = c.todo

  const settings = {
    id: 1,
    siteName: c.siteName,
    tagline: `${T} tagline`,
    phone: '+66000000000',
    phoneDisplay: `${T} 0xx-xxx-xxxx`,
    lineId: `${T} @line`,
    lineUrl: 'https://line.me/',
    facebookUrl: 'https://www.facebook.com/',
    instagramUrl: 'https://www.instagram.com/',
    address: `${T} ${c.shopAddress}`,
    mediaMentions: [1, 2, 3].map((n) => ({ id: String(n), name: `${T} ${c.media} ${n}` })),
  } as SiteSetting

  const categories = c.categories.map((name, i) => ({ id: i + 1, name, slug: slugs[i] }))

  const home = {
    id: 1,
    hero: {
      title: c.heroTitle,
      tagline: `${T} tagline`,
      image: media(1, 'hero', 1920, 1080, c.heroTitle),
      primaryCta: { label: c.primaryCta, href: '/products' },
      secondaryCta: { label: c.secondaryCta, href: '/how-to-order' },
    },
    about: {
      heading: c.aboutHeading,
      body: `${T} ${c.aboutHeading}`,
      image: media(2, 'about', 1200, 900, c.aboutHeading),
      cta: { label: c.aboutCta, href: '/about' },
      stats: [1, 2, 3, 4].map((n) => ({ id: String(n), value: '[?]', label: `${T} ${c.stat} ${n}` })),
    },
    featuredProducts: { heading: c.featured, subheading: `${T} subheading` },
    services: {
      heading: c.services,
      subheading: `${T} subheading`,
      items: c.serviceTitles.map((title, i) => ({
        id: String(i),
        title,
        description: `${T} ${title}`,
        image: media(10 + i, `service-${i + 1}`, 800, 600, title),
        href: ['/services#wholesale', '/services#gift', '/services#oem', '/services'][i],
      })),
    },
    certificatesSection: { heading: c.certificates },
    branchesSection: { heading: c.branches },
    newsSection: { heading: c.news },
  } as HomeViewProps['home']

  const products: HomeViewProps['products'] = Array.from({ length: 8 }, (_, i) => {
    const n = i + 1
    return {
      id: n,
      name: `${T} ${c.product} ${String(n).padStart(2, '0')}`,
      slug: `sample-product-${String(n).padStart(2, '0')}`,
      price: 100 + n * 10,
      salePrice: n % 4 === 0 ? 90 + n * 10 : null,
      weight: `${T} ${c.weight}`,
      images: [media(100 + n, `product-${n}`, 640, 640, `${c.product} ${n}`)],
    }
  })

  const certificates: HomeViewProps['certificates'] = [1, 2, 3, 4, 5, 6].map((n) => ({
    id: n,
    name: `${T} ${c.certificate} ${n}`,
    logo: media(200 + n, `cert-${n}`, 320, 320, `${c.certificate} ${n}`),
  }))

  const branches: HomeViewProps['branches'] = [
    {
      id: 1,
      name: `${T} ${c.branch}`,
      address: `${T} ${c.address}`,
      openingHours: `${T} ${c.hours}`,
      phone: `${T} 0xx-xxx-xxxx`,
      mapUrl: 'https://maps.google.com/',
      image: media(300, 'branch', 1600, 1000, c.branch),
    },
  ]

  const posts: HomeViewProps['posts'] = [1, 2, 3].map((n) => ({
    id: n,
    title: `${T} ${c.newsTitle} ${n}`,
    slug: `sample-news-${n}`,
    excerpt: `${T} ${c.newsExcerpt} ${n}`,
    cover: media(400 + n, `news-${n}`, 1600, 900, `${c.newsTitle} ${n}`),
    publishedAt: new Date(Date.UTC(2026, 9, 27 - n)).toISOString(),
    category: {
      id: n === 3 ? 2 : 1,
      name: n === 3 ? c.promoCategory : c.newsCategory,
      slug: n === 3 ? 'promotion' : 'news',
      updatedAt: stamp,
      createdAt: stamp,
    },
  }))

  return { settings, categories, home, products, certificates, branches, posts }
}
