import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'ตั้งค่าเว็บไซต์',
  admin: { group: 'ตั้งค่า' },
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'แบรนด์',
          fields: [
            { name: 'siteName', type: 'text', label: 'ชื่อเว็บไซต์', required: true, localized: true },
            { name: 'tagline', type: 'text', label: 'สโลแกนสั้น', localized: true },
            { name: 'logo', type: 'upload', relationTo: 'media', label: 'โลโก้' },
            {
              name: 'logoLight',
              type: 'upload',
              relationTo: 'media',
              label: 'โลโก้สีขาว (บนพื้นเข้ม)',
            },
          ],
        },
        {
          label: 'ช่องทางติดต่อ',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  label: 'เบอร์โทร (สำหรับกดโทร)',
                  admin: { description: 'เช่น +6676xxxxxx' },
                },
                {
                  name: 'phoneDisplay',
                  type: 'text',
                  label: 'เบอร์โทร (แสดงผล)',
                  admin: { description: 'เช่น 076-xxx-xxx' },
                },
              ],
            },
            { name: 'email', type: 'email', label: 'อีเมลร้าน' },
            {
              type: 'row',
              fields: [
                { name: 'lineId', type: 'text', label: 'LINE ID', admin: { description: 'เช่น @khunmaeju' } },
                { name: 'lineUrl', type: 'text', label: 'ลิงก์ LINE (lin.ee/...)' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'facebookUrl', type: 'text', label: 'Facebook URL' },
                { name: 'instagramUrl', type: 'text', label: 'Instagram URL' },
              ],
            },
            { name: 'address', type: 'textarea', label: 'ที่อยู่หลัก (footer)', localized: true },
          ],
        },
        {
          label: 'สื่อที่พูดถึงเรา',
          fields: [
            {
              name: 'mediaMentions',
              type: 'array',
              label: 'สื่อที่พูดถึงเรา (footer)',
              labels: { singular: 'สื่อ', plural: 'สื่อ' },
              fields: [
                { name: 'name', type: 'text', label: 'ชื่อสื่อ/รายการ', required: true, localized: true },
                { name: 'url', type: 'text', label: 'ลิงก์' },
                { name: 'logo', type: 'upload', relationTo: 'media', label: 'โลโก้' },
              ],
            },
          ],
        },
        {
          label: 'SEO และแจ้งเตือน',
          fields: [
            {
              name: 'defaultMetaDescription',
              type: 'textarea',
              label: 'คำอธิบายเว็บ (ค่าเริ่มต้นสำหรับ SEO)',
              localized: true,
            },
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'รูปตอนแชร์ลิงก์ (Open Graph)',
            },
            {
              name: 'notificationEmail',
              type: 'email',
              label: 'อีเมลรับแจ้งเตือนฟอร์มติดต่อ',
              admin: {
                description: 'ถ้าตั้ง CONTACT_NOTIFY_EMAIL ใน .env ไว้ จะใช้ค่านั้นแทน',
              },
            },
          ],
        },
      ],
    },
  ],
}
