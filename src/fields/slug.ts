import type { TextField } from 'payload'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * URL slug shared by every locale (so /th/... and /en/... point at the same document).
 * Thai titles cannot be transliterated reliably, so editors type it in English;
 * anything typed is normalised to lowercase-kebab-case.
 */
export const slugField = (
  overrides: Partial<Pick<TextField, 'name' | 'label' | 'admin'>> = {},
): TextField => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'ใช้ในลิงก์ ภาษาอังกฤษ a-z, 0-9 และ - เท่านั้น เช่น crispy-shrimp-paste',
  },
  hooks: {
    beforeValidate: [({ value }) => (typeof value === 'string' ? slugify(value) : value)],
  },
  validate: (value: unknown) =>
    typeof value === 'string' && SLUG_PATTERN.test(value)
      ? true
      : 'slug ต้องเป็น a-z, 0-9 และ - เท่านั้น',
  ...overrides,
})
