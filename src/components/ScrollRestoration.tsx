'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollRestoration() {
  const pathname = usePathname()
  
  useEffect(() => {
    // If there is no hash in the URL, force scroll to top on every route change
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname])
  
  return null
}
