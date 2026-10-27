import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  labels: { singular: 'ใบรับรอง', plural: 'ใบรับรอง' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
    group: 'ร้าน',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', label: 'ชื่อใบรับรอง', required: true, localized: true },
    { name: 'description', type: 'textarea', label: 'คำอธิบาย', localized: true },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'โลโก้', required: true },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'ไฟล์ PDF (ให้ดาวน์โหลด)',
      filterOptions: { mimeType: { equals: 'application/pdf' } },
    },
    {
      name: 'order',
      type: 'number',
      label: 'ลำดับการแสดง',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
