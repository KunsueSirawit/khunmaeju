import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'เกี่ยวกับเรา',
  admin: { group: 'หน้าเว็บ' },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'เรื่องราว',
          fields: [
            { name: 'heading', type: 'text', label: 'หัวข้อหน้า', required: true, localized: true },
            { name: 'intro', type: 'textarea', label: 'คำโปรย', localized: true },
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'รูปหัวหน้า' },
            { name: 'story', type: 'richText', label: 'เรื่องราวของเรา', localized: true },
          ],
        },
        {
          label: 'Timeline',
          fields: [
            { name: 'timelineHeading', type: 'text', label: 'หัวข้อ Timeline', localized: true },
            {
              name: 'timeline',
              type: 'array',
              label: 'ช่วงเวลา',
              labels: { singular: 'ช่วงเวลา', plural: 'ช่วงเวลา' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'year', type: 'text', label: 'ปี', required: true, admin: { description: 'เช่น 2490' } },
                    { name: 'title', type: 'text', label: 'หัวข้อ', required: true, localized: true },
                  ],
                },
                { name: 'description', type: 'textarea', label: 'รายละเอียด', localized: true },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'รูป' },
              ],
            },
          ],
        },
        {
          label: 'คำพูดผู้ก่อตั้ง',
          name: 'founder',
          fields: [
            { name: 'quote', type: 'textarea', label: 'คำพูด', localized: true },
            { name: 'name', type: 'text', label: 'ชื่อ', localized: true },
            { name: 'role', type: 'text', label: 'ตำแหน่ง', localized: true },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'รูป' },
          ],
        },
        {
          label: 'ใบรับรอง',
          fields: [
            {
              name: 'certificatesHeading',
              type: 'text',
              label: 'หัวข้อส่วนใบรับรอง',
              localized: true,
              admin: { description: 'รายการใบรับรองจัดการที่เมนู "ใบรับรอง"' },
            },
          ],
        },
      ],
    },
  ],
}
