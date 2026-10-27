import type { Redirect } from 'next/dist/lib/load-custom-routes'

/**
 * 301s from the old WordPress/WooCommerce site (khunmaejuphuket.com) so search rankings
 * and old links carry over. Old URLs had no language prefix and were Thai, so they go to /th.
 *
 * Old product/category slugs may not match the new ones: those URLs carry ?from=legacy, and
 * the product/category page sends an unknown slug to the product list instead of a 404.
 * To keep a specific old URL working, give the new product the same slug as the old one.
 */
const sections: [string, string][] = [
  ['/shop', '/th/products'],
  ['/about', '/th/about'],
  ['/about-us', '/th/about'],
  ['/shop_location', '/th/contact'],
  ['/contact', '/th/contact'],
  ['/contact-us', '/th/contact'],
  ['/cart', '/th/how-to-order'],
  ['/checkout', '/th/how-to-order'],
  ['/my-account', '/th'],
  ['/blog', '/th/news'],
]

export const legacyRedirects: Redirect[] = [
  // WordPress URLs end in "/": Next first strips it (308), then these apply (301).
  ...sections.map(([from, to]) => ({ source: from, destination: to, permanent: true })),
  { source: '/product/:slug', destination: '/th/products/:slug?from=legacy', permanent: true },
  {
    source: '/product-category/:path*/:slug',
    destination: '/th/products/category/:slug?from=legacy',
    permanent: true,
  },
  { source: '/product-category/:slug', destination: '/th/products/category/:slug?from=legacy', permanent: true },
  { source: '/shop_location/:rest*', destination: '/th/contact', permanent: true },
  { source: '/category/:rest*', destination: '/th/news', permanent: true },
  { source: '/feed', destination: '/th/news', permanent: true },
]
