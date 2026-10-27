type Props = {
  eyebrow?: string | null
  heading?: string | null
  subheading?: string | null
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  id?: string
}

export function SectionHeading({ eyebrow, heading, subheading, align = 'center', tone = 'dark', id }: Props) {
  if (!heading && !eyebrow) return null
  const centered = align === 'center'
  return (
    <div className={`mb-10 max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p
          className={`mb-2 text-sm font-semibold tracking-wide ${tone === 'light' ? 'text-accent-400' : 'text-accent-600'}`}
        >
          {eyebrow}
        </p>
      )}
      {heading && (
        <h2
          id={id}
          className={`text-3xl font-bold sm:text-4xl ${tone === 'light' ? 'text-white' : 'text-brand-800'}`}
        >
          {heading}
        </h2>
      )}
      <span
        aria-hidden
        className={`mt-4 block h-1 w-14 rounded-full bg-accent-500 ${centered ? 'mx-auto' : ''}`}
      />
      {subheading && (
        <p className={`mt-4 text-lg ${tone === 'light' ? 'text-white/80' : 'text-muted'}`}>{subheading}</p>
      )}
    </div>
  )
}
