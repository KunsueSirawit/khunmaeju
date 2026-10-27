import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrStaff } from '@/access'
import { slugField } from '@/fields/slug'
import { previewURL } from '@/lib/preview'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'ข่าว/บทความ', plural: 'ข่าว/บทความ' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'ข่าวสาร',
    preview: (doc, { locale }) => previewURL('posts', doc.slug as string, locale),
    livePreview: {
      url: ({ data, locale }) => previewURL('posts', data.slug, locale.code),
    },
  },
  defaultSort: '-publishedAt',
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  // draft / published, plus "schedule publish" from the document's Publish menu.
  versions: {
    drafts: { autosave: { interval: 1000 }, schedulePublish: true },
    maxPerDoc: 30,
  },
  fields: [
    { name: 'title', type: 'text', label: 'หัวข้อ', required: true, localized: true },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'สรุปสั้น (แสดงในหน้ารวม)',
      localized: true,
    },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'รูปปก' },
    { name: 'content', type: 'richText', label: 'เนื้อหา', localized: true },
    slugField(),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'post-categories',
      label: 'หมวด',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'วันที่เผยแพร่',
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) =>
            !value && siblingData._status === 'published' ? new Date().toISOString() : value,
        ],
      },
    },
  ],
}
