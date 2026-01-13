DO $$
BEGIN
    -- Add background_url to teams table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='background_url') THEN
        ALTER TABLE teams ADD COLUMN background_url text;
    END IF;
END $$;
