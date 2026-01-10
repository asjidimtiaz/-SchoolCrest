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
    const { data: admins } = await supabase
        .from('admins')
        .select('id, email, school_id, role, schools(name, slug)')
        .order('created_at', { ascending: false })
        .limit(3)

    console.log("\n--- RECENT ADMINS ---")
    admins?.forEach(a => {
        console.log(`ID: ${a.id}`)
        console.log(`Email: ${a.email}`)
        console.log(`Role: ${a.role}`)
        console.log(`School: ${a.schools?.name} (${a.school_id})`)
        console.log(`Slug: ${a.schools?.slug}`)
        console.log("---------------------")
    })
}

main()
