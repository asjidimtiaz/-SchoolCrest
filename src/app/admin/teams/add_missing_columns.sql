-- Safe SQL update script to add missing columns for teams and seasons
-- Run this in your Supabase SQL Editor

DO $$ 
BEGIN 
    -- 1. Update 'teams' table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='head_coach') THEN
        ALTER TABLE teams ADD COLUMN head_coach text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='media_type') THEN
        ALTER TABLE teams ADD COLUMN media_type text DEFAULT 'image';
    END IF;

    -- 2. Update 'team_seasons' table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team_seasons' AND column_name='photo_url') THEN
        ALTER TABLE team_seasons ADD COLUMN photo_url text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team_seasons' AND column_name='individual_accomplishments') THEN
        ALTER TABLE team_seasons ADD COLUMN individual_accomplishments text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team_seasons' AND column_name='summary') THEN
        ALTER TABLE team_seasons ADD COLUMN summary text;
    END IF;
END $$;
