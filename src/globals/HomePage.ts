import type { Field, GlobalConfig, GroupField } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { linkGroup } from '@/fields/link'

const headingFields = (): Field[] => [
  { name: 'heading', type: 'text', label: 'หัวข้อ', localized: true },
  { name: 'subheading', type: 'textarea', label: 'คำโปรย', localized: true },
]

const sectionHeading = (name: string, label: string): GroupField => ({
  name,
  type: 'group',
  label,
  fields: headingFields(),
})

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'หน้าแรก',
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
          label: 'Hero',
          name: 'hero',
          fields: [
            {
              name: 'title',
              type: 'textarea',
              label: 'ชื่อแบรนด์/หัวข้อใหญ่',
              required: true,
              localized: true,
              admin: { description: 'กด Enter เพื่อขึ้นบรรทัดใหม่ตรงที่ต้องการ' },
            },
            { name: 'tagline', type: 'textarea', label: 'Tagline', localized: true },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'รูปพื้นหลัง' },
            linkGroup('primaryCta', 'ปุ่มหลัก'),
            linkGroup('secondaryCta', 'ปุ่มรอง'),
          ],
        },
        {
          label: 'รู้จักคุณแม่จู้',
          name: 'about',
          fields: [
            { name: 'heading', type: 'text', label: 'หัวข้อ', localized: true },
            { name: 'body', type: 'textarea', label: 'ข้อความ', localized: true },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'รูป' },
            linkGroup('cta', 'ปุ่ม "อ่านเพิ่มเติม"'),
            {
              name: 'stats',
              type: 'array',
              label: 'กล่องตัวเลข',
              labels: { singular: 'กล่อง', plural: 'กล่อง' },
              maxRows: 4,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', label: 'ตัวเลข', required: true, admin: { description: 'เช่น 80+' } },
                    { name: 'label', type: 'text', label: 'คำอธิบาย', required: true, localized: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'สินค้าแนะนำ',
          name: 'featuredProducts',
          fields: [
            ...headingFields(),
            {
              name: 'products',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              maxRows: 10,
              label: 'เลือกสินค้าเอง (ไม่บังคับ)',
              admin: {
                description: 'ถ้าเว้นว่าง จะแสดงสินค้าที่ติ๊ก "สินค้าแนะนำ" ล่าสุดสูงสุด 10 ชิ้น',
              },
            },
          ],
        },
        {
          label: 'บริการ/พันธมิตร',
          name: 'services',
          fields: [
            ...headingFields(),
            {
              name: 'items',
              type: 'array',
              label: 'การ์ดบริการ',
              labels: { singular: 'การ์ด', plural: 'การ์ด' },
              maxRows: 4,
              fields: [
                { name: 'title', type: 'text', label: 'หัวข้อ', required: true, localized: true },
                { name: 'description', type: 'textarea', label: 'คำอธิบาย', localized: true },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'รูป' },
                {
                  name: 'href',
                  type: 'text',
                  label: 'ลิงก์',
                  admin: { description: 'เช่น /services#wholesale' },
                },
              ],
            },
          ],
        },
        {
          label: 'ส่วนอื่น ๆ',
          fields: [
            sectionHeading('certificatesSection', 'มาตรฐาน/ใบรับรอง'),
            sectionHeading('branchesSection', 'หน้าร้าน/สาขา'),
            sectionHeading('newsSection', 'ข่าวล่าสุด'),
          ],
        },
      ],
    },
  ],
}
