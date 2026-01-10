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
    const { data: schools } = await supabase.from('schools').select('id, name')
    console.log("--- SCHOOL_LIST_START ---")
    if (schools) {
        schools.forEach(s => {
            console.log(`ID: ${s.id} | Name: ${s.name}`)
        })
    }
    console.log("--- SCHOOL_LIST_END ---")
}

main()
