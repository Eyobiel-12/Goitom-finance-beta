-- Check and add logo_url columns if they don't exist
-- Run this in Supabase Dashboard SQL Editor

-- Check if logo_url column exists in organizations table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizations' 
        AND column_name = 'logo_url'
    ) THEN
        ALTER TABLE organizations ADD COLUMN logo_url TEXT;
        RAISE NOTICE 'Added logo_url column to organizations table';
    ELSE
        RAISE NOTICE 'logo_url column already exists in organizations table';
    END IF;
END $$;

-- Check if logo_url column exists in settings table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'settings' 
        AND column_name = 'logo_url'
    ) THEN
        ALTER TABLE settings ADD COLUMN logo_url TEXT;
        RAISE NOTICE 'Added logo_url column to settings table';
    ELSE
        RAISE NOTICE 'logo_url column already exists in settings table';
    END IF;
END $$;
