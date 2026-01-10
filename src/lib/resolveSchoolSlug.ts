import { headers } from 'next/headers'

export async function resolveSchoolSlug(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const hostname = host.split(':')[0]
  const parts = hostname.split('.')

  // Root domain or localhost → demo school
  if (hostname === 'schoolcrestinteractive.com' || hostname.includes('localhost')) {
    return 'schoolcrestinteractive'
  }

  // subdomain.schoolcrestinteractive.com
  if (parts.length === 3 && hostname.endsWith('.schoolcrestinteractive.com')) {
    return parts[0]
  }

  return 'schoolcrestinteractive'
}
