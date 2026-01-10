const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    if (key && vals) env[key.trim()] = vals.join('=').trim().replace(/^"(.*)"$/, '$1')
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const recursiveClean = (val) => {
    if (Array.isArray(val)) return val.map(s => String(s).trim())
    if (typeof val === 'string') {
        let current = val
        for (let i = 0; i < 5; i++) {
            try {
                const parsed = JSON.parse(current)
                if (Array.isArray(parsed)) {
                    return parsed.map(s => String(s).trim())
                } else if (typeof parsed === 'string') {
                    current = parsed
                } else {
                    break
                }
            } catch (e) {
                break
            }
        }
        return current.split('\n').map(s => s.trim()).filter(Boolean)
    }
    return []
}

async function repair() {
    console.log('--- REPAIRING HALL OF FAME DATA ---')
    const { data: inds, error } = await supabase.from('hall_of_fame').select('*')
    if (error) return console.error(error)

    for (const ind of inds) {
        const cleanAch = recursiveClean(ind.achievements)
        
        console.log(`Fixing [${ind.name}]...`)
        
        const { error: updError } = await supabase
            .from('hall_of_fame')
            .update({ achievements: cleanAch })
            .eq('id', ind.id)

        if (updError) console.error(`  Error fixing ${ind.name}:`, updError.message)
        else console.log(`  Success.`)
    }
    console.log('--- COMPLETED ---')
}

repair()
