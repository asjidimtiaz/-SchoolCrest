DO $$ 
BEGIN 
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'nav_hall_of_fame_tagline') THEN
        ALTER TABLE schools ADD COLUMN nav_hall_of_fame_tagline text DEFAULT 'Honoring exceptional alumni and staff';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'nav_teams_tagline') THEN
        ALTER TABLE schools ADD COLUMN nav_teams_tagline text DEFAULT 'Explore our sports and history';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'nav_calendar_tagline') THEN
        ALTER TABLE schools ADD COLUMN nav_calendar_tagline text DEFAULT 'Stay updated with school activities';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'nav_info_tagline') THEN
        ALTER TABLE schools ADD COLUMN nav_info_tagline text DEFAULT 'Information about our community';
    END IF;
END $$;
