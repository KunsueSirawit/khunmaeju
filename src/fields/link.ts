import type { GroupField } from 'payload'

/** A button/link: localized label + href (internal path like /products or a full URL). */
export const linkGroup = (name: string, label: string): GroupField => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', label: 'ข้อความปุ่ม', localized: true },
        {
          name: 'href',
          type: 'text',
          label: 'ลิงก์',
          admin: { description: 'เช่น /products หรือ https://lin.ee/...' },
        },
      ],
    },
  ],
})
