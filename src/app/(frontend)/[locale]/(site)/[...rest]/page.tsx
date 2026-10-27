import { notFound } from 'next/navigation'

// Unknown URLs under /th or /en: render the 404 inside the site header/footer.
export default function CatchAll() {
  notFound()
}
