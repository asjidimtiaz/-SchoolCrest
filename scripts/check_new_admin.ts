import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  { auth: { persistSession: false } }
)

async function main() {
  // Get the most recent admin
  const { data: admin, error } = await supabase
    .from('admins')
    .select('*, schools(name, slug)')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching admin:", error.message)
    return
  }

  if (!admin) {
    console.log("No admins found.")
    return
  }

  console.log("\n--- NEWEST ADMIN DIAGNOSTIC ---")
  console.log(`Admin ID:   ${admin.id}`)
  console.log(`Email:      (Check Auth Table for email matching ID)`)
  console.log(`School ID:  ${admin.school_id}`)
  console.log(`School:     ${admin.schools?.name}`)
  console.log(`Slug:       ${admin.schools?.slug}`)
  console.log(`Role:       ${admin.role}`)
  console.log("-------------------------------")

  // Check for any data associated with this school to verify "Empty State"
  const { count: teamCount } = await supabase
    .from('teams')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', admin.school_id)

  console.log(`Existing Teams for this school: ${teamCount}`)
}

main()
