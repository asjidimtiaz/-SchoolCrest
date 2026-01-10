const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('Checking Schema...\n');

  // Check schools table
  const { data: schoolData, error: schoolError } = await supabase.from('schools').select('*').limit(1);
  if (schoolError) {
    console.error('Error fetching schools:', schoolError.message);
  } else if (schoolData && schoolData.length > 0) {
    console.log('Schools columns:', Object.keys(schoolData[0]));
  } else {
    console.log('No schools found to check columns.');
  }

  // Check team_seasons table
  const { data: seasonData, error: seasonError } = await supabase.from('team_seasons').select('*').limit(1);
  if (seasonError) {
    console.error('Error fetching team_seasons:', seasonError.message);
  } else if (seasonData && seasonData.length > 0) {
    console.log('Team Seasons columns:', Object.keys(seasonData[0]));
  } else {
    console.log('No team_seasons found to check columns.');
  }
}

checkSchema();
