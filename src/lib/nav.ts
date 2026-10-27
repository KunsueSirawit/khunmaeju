// Main menu. Labels live in messages/*.json under "Nav".
export const mainNav = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'products', href: '/products' },
  { key: 'howToOrder', href: '/how-to-order' },
  { key: 'services', href: '/services' },
  { key: 'news', href: '/news' },
  { key: 'contact', href: '/contact' },
] as const

export type NavKey = (typeof mainNav)[number]['key']
