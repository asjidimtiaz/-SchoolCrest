import ClientKioskShell from '@/components/ClientKioskShell'
import { KioskProvider } from '@/context/KioskContext'

export default function KioskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <KioskProvider>
      <ClientKioskShell>
        {children}
      </ClientKioskShell>
    </KioskProvider>
  )
}
