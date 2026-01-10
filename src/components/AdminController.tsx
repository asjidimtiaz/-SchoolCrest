'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const ADMIN_IDLE_TIMEOUT = 15 * 60 * 1000 // 15 minutes for admin

export default function AdminController({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

    const handleSignOut = useCallback(async () => {
        // Trigger the signout action
        const response = await fetch('/auth/signout', { method: 'POST' })
        if (response.ok) {
            router.push('/admin/login')
            router.refresh()
        }
    }, [router])

    const resetTimer = useCallback(() => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current)
        }

        idleTimerRef.current = setTimeout(() => {
            handleSignOut()
        }, ADMIN_IDLE_TIMEOUT)
    }, [handleSignOut])

    useEffect(() => {
        resetTimer()

        const events = ['touchstart', 'mousedown', 'mousemove', 'keydown', 'scroll']
        const handleEvent = () => resetTimer()

        events.forEach(event => {
            window.addEventListener(event, handleEvent)
        })

        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
            events.forEach(event => {
                window.removeEventListener(event, handleEvent)
            })
        }
    }, [resetTimer])

    return <>{children}</>
}
