import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

let env: any = {}
try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
        const parts = line.split('=')
        if (parts.length >= 2) {
            env[parts[0].trim()] = parts.slice(1).join('=').trim()
        }
    })
} catch (e) { }

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY 

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false } 
})

async function main() {
  // 1. Get recent admin
  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !admin) {
      console.log("No admin found to fix.")
      return
  }

  console.log(`Fixing Admin: ${admin.id}`)

  // 2. Find "My New Test School" or Create it
  let { data: school } = await supabase.from('schools').select('id').eq('name', 'My New Test School').maybeSingle()
  
  if (!school) {
      console.log("Creating test school...")
      const { data: newSchool, error: createError } = await supabase
        .from('schools')
        .insert({
            name: "My New Test School",
            slug: "my-test-school-" + Date.now(), // Unique slug
            active: true,
            primary_color: '#000000',
            secondary_color: '#ffffff',
            accent_color: '#3b82f6'
        })
        .select('id')
        .single()
      
      if (createError) {
          console.error("Failed to create school", createError)
          return
      }
      school = newSchool
  }
  
  console.log(`Linking to school: ${school.id}`)

  // 3. Update Admin
  const { error: updateError } = await supabase
    .from('admins')
    .update({
        school_id: school.id,
        role: 'school_admin'
    })
    .eq('id', admin.id)

  if (updateError) console.error("Update failed", updateError)
  else console.log("SUCCESS: Admin re-linked to Test School.")
}

main()
