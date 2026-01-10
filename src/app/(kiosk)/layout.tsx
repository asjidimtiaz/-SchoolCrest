import ClientKioskShell from '@/components/ClientKioskShell'

export default function KioskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientKioskShell>
      {children}
    </ClientKioskShell>
  )
}
