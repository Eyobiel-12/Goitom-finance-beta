-- Check if logo_url column exists in organizations table
-- Run this in Supabase Dashboard SQL Editor

SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'organizations' 
AND column_name = 'logo_url';

-- If the column doesn't exist, add it:
-- ALTER TABLE organizations ADD COLUMN logo_url TEXT;

-- Also check settings table:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'settings' 
AND column_name = 'logo_url';

-- If the column doesn't exist, add it:
-- ALTER TABLE settings ADD COLUMN logo_url TEXT;
