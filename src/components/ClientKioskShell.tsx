'use client'

import { useEffect, ReactNode } from 'react'
import KioskController from '@/components/KioskController'
import useKioskLock from '@/hooks/useKioskLock'
import useAutoReload from '@/hooks/useAutoReload'

export default function ClientKioskShell({ children }: { children: ReactNode }) {
  useKioskLock()
  useAutoReload()

  useEffect(() => {
    window.history.pushState(null, '', window.location.href)

    const blockBack = () => {
      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('popstate', blockBack)
    return () => window.removeEventListener('popstate', blockBack)
  }, [])

  return <KioskController>{children}</KioskController>
}
