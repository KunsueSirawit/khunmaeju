import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { th } from '@payloadcms/translations/languages/th'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Branches } from './collections/Branches'
import { Certificates } from './collections/Certificates'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Media } from './collections/Media'
import { PostCategories } from './collections/PostCategories'
import { Posts } from './collections/Posts'
import { ProductCategories } from './collections/ProductCategories'
import { Products } from './collections/Products'
import { Users } from './collections/Users'
import { AboutPage } from './globals/AboutPage'
import { HomePage } from './globals/HomePage'
import { HowToOrderPage } from './globals/HowToOrderPage'
import { ServicesPage } from './globals/ServicesPage'
import { SiteSettings } from './globals/SiteSettings'
import { locales, defaultLocale } from './i18n/locales'
import { serverURL } from './lib/preview'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useS3 = Boolean(process.env.S3_BUCKET)
const useSMTP = Boolean(process.env.SMTP_HOST)

export default buildConfig({
  serverURL: serverURL(),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · คุณแม่จู้ หลังบ้าน',
    },
    livePreview: {
      breakpoints: [
        { label: 'มือถือ', name: 'mobile', width: 390, height: 844 },
        { label: 'แท็บเล็ต', name: 'tablet', width: 820, height: 1180 },
        { label: 'เดสก์ท็อป', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  // Admin UI language (independent of content locales below).
  i18n: {
    supportedLanguages: { th, en },
    fallbackLanguage: 'th',
  },
  localization: {
    locales: locales.map((code) => ({ code, label: code === 'th' ? 'ไทย' : 'English' })),
    defaultLocale,
    fallback: true,
  },
  collections: [
    Products,
    ProductCategories,
    Posts,
    PostCategories,
    Branches,
    Certificates,
    ContactSubmissions,
    Media,
    Users,
  ],
  globals: [SiteSettings, HomePage, AboutPage, ServicesPage, HowToOrderPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // MongoDB Atlas (or any replica set: Payload needs one for transactions).
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  email: useSMTP
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || 'no-reply@khunmaejuphuket.com',
        defaultFromName: process.env.SMTP_FROM_NAME || 'คุณแม่จู้ภูเก็ต',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  // Scheduled publishing of posts runs through the jobs queue.
  jobs: {
    autoRun: [{ cron: '* * * * *', queue: 'default' }],
    shouldAutoRun: () => process.env.PAYLOAD_DISABLE_JOBS !== 'true',
  },
  sharp,
  plugins: [
    seoPlugin({
      collections: ['products', 'posts'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => `${doc?.name || doc?.title || ''} | คุณแม่จู้ภูเก็ต`,
      generateDescription: ({ doc }) => doc?.shortDescription || doc?.excerpt || '',
    }),
    // Local disk in dev; S3-compatible storage (Cloudflare R2, AWS S3, ...) when S3_BUCKET is set.
    s3Storage({
      enabled: useS3,
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT || undefined,
        region: process.env.S3_REGION || 'auto',
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
