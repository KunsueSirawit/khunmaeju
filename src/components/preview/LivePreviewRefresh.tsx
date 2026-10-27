'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/** Inside the admin's Live Preview iframe: re-render the page each time the editor saves (autosave included). */
export function LivePreviewRefresh({ serverURL }: { serverURL: string }) {
  const router = useRouter()
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
}
