import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { slugField } from '@/fields/slug'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: { singular: 'หมวดสินค้า', plural: 'หมวดสินค้า' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    group: 'สินค้า',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', label: 'ชื่อหมวด', required: true, localized: true },
    slugField(),
    { name: 'description', type: 'textarea', label: 'คำอธิบาย', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'รูปหมวด' },
    {
      name: 'order',
      type: 'number',
      label: 'ลำดับการแสดง',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'เลขน้อยแสดงก่อน' },
    },
  ],
}
