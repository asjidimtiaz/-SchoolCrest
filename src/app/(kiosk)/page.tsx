'use client'

import Screensaver from '@/components/Screensaver'
import { useRouter } from 'next/navigation'

export default function ScreensaverPage() {
  const router = useRouter()

  const handleStart = () => {
    router.push('/home')
  }

  return <Screensaver onStart={handleStart} />
}
