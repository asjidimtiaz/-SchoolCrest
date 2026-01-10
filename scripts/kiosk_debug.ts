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
    // 1. List all schools and their active status
    const { data: schools } = await supabase.from('schools').select('id, name, slug, active')
    console.log("--- SCHOOLS ---")
    console.log(JSON.stringify(schools, null, 2))

    // 2. List recent admins
    const { data: admins } = await supabase
        .from('admins')
        .select('id, email, school_id, role')
        .order('created_at', { ascending: false })
        .limit(3)
    
    console.log("\n--- RECENT ADMINS ---")
    console.log(JSON.stringify(admins, null, 2))
}

main()
