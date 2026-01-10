import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manual env parsing
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
    console.log("--- STARTING ISOLATION TEST ---\n")

    // 1. Get the Latest Admin to find their school
    const { data: admin } = await supabase.from('admins').select('id, school_id, schools(name)').order('created_at', { ascending: false }).limit(1).single()
    
    if (!admin || !admin.school_id) {
        console.error("No admin or school linked found for verification.")
        console.log("ISOLATION_TEST_COMPLETE_FAIL")
        return
    }

    const newSchoolId = admin.school_id
    const newSchoolName = admin.schools?.name
    console.log(`Target School (from Admin): ${newSchoolName} (${newSchoolId})`)

    // 2. Get the Demo School ID
    const { data: demoSchool } = await supabase.from('schools').select('id, name').eq('slug', 'schoolcrestinteractive').single()
    if (!demoSchool) { console.error("Demo school not found!"); return }
    console.log(`Demo School:   ${demoSchool.name} (${demoSchool.id})`)

    if (newSchoolId === demoSchool.id) {
        console.error("ERROR: Admin is linked to Demo school! Isolation test invalid.")
        return
    }

    // 3. Count initial teams
    const { count: initialNewCount } = await supabase.from('teams').select('*', { count: 'exact', head: true }).eq('school_id', newSchoolId)
    const { count: initialDemoCount } = await supabase.from('teams').select('*', { count: 'exact', head: true }).eq('school_id', demoSchool.id)
    
    console.log(`\nInitial Team Counts:`)
    console.log(`- New School: ${initialNewCount}`)
    console.log(`- Demo School: ${initialDemoCount}`)

    // 4. Create a Team in New School
    console.log(`\nCreating "Isolation Test Team" in New School...`)
    const { data: team, error } = await supabase.from('teams').insert({
        school_id: newSchoolId,
        name: "Isolation Test Team " + Date.now(),
        gender: "Co-ed",
        level: "Varsity"
    }).select().single()

    if (error) { console.error("Creation failed:", error); return }

    // 5. Verify Counts Again
    const { count: finalNewCount } = await supabase.from('teams').select('*', { count: 'exact', head: true }).eq('school_id', newSchoolId)
    const { count: finalDemoCount } = await supabase.from('teams').select('*', { count: 'exact', head: true }).eq('school_id', demoSchool.id)

    console.log(`\nFinal Team Counts:`)
    console.log(`- New School: ${finalNewCount} (Expected: ${initialNewCount! + 1})`)
    console.log(`- Demo School: ${finalDemoCount} (Expected: ${initialDemoCount})`)

    if (finalNewCount === initialNewCount! + 1 && finalDemoCount === initialDemoCount) {
        console.log("\n✅ PASSED: Data creation was isolated to the new school.")
        console.log("ISOLATION_TEST_COMPLETE_SUCCESS")
    } else {
        console.log("\n❌ FAILED: Data isolation check failed.")
        console.log("ISOLATION_TEST_COMPLETE_FAIL")
    }
}

main()
