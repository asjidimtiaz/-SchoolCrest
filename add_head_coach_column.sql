-- Add head_coach column to teams table
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS head_coach TEXT;

-- Add comment to document the column
COMMENT ON COLUMN teams.head_coach IS 'Name of the team head coach';
