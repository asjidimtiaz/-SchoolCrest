'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const IDLE_TIMEOUT = 120 * 1000 // 2 minutes

export default function KioskController({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

    const resetTimer = useCallback(() => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current)
        }

        // Only start timer if NOT already on the screensaver
        if (pathname !== '/') {
            idleTimerRef.current = setTimeout(() => {
                router.push('/')
            }, IDLE_TIMEOUT)
        }
    }, [router, pathname])

    useEffect(() => {
        resetTimer()

        const events = ['touchstart', 'mousedown', 'mousemove', 'keydown', 'scroll']

        events.forEach(event =>
            window.addEventListener(event, resetTimer)
        )

        return () => {
            events.forEach(event =>
                window.removeEventListener(event, resetTimer)
            )
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current)
            }
        }
    }, [resetTimer])

    return <>{children}</>
}
