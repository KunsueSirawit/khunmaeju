import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, nobody } from '@/access'

const escapeHTML = (value: unknown): string =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )

/**
 * Messages from the contact form. The public REST/GraphQL API cannot create them;
 * the site's contact form server action writes them with the Local API after
 * validating input, so spam can be rate-limited in one place.
 */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'ข้อความติดต่อ', plural: 'ข้อความติดต่อ' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email', 'subject', 'createdAt'],
    group: 'ร้าน',
    description: 'ข้อความจากฟอร์มติดต่อเรา (อ่านอย่างเดียว)',
  },
  defaultSort: '-createdAt',
  access: {
    create: nobody,
    read: isAdminOrEditor,
    update: nobody,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        const settings = await req.payload.findGlobal({ slug: 'site-settings', req })
        const to = process.env.CONTACT_NOTIFY_EMAIL || settings.notificationEmail
        if (!to) {
          req.payload.logger.warn('Contact form: no notification email configured')
          return doc
        }
        try {
          await req.payload.sendEmail({
            to,
            replyTo: doc.email || undefined,
            subject: `[เว็บไซต์] ข้อความใหม่จาก ${doc.name}`,
            html: `
              <p><b>ชื่อ:</b> ${escapeHTML(doc.name)}</p>
              <p><b>โทร:</b> ${escapeHTML(doc.phone)}</p>
              <p><b>อีเมล:</b> ${escapeHTML(doc.email)}</p>
              <p><b>เรื่อง:</b> ${escapeHTML(doc.subject)}</p>
              <p><b>ข้อความ:</b><br>${escapeHTML(doc.message).replace(/\n/g, '<br>')}</p>
            `,
          })
        } catch (err) {
          // A mail outage must not lose the message: it is already saved in the admin.
          req.payload.logger.error({ err }, 'Contact form: notification email failed')
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'ชื่อ', required: true, maxLength: 120 },
    { name: 'phone', type: 'text', label: 'เบอร์โทร', maxLength: 40 },
    { name: 'email', type: 'email', label: 'อีเมล' },
    { name: 'subject', type: 'text', label: 'เรื่อง', maxLength: 200 },
    { name: 'message', type: 'textarea', label: 'ข้อความ', required: true, maxLength: 5000 },
    {
      name: 'locale',
      type: 'text',
      label: 'ภาษาที่ใช้ส่ง',
      admin: { position: 'sidebar' },
    },
  ],
}
