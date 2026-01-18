const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clearSponsors() {
  // First, let's see what schools we have
  const { data: schools } = await supabase
    .from('schools')
    .select('id, name, slug, sponsor_logo_1, sponsor_logo_2, sponsor_logo_3');
  
  console.log('Current schools:');
  console.log(JSON.stringify(schools, null, 2));
  
  // Update all schools to clear sponsor logos
  for (const school of schools) {
    if (school.sponsor_logo_1 || school.sponsor_logo_2 || school.sponsor_logo_3) {
      console.log(`\nClearing sponsors for: ${school.name} (${school.slug})`);
      const { error } = await supabase
        .from('schools')
        .update({
          sponsor_logo_1: null,
          sponsor_logo_2: null,
          sponsor_logo_3: null
        })
        .eq('id', school.id);
      
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('✓ Sponsors cleared');
      }
    }
  }
  
  console.log('\n✓ Done!');
}

clearSponsors();
