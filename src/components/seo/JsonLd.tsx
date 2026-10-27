/**
 * Structured data for search engines. `<` is escaped so CMS text can never close the
 * script tag (e.g. a product name containing "</script>").
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
