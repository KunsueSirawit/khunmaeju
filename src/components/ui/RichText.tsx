import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'

import type { Product } from '@/payload-types'

// Every rich text field in the schema shares this Lexical shape.
type RichTextData = NonNullable<Product['description']>

const sectionPath: Record<string, string> = { products: 'products', posts: 'news' }

/** Rich text from the CMS, styled with the typography plugin. Internal links keep the current locale. */
export function RichText({
  data,
  locale,
  className = '',
}: {
  data: RichTextData | null | undefined
  locale: string
  className?: string
}) {
  if (!data?.root?.children?.length) return null

  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }) => {
        const { relationTo, value } = linkNode.fields.doc ?? {}
        const slug = value && typeof value === 'object' ? (value as { slug?: string }).slug : null
        const section = relationTo ? sectionPath[relationTo] : null
        return section && slug ? `/${locale}/${section}/${slug}` : `/${locale}`
      },
    }),
  })

  return (
    <LexicalRichText
      data={data}
      converters={converters}
      className={`prose max-w-none prose-headings:font-heading prose-headings:text-brand-800 prose-a:text-brand-700 prose-img:rounded-xl ${className}`}
    />
  )
}
