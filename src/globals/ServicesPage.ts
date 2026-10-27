import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { slugify } from '@/fields/slug'
import { linkGroup } from '@/fields/link'

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'บริการ',
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
      name: 'sections',
      type: 'array',
      label: 'บริการ',
      labels: { singular: 'บริการ', plural: 'บริการ' },
      fields: [
        {
          name: 'anchor',
          type: 'text',
          label: 'Anchor',
          required: true,
          admin: { description: 'ใช้ในลิงก์ /services#anchor เช่น wholesale, gift, oem' },
          hooks: {
            beforeValidate: [({ value }) => (typeof value === 'string' ? slugify(value) : value)],
          },
        },
        { name: 'title', type: 'text', label: 'หัวข้อ', required: true, localized: true },
        { name: 'body', type: 'richText', label: 'รายละเอียด', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'รูป' },
        linkGroup('cta', 'ปุ่ม'),
      ],
    },
  ],
}
