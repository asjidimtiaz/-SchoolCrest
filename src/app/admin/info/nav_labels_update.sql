-- Add custom navigation labels to schools table
ALTER TABLE schools 
ADD COLUMN IF NOT EXISTS nav_hall_of_fame_label TEXT DEFAULT 'Hall of Fame',
ADD COLUMN IF NOT EXISTS nav_teams_label TEXT DEFAULT 'Athletic Teams',
ADD COLUMN IF NOT EXISTS nav_calendar_label TEXT DEFAULT 'Campus Events',
ADD COLUMN IF NOT EXISTS nav_info_label TEXT DEFAULT 'School Profile';
