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

async function run() {
  console.log('--- LATEST ENTRY CHECK ---')
  const { data: inds } = await supabase.from('hall_of_fame').select('*').order('created_at', { ascending: false }).limit(1)
  if (!inds || inds.length === 0) return console.log('No entries found')
  
  const i = inds[0]
  console.log(`NAME: ${i.name}`)
  console.log(`PHOTO_URL: ${i.photo_url}`)
  console.log(`ACHIEVEMENTS: ${JSON.stringify(i.achievements)}`)
  console.log(`ACH_TYPE: ${typeof i.achievements}`)
  
  if (i.photo_url && i.photo_url.includes('supabase.co')) {
      console.log('URL is a Supabase URL. Checking storage...')
      // Try to check if file exists
  } else {
      console.log('URL is NOT a Supabase URL (Likely still an external link).')
  }
}
run()
