import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'

export const Branches: CollectionConfig = {
  slug: 'branches',
  labels: { singular: 'สาขา', plural: 'สาขา' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'order'],
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
    { name: 'name', type: 'text', label: 'ชื่อสาขา', required: true, localized: true },
    { name: 'address', type: 'textarea', label: 'ที่อยู่', required: true, localized: true },
    {
      name: 'openingHours',
      type: 'text',
      label: 'เวลาเปิด',
      localized: true,
      admin: { description: 'เช่น ทุกวัน 08:00–20:00' },
    },
    { name: 'phone', type: 'text', label: 'เบอร์โทร' },
    {
      name: 'mapUrl',
      type: 'text',
      label: 'ลิงก์ Google Maps',
      admin: { description: 'ลิงก์สำหรับปุ่ม "นำทาง"' },
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      label: 'ลิงก์ฝังแผนที่ (embed)',
      admin: {
        description: 'Google Maps > แชร์ > ฝังแผนที่ แล้วคัดลอกเฉพาะค่า src="..."',
      },
      validate: (value: unknown) =>
        !value ||
        (typeof value === 'string' && value.startsWith('https://www.google.com/maps/embed')) ||
        'ต้องเป็นลิงก์ที่ขึ้นต้นด้วย https://www.google.com/maps/embed',
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'รูปหน้าร้าน' },
    {
      name: 'order',
      type: 'number',
      label: 'ลำดับการแสดง',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
