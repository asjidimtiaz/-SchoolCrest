const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.argv[2]
const supabaseServiceRoleKey = process.argv[3]

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

async function checkSchema() {
  const { data, error } = await supabaseAdmin
    .rpc('get_table_columns', { table_name: 'admins' })
    .catch(() => ({ data: null, error: { message: 'RPC not found' } }))

  // Fallback to direct SQL query if RPC fails (though we can't run raw SQL easily via client)
  // Let's just try to select * and look at the first row's keys again but with better logging
  const { data: adminData, error: adminError } = await supabaseAdmin
    .from('admins')
    .select('*')
    .limit(1)

  if (adminError) {
    console.error('Select Error:', adminError.message)
  }

  if (adminData && adminData.length > 0) {
    console.log('--- ADMIN COLUMNS ---')
    console.log(JSON.stringify(Object.keys(adminData[0]), null, 2))
    console.log('---------------------')
  } else {
    console.log('No rows in admins table to check schema from.')
  }
}

checkSchema()
