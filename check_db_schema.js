const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkColumn() {
  console.log('Checking for google_api_key column...')
  
  // Try to select the column
  const { data, error } = await supabase
    .from('schools')
    .select('id, google_api_key')
    .limit(1)

  if (error) {
    if (error.code === '42703') {
      console.error('COLUMN MISSING: google_api_key does not exist in schools table.')
      console.log('Please run this SQL in Supabase Dashboard:')
      console.log('ALTER TABLE schools ADD COLUMN google_api_key TEXT;')
    } else {
      console.error('Database error:', error.message)
    }
  } else {
    console.log('SUCCESS: google_api_key column exists.')
  }
}

checkColumn()
