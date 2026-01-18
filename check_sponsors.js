const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSponsors() {
  const { data, error } = await supabase
    .from('schools')
    .select('id, name, slug, sponsor_logo_1, sponsor_logo_2, sponsor_logo_3');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  data.forEach(school => {
    if (school.sponsor_logo_1 || school.sponsor_logo_2 || school.sponsor_logo_3) {
      console.log(`\n${school.name} (${school.slug}):`);
      console.log('  Logo 1:', school.sponsor_logo_1);
      console.log('  Logo 2:', school.sponsor_logo_2);
      console.log('  Logo 3:', school.sponsor_logo_3);
    }
  });
}

checkSponsors();
