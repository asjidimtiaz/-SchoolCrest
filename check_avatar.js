const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAvatar() {
  const { data, error } = await supabase
    .from('admins')
    .select('id, email, full_name, avatar_url')
    .limit(5);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('\n=== ADMIN AVATARS ===\n');
    data.forEach(admin => {
      console.log(`Name: ${admin.full_name || 'N/A'}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Avatar URL: ${admin.avatar_url || 'NULL'}`);
      console.log('---');
    });
  }
  process.exit(0);
}

checkAvatar();
