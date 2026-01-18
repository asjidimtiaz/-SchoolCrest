const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function forceCleanSponsors() {
  console.log('Fetching all schools...');
  const { data: schools, error: fetchError } = await supabase
    .from('schools')
    .select('*');
  
  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }
  
  console.log(`Found ${schools.length} schools\n`);
  
  for (const school of schools) {
    console.log(`Processing: ${school.name} (${school.slug})`);
    console.log(`  Current sponsor_logo_1: ${school.sponsor_logo_1}`);
    console.log(`  Current sponsor_logo_2: ${school.sponsor_logo_2}`);
    console.log(`  Current sponsor_logo_3: ${school.sponsor_logo_3}`);
    
    const { error: updateError } = await supabase
      .from('schools')
      .update({
        sponsor_logo_1: null,
        sponsor_logo_2: null,
        sponsor_logo_3: null
      })
      .eq('id', school.id);
    
    if (updateError) {
      console.error('  ❌ Update error:', updateError);
    } else {
      console.log('  ✓ Cleared all sponsor logos');
    }
    console.log('');
  }
  
  console.log('Done! Verifying...\n');
  
  const { data: verification } = await supabase
    .from('schools')
    .select('name, slug, sponsor_logo_1, sponsor_logo_2, sponsor_logo_3');
  
  verification.forEach(s => {
    if (s.sponsor_logo_1 || s.sponsor_logo_2 || s.sponsor_logo_3) {
      console.log(`⚠️  ${s.name} still has sponsors!`);
    } else {
      console.log(`✓ ${s.name} - all clear`);
    }
  });
}

forceCleanSponsors();
