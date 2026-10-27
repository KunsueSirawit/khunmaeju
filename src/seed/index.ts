/**
 * Seeds sample data for development: `npm run seed`
 * Re-running is refused when products already exist; `npm run seed -- --reset` wipes
 * content collections (not users) first.
 *
 * Everything we do not know yet is marked with [รอข้อมูล] / [PLACEHOLDER]
 * (see docs/PLACEHOLDERS.md). Category names come from the project brief.
 */
import config from '@payload-config'
import { getPayload, type CollectionSlug, type Payload } from 'payload'

import { placeholderImage, placeholderPDF, richText, TODO, TODO_EN } from './helpers'

const CONTENT_COLLECTIONS: CollectionSlug[] = [
  'products',
  'product-categories',
  'posts',
  'post-categories',
  'branches',
  'certificates',
  'contact-submissions',
  'media',
]

const PRODUCT_CATEGORIES = [
  { slug: 'local-food', th: 'อาหารพื้นเมือง', en: 'Local Food', label: 'Local Food' },
  { slug: 'local-desserts', th: 'ขนมพื้นเมือง', en: 'Local Desserts', label: 'Local Desserts' },
  { slug: 'processed-seafood', th: 'อาหารทะเลแปรรูป', en: 'Processed Seafood', label: 'Seafood' },
  { slug: 'dried-fruits', th: 'ผลไม้อบแห้ง', en: 'Dried Fruits', label: 'Dried Fruits' },
  { slug: 'snacks', th: 'ขนมขบเคี้ยว', en: 'Snacks', label: 'Snacks' },
]

async function upsertUser(payload: Payload, email: string | undefined, password: string | undefined, role: 'admin' | 'editor') {
  if (!email || !password) {
    payload.logger.warn(`Skipping ${role} user: set SEED_${role.toUpperCase()}_EMAIL/PASSWORD in .env`)
    return
  }
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (existing.docs[0]) {
    payload.logger.info(`User ${email} already exists`)
    return
  }
  await payload.create({ collection: 'users', data: { email, password, role, name: role } })
  payload.logger.info(`Created ${role} user ${email} (password is in .env)`)
}

async function wipe(payload: Payload) {
  for (const collection of CONTENT_COLLECTIONS) {
    await payload.delete({ collection, where: { id: { exists: true } }, overrideAccess: true })
  }
}

async function seed() {
  const payload = await getPayload({ config })
  const reset = process.argv.includes('--reset')

  // Users first, so an empty database is always usable.
  await upsertUser(payload, process.env.SEED_ADMIN_EMAIL, process.env.SEED_ADMIN_PASSWORD, 'admin')
  await upsertUser(payload, process.env.SEED_EDITOR_EMAIL, process.env.SEED_EDITOR_PASSWORD, 'editor')

  const { totalDocs } = await payload.count({ collection: 'products' })
  if (totalDocs > 0 && !reset) {
    payload.logger.info('Content already seeded. Run `npm run seed -- --reset` to wipe and re-seed.')
    process.exit(0)
  }
  if (reset) await wipe(payload)

  // --- Product categories ----------------------------------------------------
  const categoryIds: number[] = []
  for (const [i, cat] of PRODUCT_CATEGORIES.entries()) {
    const image = await placeholderImage(payload, { label: cat.label, alt: cat.th })
    const doc = await payload.create({
      collection: 'product-categories',
      locale: 'th',
      data: { name: cat.th, slug: cat.slug, image, order: i, description: `${TODO} คำอธิบายหมวด${cat.th}` },
    })
    await payload.update({
      collection: 'product-categories',
      id: doc.id,
      locale: 'en',
      data: { name: cat.en, description: `${TODO_EN} ${cat.en} category description` },
    })
    categoryIds.push(doc.id)
  }

  // --- Products: 2 per category, first one of each is featured ---------------
  const productIds: number[] = []
  for (let n = 1; n <= 10; n++) {
    const num = String(n).padStart(2, '0')
    const categoryIndex = (n - 1) % PRODUCT_CATEGORIES.length
    const images = [
      await placeholderImage(payload, { label: `Product ${num}`, alt: `สินค้าตัวอย่าง ${num}` }),
      await placeholderImage(payload, { label: `Product ${num} - 2`, alt: `สินค้าตัวอย่าง ${num} รูปที่ 2` }),
    ]
    const doc = await payload.create({
      collection: 'products',
      locale: 'th',
      draft: false,
      data: {
        _status: 'published',
        name: `${TODO} สินค้าตัวอย่าง ${num}`,
        slug: `sample-product-${num}`,
        sku: `SAMPLE-${num}`,
        price: 100 + n * 10,
        salePrice: n % 4 === 0 ? 90 + n * 10 : undefined,
        weight: `${TODO} 200 กรัม`,
        shelfLife: `${TODO} 6 เดือน`,
        storage: `${TODO} วิธีเก็บรักษา`,
        ingredients: `${TODO} ส่วนประกอบ`,
        shortDescription: `${TODO} คำอธิบายสั้นของสินค้าตัวอย่าง ${num}`,
        description: richText(`${TODO} รายละเอียดสินค้าตัวอย่าง ${num}`),
        images,
        categories: [categoryIds[categoryIndex]],
        featured: n <= 8,
        order: n,
      },
    })
    await payload.update({
      collection: 'products',
      id: doc.id,
      locale: 'en',
      draft: false,
      data: {
        name: `${TODO_EN} Sample product ${num}`,
        weight: `${TODO_EN} 200 g`,
        shelfLife: `${TODO_EN} 6 months`,
        storage: `${TODO_EN} Storage instructions`,
        ingredients: `${TODO_EN} Ingredients`,
        shortDescription: `${TODO_EN} Short description of sample product ${num}`,
        description: richText(`${TODO_EN} Description of sample product ${num}`),
      },
    })
    productIds.push(doc.id)
  }

  // --- Post categories + posts -----------------------------------------------
  const news = await payload.create({ collection: 'post-categories', locale: 'th', data: { name: 'ข่าวสาร', slug: 'news' } })
  await payload.update({ collection: 'post-categories', id: news.id, locale: 'en', data: { name: 'News' } })
  const promo = await payload.create({ collection: 'post-categories', locale: 'th', data: { name: 'โปรโมชั่น', slug: 'promotion' } })
  await payload.update({ collection: 'post-categories', id: promo.id, locale: 'en', data: { name: 'Promotion' } })

  for (let n = 1; n <= 3; n++) {
    const cover = await placeholderImage(payload, { label: `News ${n}`, width: 1600, height: 900, alt: `ข่าวตัวอย่าง ${n}` })
    const post = await payload.create({
      collection: 'posts',
      locale: 'th',
      draft: false,
      data: {
        _status: 'published',
        title: `${TODO} ข่าวตัวอย่าง ${n}`,
        slug: `sample-news-${n}`,
        excerpt: `${TODO} สรุปข่าวตัวอย่าง ${n}`,
        content: richText(`${TODO} เนื้อหาข่าวตัวอย่าง ${n}`),
        cover,
        category: n === 3 ? promo.id : news.id,
        publishedAt: new Date(Date.now() - n * 86_400_000).toISOString(),
      },
    })
    await payload.update({
      collection: 'posts',
      id: post.id,
      locale: 'en',
      draft: false,
      data: {
        title: `${TODO_EN} Sample news ${n}`,
        excerpt: `${TODO_EN} Summary of sample news ${n}`,
        content: richText(`${TODO_EN} Body of sample news ${n}`),
      },
    })
  }

  // --- Branch ----------------------------------------------------------------
  const branchImage = await placeholderImage(payload, { label: 'Storefront', width: 1600, height: 1000, alt: 'หน้าร้าน' })
  const branch = await payload.create({
    collection: 'branches',
    locale: 'th',
    data: {
      name: `${TODO} สาขาหลัก`,
      address: `${TODO} ที่อยู่สาขา จ.ภูเก็ต`,
      openingHours: `${TODO} เวลาเปิด-ปิด`,
      phone: TODO,
      image: branchImage,
      order: 0,
    },
  })
  await payload.update({
    collection: 'branches',
    id: branch.id,
    locale: 'en',
    data: {
      name: `${TODO_EN} Main branch`,
      address: `${TODO_EN} Branch address, Phuket`,
      openingHours: `${TODO_EN} Opening hours`,
    },
  })

  // --- Certificates ----------------------------------------------------------
  for (let n = 1; n <= 3; n++) {
    const logo = await placeholderImage(payload, { label: `Certificate ${n}`, width: 400, height: 400, alt: `ใบรับรอง ${n}` })
    const file = await placeholderPDF(payload, `Certificate ${n}`)
    const cert = await payload.create({
      collection: 'certificates',
      locale: 'th',
      data: { name: `${TODO} ใบรับรอง ${n}`, logo, file, order: n },
    })
    await payload.update({ collection: 'certificates', id: cert.id, locale: 'en', data: { name: `${TODO_EN} Certificate ${n}` } })
  }

  // --- Globals ---------------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'th',
    data: {
      siteName: 'คุณแม่จู้ของฝากเมืองภูเก็ต',
      tagline: `${TODO} สโลแกน`,
      phone: '',
      phoneDisplay: TODO,
      lineId: TODO,
      lineUrl: '',
      facebookUrl: '',
      instagramUrl: '',
      address: `${TODO} ที่อยู่ร้าน จ.ภูเก็ต`,
      mediaMentions: [{ name: `${TODO} ชื่อสื่อ` }],
      defaultMetaDescription: `${TODO} คำอธิบายเว็บไซต์สำหรับ Google`,
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      siteName: 'Khunmaeju Phuket',
      tagline: `${TODO_EN} Tagline`,
      address: `${TODO_EN} Shop address, Phuket`,
      defaultMetaDescription: `${TODO_EN} Site description for search engines`,
    },
  })

  const heroImage = await placeholderImage(payload, { label: 'Hero', width: 1920, height: 1080, alt: 'คุณแม่จู้' })
  const aboutImage = await placeholderImage(payload, { label: 'About', width: 1200, height: 900, alt: 'คุณแม่จู้' })
  const serviceItems = [
    { th: 'ขายส่ง', en: 'Wholesale', href: '/services#wholesale' },
    { th: 'ของฝาก/กระเช้า', en: 'Gift Sets', href: '/services#gift' },
    { th: 'รับผลิต OEM', en: 'OEM Manufacturing', href: '/services#oem' },
    { th: `${TODO} บริการที่ 4`, en: `${TODO_EN} Service 4`, href: '/services' },
  ]
  const serviceImages = await Promise.all(
    serviceItems.map((_, i) => placeholderImage(payload, { label: `Service ${i + 1}`, width: 800, height: 600, alt: `บริการ ${i + 1}` })),
  )

  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'th',
    draft: false,
    data: {
      _status: 'published',
      hero: {
        title: 'คุณแม่จู้ของฝากเมืองภูเก็ต',
        tagline: `${TODO} tagline`,
        image: heroImage,
        primaryCta: { label: 'ดูสินค้า', href: '/products' },
        secondaryCta: { label: 'สั่งซื้อผ่าน LINE', href: '/how-to-order' },
      },
      about: {
        heading: 'รู้จักคุณแม่จู้',
        body: `${TODO} ข้อความแนะนำร้าน`,
        image: aboutImage,
        cta: { label: 'อ่านเรื่องราวของเรา', href: '/about' },
        stats: [1, 2, 3, 4].map((n) => ({ value: '[?]', label: `${TODO} ตัวเลขที่ ${n}` })),
      },
      featuredProducts: { heading: 'สินค้าแนะนำ', subheading: `${TODO} คำโปรย`, products: productIds.slice(0, 8) },
      services: {
        heading: 'บริการของเรา',
        subheading: `${TODO} คำโปรย`,
        items: serviceItems.map((s, i) => ({
          title: s.th,
          description: `${TODO} รายละเอียดบริการ`,
          image: serviceImages[i],
          href: s.href,
        })),
      },
      certificatesSection: { heading: 'มาตรฐานและใบรับรอง' },
      branchesSection: { heading: 'หน้าร้านของเรา' },
      newsSection: { heading: 'ข่าวสารล่าสุด' },
    },
  })
  // Array rows keep their ids across locales, so the EN pass re-reads them.
  const homeTh = await payload.findGlobal({ slug: 'home-page', locale: 'th', depth: 0 })
  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'en',
    draft: false,
    data: {
      _status: 'published',
      hero: {
        title: 'Khunmaeju Phuket',
        tagline: `${TODO_EN} tagline`,
        primaryCta: { label: 'View products', href: '/products' },
        secondaryCta: { label: 'Order via LINE', href: '/how-to-order' },
      },
      about: {
        heading: 'About Khunmaeju',
        body: `${TODO_EN} Shop introduction`,
        cta: { label: 'Read our story', href: '/about' },
        stats: homeTh.about?.stats?.map((s, i) => ({ ...s, label: `${TODO_EN} Stat ${i + 1}` })),
      },
      featuredProducts: { heading: 'Featured Products', subheading: `${TODO_EN} subheading` },
      services: {
        heading: 'Our Services',
        subheading: `${TODO_EN} subheading`,
        items: homeTh.services?.items?.map((item, i) => ({
          ...item,
          title: serviceItems[i].en,
          description: `${TODO_EN} Service description`,
        })),
      },
      certificatesSection: { heading: 'Standards & Certificates' },
      branchesSection: { heading: 'Our Shops' },
      newsSection: { heading: 'Latest News' },
    },
  })

  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'th',
    draft: false,
    data: {
      _status: 'published',
      heading: 'เกี่ยวกับเรา',
      intro: `${TODO} คำโปรย`,
      heroImage: aboutImage,
      story: richText(`${TODO} เรื่องราวของคุณแม่จู้`),
      timelineHeading: 'เส้นทางของเรา',
      timeline: [1, 2, 3, 4].map((n) => ({ year: '[?]', title: `${TODO} ช่วงที่ ${n}`, description: `${TODO} รายละเอียด` })),
      founder: { quote: `${TODO} คำพูดผู้ก่อตั้ง`, name: 'คุณหงวดจู้ สันติกุล', role: 'ผู้ก่อตั้ง' },
      certificatesHeading: 'มาตรฐานและใบรับรอง',
    },
  })
  const aboutTh = await payload.findGlobal({ slug: 'about-page', locale: 'th', depth: 0 })
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    draft: false,
    data: {
      _status: 'published',
      heading: 'About Us',
      intro: `${TODO_EN} intro`,
      story: richText(`${TODO_EN} Our story`),
      timelineHeading: 'Our Journey',
      timeline: aboutTh.timeline?.map((row, i) => ({ ...row, title: `${TODO_EN} Period ${i + 1}`, description: `${TODO_EN} Details` })),
      founder: { quote: `${TODO_EN} Founder quote`, name: `${TODO_EN} Khun Nguadju Santikul`, role: 'Founder' },
      certificatesHeading: 'Standards & Certificates',
    },
  })

  const services = [
    { anchor: 'wholesale', th: 'ขายส่ง', en: 'Wholesale' },
    { anchor: 'gift', th: 'ของฝาก/กระเช้า', en: 'Gift Sets' },
    { anchor: 'oem', th: 'รับผลิต OEM', en: 'OEM Manufacturing' },
  ]
  await payload.updateGlobal({
    slug: 'services-page',
    locale: 'th',
    draft: false,
    data: {
      _status: 'published',
      heading: 'บริการ',
      intro: `${TODO} คำโปรย`,
      sections: services.map((s, i) => ({
        anchor: s.anchor,
        title: s.th,
        body: richText(`${TODO} รายละเอียดบริการ${s.th}`),
        image: serviceImages[i],
        cta: { label: 'สอบถามทาง LINE', href: '/contact' },
      })),
    },
  })
  const servicesTh = await payload.findGlobal({ slug: 'services-page', locale: 'th', depth: 0 })
  await payload.updateGlobal({
    slug: 'services-page',
    locale: 'en',
    draft: false,
    data: {
      _status: 'published',
      heading: 'Services',
      intro: `${TODO_EN} intro`,
      sections: servicesTh.sections?.map((row, i) => ({
        ...row,
        title: services[i].en,
        body: richText(`${TODO_EN} ${services[i].en} details`),
        cta: { ...row.cta, label: 'Ask us on LINE' },
      })),
    },
  })

  // Generic catalogue-ordering flow; payment and delivery details are unknown.
  const steps = [
    { th: 'เลือกสินค้า', en: 'Choose products' },
    { th: 'ทักแชท LINE หรือโทรสั่ง', en: 'Message us on LINE or call' },
    { th: 'ยืนยันรายการและชำระเงิน', en: 'Confirm and pay' },
    { th: 'รับสินค้า', en: 'Receive your order' },
  ]
  const channels = [
    { type: 'line' as const, th: 'LINE', en: 'LINE' },
    { type: 'phone' as const, th: 'โทรศัพท์', en: 'Phone' },
    { type: 'store' as const, th: 'หน้าร้าน', en: 'In store' },
  ]
  await payload.updateGlobal({
    slug: 'how-to-order-page',
    locale: 'th',
    draft: false,
    data: {
      _status: 'published',
      heading: 'วิธีสั่งซื้อ',
      intro: `${TODO} คำโปรย`,
      steps: steps.map((s) => ({ title: s.th, description: `${TODO} รายละเอียดขั้นตอน` })),
      channels: channels.map((c) => ({ type: c.type, title: c.th, description: `${TODO} รายละเอียด` })),
      note: richText(`${TODO} วิธีชำระเงิน ค่าจัดส่ง และระยะเวลาจัดส่ง`),
    },
  })
  const orderTh = await payload.findGlobal({ slug: 'how-to-order-page', locale: 'th', depth: 0 })
  await payload.updateGlobal({
    slug: 'how-to-order-page',
    locale: 'en',
    draft: false,
    data: {
      _status: 'published',
      heading: 'How to Order',
      intro: `${TODO_EN} intro`,
      steps: orderTh.steps?.map((row, i) => ({ ...row, title: steps[i].en, description: `${TODO_EN} Step details` })),
      channels: orderTh.channels?.map((row, i) => ({ ...row, title: channels[i].en, description: `${TODO_EN} Details` })),
      note: richText(`${TODO_EN} Payment methods, shipping fees and delivery times`),
    },
  })

  payload.logger.info('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
