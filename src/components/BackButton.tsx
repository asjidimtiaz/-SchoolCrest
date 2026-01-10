'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BackButton({ href = '/home', label = 'Back', className = '' }: { href?: string, label?: string, className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 transition-all active:scale-95 duration-200 ${className}`}
    >
      <ArrowLeft size={18} strokeWidth={3} />
      <span className="uppercase tracking-widest leading-none">{label}</span>
    </Link>
  )
}
