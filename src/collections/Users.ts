import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isAdminOrSelf } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'ผู้ใช้', plural: 'ผู้ใช้' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    group: 'ระบบ',
  },
  auth: true,
  access: {
    // Only admins can create or delete users; editors can manage content but not people.
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
  },
  hooks: {
    beforeChange: [
      // The very first account (created on /admin/create-first-user) must be an admin,
      // otherwise nobody could ever manage users.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.role = 'admin'
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'ชื่อ',
    },
    {
      name: 'role',
      type: 'select',
      label: 'สิทธิ์',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin (จัดการทุกอย่าง รวมถึงผู้ใช้)', value: 'admin' },
        { label: 'Editor (แก้สินค้าและข่าว)', value: 'editor' },
      ],
      access: {
        create: isAdminField,
        update: isAdminField,
      },
    },
  ],
}
