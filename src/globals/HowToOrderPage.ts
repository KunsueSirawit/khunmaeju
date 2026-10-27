import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'

export const HowToOrderPage: GlobalConfig = {
  slug: 'how-to-order-page',
  label: 'วิธีสั่งซื้อ',
  admin: { group: 'หน้าเว็บ' },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  versions: { drafts: true, max: 20 },
  fields: [
    { name: 'heading', type: 'text', label: 'หัวข้อหน้า', required: true, localized: true },
    { name: 'intro', type: 'textarea', label: 'คำโปรย', localized: true },
    {
      name: 'steps',
      type: 'array',
      label: 'ขั้นตอนการสั่งซื้อ',
      labels: { singular: 'ขั้นตอน', plural: 'ขั้นตอน' },
      fields: [
        { name: 'title', type: 'text', label: 'หัวข้อ', required: true, localized: true },
        { name: 'description', type: 'textarea', label: 'รายละเอียด', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'รูปประกอบ' },
      ],
    },
    {
      name: 'channels',
      type: 'array',
      label: 'ช่องทางสั่งซื้อ',
      labels: { singular: 'ช่องทาง', plural: 'ช่องทาง' },
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'ประเภท',
          required: true,
          options: [
            { label: 'LINE', value: 'line' },
            { label: 'โทรศัพท์', value: 'phone' },
            { label: 'หน้าร้าน', value: 'store' },
            { label: 'อื่น ๆ', value: 'other' },
          ],
        },
        { name: 'title', type: 'text', label: 'หัวข้อ', required: true, localized: true },
        { name: 'description', type: 'textarea', label: 'รายละเอียด', localized: true },
        {
          name: 'href',
          type: 'text',
          label: 'ลิงก์ปุ่ม',
          admin: {
            description: 'เว้นว่างได้ ระบบจะใช้ LINE/เบอร์โทรจาก "ตั้งค่าเว็บไซต์" ให้อัตโนมัติ',
          },
        },
      ],
    },
    { name: 'note', type: 'richText', label: 'หมายเหตุ (การชำระเงิน/จัดส่ง)', localized: true },
  ],
}
