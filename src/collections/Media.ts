import path from 'path'
import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'ไฟล์/รูปภาพ', plural: 'ไฟล์/รูปภาพ' },
  admin: {
    group: 'เนื้อหา',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'คำอธิบายรูป (alt)',
      required: true,
      localized: true,
    },
  ],
  upload: {
    // Absolute so dev (project root) and the Docker image (/app) both use ./media.
    // Ignored when S3/R2 storage is enabled.
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'),
    // Images are re-encoded by sharp on upload, which also strips EXIF metadata.
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumbnail', width: 320, height: 320, position: 'centre' },
      { name: 'card', width: 640, height: 640, position: 'centre' },
      { name: 'wide', width: 1600 },
    ],
    adminThumbnail: 'thumbnail',
  },
}
