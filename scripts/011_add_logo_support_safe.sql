-- Safely add logo_url column to organizations table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizations' 
        AND column_name = 'logo_url'
    ) THEN
        ALTER TABLE organizations ADD COLUMN logo_url TEXT;
    END IF;
END $$;

-- Safely add logo_url column to settings table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'settings' 
        AND column_name = 'logo_url'
    ) THEN
        ALTER TABLE settings ADD COLUMN logo_url TEXT;
    END IF;
END $$;
