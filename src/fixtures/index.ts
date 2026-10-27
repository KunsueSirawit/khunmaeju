/**
 * Fake CMS data for USE_FIXTURES=true (dev only, see src/lib/data.ts) and the styleguide.
 * Shapes match the generated Payload types; text mirrors what `npm run seed` creates,
 * plus enough products/posts to exercise pagination.
 */
import type { Locale } from '@/i18n/locales'
import { richText } from '@/lib/lexical'
import type {
  AboutPage,
  Branch,
  Certificate,
  HomePage,
  HowToOrderPage,
  Media,
  Post,
  PostCategory,
  Product,
  ProductCategory,
  ServicesPage,
  SiteSetting,
} from '@/payload-types'

const stamp = '2026-01-01T00:00:00.000Z'
const meta = { updatedAt: stamp, createdAt: stamp }

const media = (id: number, name: string, width: number, height: number, alt: string): Media => ({
  id: String(id),
  alt,
  url: `/styleguide/${name}.svg`,
  width,
  height,
  ...meta,
})

const pdf = (id: number, alt: string): Media => ({ id: String(id), alt, url: '/styleguide/cert-1.svg', mimeType: 'application/pdf', ...meta })

const copy = {
  th: {
    T: '[รอข้อมูล]',
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
    postCategories: ['ข่าวสาร', 'โปรโมชั่น'],
    product: 'สินค้าตัวอย่าง',
    weight: '200 กรัม',
    shelfLife: '6 เดือน',
    storage: 'วิธีเก็บรักษา',
    ingredients: 'ส่วนประกอบ',
    description: 'รายละเอียดสินค้า',
    shortDescription: 'คำอธิบายสั้นของสินค้า',
    certificate: 'ใบรับรอง',
    branch: 'สาขา',
    address: 'ที่อยู่สาขา จ.ภูเก็ต',
    hours: 'เวลาเปิด-ปิด',
    newsTitle: 'ข่าวตัวอย่าง',
    newsExcerpt: 'สรุปข่าวตัวอย่าง',
    newsBody: 'เนื้อหาข่าวตัวอย่าง',
    stat: 'ตัวเลขที่',
    shopAddress: 'ที่อยู่ร้าน จ.ภูเก็ต',
    media: 'ชื่อสื่อ',
    categories: ['อาหารพื้นเมือง', 'ขนมพื้นเมือง', 'อาหารทะเลแปรรูป', 'ผลไม้อบแห้ง', 'ขนมขบเคี้ยว'],
    about: {
      heading: 'เกี่ยวกับเรา',
      story: 'เรื่องราวของคุณแม่จู้',
      timelineHeading: 'เส้นทางของเรา',
      period: 'ช่วงที่',
      details: 'รายละเอียด',
      quote: 'คำพูดผู้ก่อตั้ง',
      founderName: 'คุณหงวดจู้ สันติกุล',
      founderRole: 'ผู้ก่อตั้ง',
    },
    servicesPage: { heading: 'บริการ', cta: 'สอบถามทาง LINE', titles: ['ขายส่ง', 'ของฝาก/กระเช้า', 'รับผลิต OEM'] },
    order: {
      heading: 'วิธีสั่งซื้อ',
      steps: ['เลือกสินค้า', 'ทักแชท LINE หรือโทรสั่ง', 'ยืนยันรายการและชำระเงิน', 'รับสินค้า'],
      stepDetail: 'รายละเอียดขั้นตอน',
      channels: ['LINE', 'โทรศัพท์', 'หน้าร้าน'],
      note: 'วิธีชำระเงิน ค่าจัดส่ง และระยะเวลาจัดส่ง',
    },
  },
  en: {
    T: '[PLACEHOLDER]',
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
    postCategories: ['News', 'Promotion'],
    product: 'Sample product',
    weight: '200 g',
    shelfLife: '6 months',
    storage: 'Storage instructions',
    ingredients: 'Ingredients',
    description: 'Product description',
    shortDescription: 'Short product description',
    certificate: 'Certificate',
    branch: 'Branch',
    address: 'Branch address, Phuket',
    hours: 'Opening hours',
    newsTitle: 'Sample news',
    newsExcerpt: 'Summary of sample news',
    newsBody: 'Body of sample news',
    stat: 'Stat',
    shopAddress: 'Shop address, Phuket',
    media: 'Media name',
    categories: ['Local Food', 'Local Desserts', 'Processed Seafood', 'Dried Fruits', 'Snacks'],
    about: {
      heading: 'About Us',
      story: 'Our story',
      timelineHeading: 'Our Journey',
      period: 'Period',
      details: 'Details',
      quote: 'Founder quote',
      founderName: '[PLACEHOLDER] Khun Nguadju Santikul',
      founderRole: 'Founder',
    },
    servicesPage: { heading: 'Services', cta: 'Ask us on LINE', titles: ['Wholesale', 'Gift Sets', 'OEM Manufacturing'] },
    order: {
      heading: 'How to Order',
      steps: ['Choose products', 'Message us on LINE or call', 'Confirm and pay', 'Receive your order'],
      stepDetail: 'Step details',
      channels: ['LINE', 'Phone', 'In store'],
      note: 'Payment methods, shipping fees and delivery times',
    },
  },
} as const

const categorySlugs = ['local-food', 'local-desserts', 'processed-seafood', 'dried-fruits', 'snacks']
const pad = (n: number) => String(n).padStart(2, '0')

const productCategories = (locale: Locale): ProductCategory[] =>
  copy[locale].categories.map((name, i) => ({
    id: String(i + 1),
    name,
    slug: categorySlugs[i],
    description: `${copy[locale].T} ${name}`,
    image: media(50 + i, `product-${i + 1}`, 640, 640, name),
    order: i,
    ...meta,
  }))

const products = (locale: Locale): Product[] => {
  const c = copy[locale]
  const cats = productCategories(locale)
  return Array.from({ length: 30 }, (_, i) => {
    const n = i + 1
    const img = ((n - 1) % 10) + 1
    return {
      id: String(n),
      name: `${c.T} ${c.product} ${pad(n)}`,
      slug: `sample-product-${pad(n)}`,
      sku: `SAMPLE-${pad(n)}`,
      price: 100 + n * 10,
      salePrice: n % 4 === 0 ? 90 + n * 10 : null,
      weight: `${c.T} ${c.weight}`,
      shelfLife: `${c.T} ${c.shelfLife}`,
      storage: `${c.T} ${c.storage}`,
      ingredients: `${c.T} ${c.ingredients}`,
      shortDescription: `${c.T} ${c.shortDescription} ${pad(n)}`,
      description: richText(`${c.T} ${c.description} ${pad(n)}`, `${c.T} ${c.description}`),
      images: [
        media(100 + n, `product-${img}`, 640, 640, `${c.product} ${n}`),
        media(200 + n, `product-${(img % 10) + 1}`, 640, 640, `${c.product} ${n} (2)`),
        media(300 + n, `product-${((img + 1) % 10) + 1}`, 640, 640, `${c.product} ${n} (3)`),
      ],
      categories: [cats[(n - 1) % cats.length]],
      featured: n <= 8,
      order: n,
      _status: 'published',
      ...meta,
    }
  })
}

const postCategories = (locale: Locale): PostCategory[] =>
  copy[locale].postCategories.map((name, i) => ({ id: String(i + 1), name, slug: i === 0 ? 'news' : 'promotion', ...meta }))

const posts = (locale: Locale): Post[] => {
  const c = copy[locale]
  const cats = postCategories(locale)
  return Array.from({ length: 14 }, (_, i) => {
    const n = i + 1
    return {
      id: String(n),
      title: `${c.T} ${c.newsTitle} ${n}`,
      slug: `sample-news-${n}`,
      excerpt: `${c.T} ${c.newsExcerpt} ${n}`,
      content: richText(`${c.T} ${c.newsBody} ${n}`, `${c.T} ${c.newsBody}`),
      cover: media(400 + n, `news-${((n - 1) % 3) + 1}`, 1600, 900, `${c.newsTitle} ${n}`),
      category: n % 3 === 0 ? cats[1] : cats[0],
      publishedAt: new Date(Date.UTC(2026, 9, 27 - n)).toISOString(),
      _status: 'published',
      ...meta,
    }
  })
}

const certificates = (locale: Locale): Certificate[] => {
  const c = copy[locale]
  return [1, 2, 3, 4, 5, 6].map((n) => ({
    id: String(n),
    name: `${c.T} ${c.certificate} ${n}`,
    description: `${c.T} ${c.certificate}`,
    logo: media(500 + n, `cert-${n}`, 320, 320, `${c.certificate} ${n}`),
    file: pdf(600 + n, `${c.certificate} ${n}`),
    order: n,
    ...meta,
  }))
}

const branches = (locale: Locale): Branch[] => {
  const c = copy[locale]
  return [1, 2].map((n) => ({
    id: String(n),
    name: `${c.T} ${c.branch} ${n}`,
    address: `${c.T} ${c.address}`,
    openingHours: `${c.T} ${c.hours}`,
    phone: `${c.T} 0xx-xxx-xxxx`,
    mapUrl: 'https://maps.google.com/',
    image: media(700 + n, 'branch', 1600, 1000, `${c.branch} ${n}`),
    order: n,
    ...meta,
  }))
}

const siteSettings = (locale: Locale): SiteSetting => {
  const c = copy[locale]
  return {
    id: '1',
    siteName: c.siteName,
    tagline: `${c.T} tagline`,
    phone: '+66000000000',
    phoneDisplay: `${c.T} 0xx-xxx-xxxx`,
    lineId: `${c.T} @line`,
    lineUrl: 'https://line.me/',
    facebookUrl: 'https://www.facebook.com/',
    instagramUrl: 'https://www.instagram.com/',
    email: 'shop@example.com',
    address: `${c.T} ${c.shopAddress}`,
    mediaMentions: [1, 2, 3].map((n) => ({ id: String(n), name: `${c.T} ${c.media} ${n}` })),
    defaultMetaDescription: `${c.T} meta description`,
  }
}

const homePage = (locale: Locale): HomePage => {
  const c = copy[locale]
  return {
    id: '1',
    hero: {
      title: c.heroTitle,
      tagline: `${c.T} tagline`,
      image: media(1, 'hero', 1920, 1080, c.siteName),
      primaryCta: { label: c.primaryCta, href: '/products' },
      secondaryCta: { label: c.secondaryCta, href: '/how-to-order' },
    },
    about: {
      heading: c.aboutHeading,
      body: `${c.T} ${c.aboutHeading}`,
      image: media(2, 'about', 1200, 900, c.aboutHeading),
      cta: { label: c.aboutCta, href: '/about' },
      stats: [1, 2, 3, 4].map((n) => ({ id: String(n), value: '[?]', label: `${c.T} ${c.stat} ${n}` })),
    },
    featuredProducts: { heading: c.featured, subheading: `${c.T} subheading` },
    services: {
      heading: c.services,
      subheading: `${c.T} subheading`,
      items: c.serviceTitles.map((title, i) => ({
        id: String(i),
        title,
        description: `${c.T} ${title}`,
        image: media(10 + i, `service-${i + 1}`, 800, 600, title),
        href: ['/services#wholesale', '/services#gift', '/services#oem', '/services'][i],
      })),
    },
    certificatesSection: { heading: c.certificates },
    branchesSection: { heading: c.branches },
    newsSection: { heading: c.news },
    _status: 'published',
  }
}

const aboutPage = (locale: Locale): AboutPage => {
  const c = copy[locale]
  const a = c.about
  return {
    id: '1',
    heading: a.heading,
    intro: `${c.T} intro`,
    heroImage: media(2, 'about', 1200, 900, a.heading),
    story: richText(`${c.T} ${a.story}`, `${c.T} ${a.story}`),
    timelineHeading: a.timelineHeading,
    timeline: [1, 2, 3, 4].map((n) => ({
      id: String(n),
      year: '[?]',
      title: `${c.T} ${a.period} ${n}`,
      description: `${c.T} ${a.details}`,
      image: n % 2 ? media(800 + n, `news-${n > 2 ? 2 : 1}`, 1600, 900, `${a.period} ${n}`) : null,
    })),
    founder: { quote: `${c.T} ${a.quote}`, name: a.founderName, role: a.founderRole, image: null },
    certificatesHeading: c.certificates,
    _status: 'published',
  }
}

const servicesPage = (locale: Locale): ServicesPage => {
  const c = copy[locale]
  const s = c.servicesPage
  return {
    id: '1',
    heading: s.heading,
    intro: `${c.T} intro`,
    sections: ['wholesale', 'gift', 'oem'].map((anchor, i) => ({
      id: anchor,
      anchor,
      title: s.titles[i],
      body: richText(`${c.T} ${s.titles[i]}`, `${c.T} ${s.titles[i]}`),
      image: media(20 + i, `service-${i + 1}`, 800, 600, s.titles[i]),
      cta: { label: s.cta, href: '/contact' },
    })),
    _status: 'published',
  }
}

const howToOrderPage = (locale: Locale): HowToOrderPage => {
  const c = copy[locale]
  const o = c.order
  const types = ['line', 'phone', 'store'] as const
  return {
    id: '1',
    heading: o.heading,
    intro: `${c.T} intro`,
    steps: o.steps.map((title, i) => ({ id: String(i), title, description: `${c.T} ${o.stepDetail}` })),
    channels: o.channels.map((title, i) => ({ id: String(i), type: types[i], title, description: `${c.T} ${o.stepDetail}` })),
    note: richText(`${c.T} ${o.note}`),
    _status: 'published',
  }
}

export const fixtures = {
  siteSettings,
  homePage,
  aboutPage,
  servicesPage,
  howToOrderPage,
  productCategories,
  products,
  postCategories,
  posts,
  certificates,
  branches,
}
