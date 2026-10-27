import type { Payload } from 'payload'
import type { Media } from '@/payload-types'
import sharp from 'sharp'

/** Marker for content we do not have yet. Search the admin for it before launch. */
export const TODO = '[รอข้อมูล]'
export const TODO_EN = '[PLACEHOLDER]'

export { richText } from '@/lib/lexical'

const escapeXML = (s: string) => s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`)

/**
 * Uploads a generated grey "PLACEHOLDER" image so layouts can be judged with real
 * aspect ratios. Text is ASCII only: the Docker image has no Thai fonts for SVG rendering.
 */
export const placeholderImage = async (
  payload: Payload,
  { label, width = 1200, height = 1200, alt }: { label: string; width?: number; height?: number; alt: string },
): Promise<Media['id']> => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#e7e2d8"/>
    <rect x="12" y="12" width="${width - 24}" height="${height - 24}" fill="none" stroke="#b9ad97" stroke-width="6" stroke-dasharray="24 16"/>
    <text x="50%" y="46%" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(width / 14)}" font-weight="700" fill="#8a7d66">PLACEHOLDER</text>
    <text x="50%" y="58%" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(width / 24)}" fill="#8a7d66">${escapeXML(label)}</text>
  </svg>`
  const data = await sharp(Buffer.from(svg)).png().toBuffer()
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: 'image/png',
      name: `placeholder-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`,
      size: data.length,
    },
  })
  return doc.id
}

/** A one-page PDF so the "download certificate" button has something to serve. */
export const placeholderPDF = async (payload: Payload, label: string): Promise<Media['id']> => {
  const text = `PLACEHOLDER - ${label}`.replace(/[()\\]/g, '')
  const stream = `BT /F1 24 Tf 72 720 Td (${text}) Tj ET`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((obj, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  pdf += offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  const data = Buffer.from(pdf, 'latin1')
  const doc = await payload.create({
    collection: 'media',
    data: { alt: `${TODO} ${label}` },
    file: {
      data,
      mimetype: 'application/pdf',
      name: `placeholder-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`,
      size: data.length,
    },
  })
  return doc.id
}
