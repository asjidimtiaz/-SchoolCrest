const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clearBrokenSponsors() {
  // Find schools with sponsor logos
  const { data: schools } = await supabase
    .from('schools')
    .select('id, name, slug, sponsor_logo_1, sponsor_logo_2, sponsor_logo_3');
  
  for (const school of schools) {
    if (school.sponsor_logo_1 || school.sponsor_logo_2 || school.sponsor_logo_3) {
      console.log(`Clearing broken sponsor URLs for: ${school.name} (${school.slug})`);
      
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
        console.log('✓ Cleared');
      }
    }
  }
  
  console.log('\n✓ All broken sponsor URLs cleared!');
  console.log('\nYou can now upload fresh sponsor logos via Admin > School Info');
}

clearBrokenSponsors();
