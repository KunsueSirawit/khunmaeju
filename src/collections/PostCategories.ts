import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { slugField } from '@/fields/slug'

export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  labels: { singular: 'หมวดข่าว', plural: 'หมวดข่าว' },
  admin: {
    useAsTitle: 'name',
    group: 'ข่าวสาร',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', label: 'ชื่อหมวด', required: true, localized: true },
    slugField(),
  ],
}
