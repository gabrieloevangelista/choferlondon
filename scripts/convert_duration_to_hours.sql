-- Convert duration from minutes to hours
ALTER TABLE tours ADD COLUMN duration_hours DECIMAL(10,2);

-- Update the new column with converted values
UPDATE tours SET duration_hours = CAST(duration AS DECIMAL(10,2)) / 60;

-- Drop the old column
ALTER TABLE tours DROP COLUMN duration;

-- Rename the new column to duration
ALTER TABLE tours RENAME COLUMN duration_hours TO duration;
