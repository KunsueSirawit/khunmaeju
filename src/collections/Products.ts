import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrStaff } from '@/access'
import { slugField } from '@/fields/slug'
import { previewURL } from '@/lib/preview'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'สินค้า', plural: 'สินค้า' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'price', 'featured', '_status', 'updatedAt'],
    group: 'สินค้า',
    preview: (doc, { locale }) => previewURL('products', doc.slug as string, locale),
    livePreview: {
      url: ({ data, locale }) => previewURL('products', data.slug, locale.code),
    },
  },
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  // Drafts give the draft/published status from the brief (stored as `_status`).
  versions: {
    drafts: { autosave: { interval: 1000 } },
    maxPerDoc: 30,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'ข้อมูลสินค้า',
          fields: [
            { name: 'name', type: 'text', label: 'ชื่อสินค้า', required: true, localized: true },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'คำอธิบายสั้น (แสดงในการ์ด)',
              localized: true,
            },
            {
              name: 'description',
              type: 'richText',
              label: 'รายละเอียดสินค้า',
              localized: true,
            },
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'รูปสินค้า (รูปแรกคือรูปหลัก)',
            },
          ],
        },
        {
          label: 'ราคาและสเปก',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'price', type: 'number', label: 'ราคา (บาท)', min: 0 },
                {
                  name: 'salePrice',
                  type: 'number',
                  label: 'ราคาลด (บาท)',
                  min: 0,
                  admin: { description: 'เว้นว่างถ้าไม่มีโปรโมชั่น' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'weight',
                  type: 'text',
                  label: 'ขนาด/น้ำหนัก',
                  localized: true,
                  admin: { description: 'เช่น 200 กรัม' },
                },
                { name: 'shelfLife', type: 'text', label: 'อายุการเก็บ', localized: true },
              ],
            },
            {
              name: 'storage',
              type: 'textarea',
              label: 'วิธีเก็บรักษา',
              localized: true,
            },
            {
              name: 'ingredients',
              type: 'textarea',
              label: 'ส่วนประกอบ',
              localized: true,
            },
          ],
        },
        {
          label: 'สินค้าที่เกี่ยวข้อง',
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'สินค้าที่เกี่ยวข้อง',
              admin: { description: 'ถ้าเว้นว่าง หน้าเว็บจะแสดงสินค้าในหมวดเดียวกันแทน' },
              filterOptions: ({ id }) => ({ id: { not_equals: id } }),
            },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'sku',
      type: 'text',
      label: 'รหัสสินค้า (SKU)',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      label: 'หมวดสินค้า',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'สินค้าแนะนำ (แสดงหน้าแรก)',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'ลำดับการแสดง',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'เลขน้อยแสดงก่อน' },
    },
  ],
}
