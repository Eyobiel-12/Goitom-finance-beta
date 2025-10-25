-- Add logo_url column to organizations table
ALTER TABLE organizations ADD COLUMN logo_url TEXT;

-- Add logo_url column to settings table for default logo
ALTER TABLE settings ADD COLUMN logo_url TEXT;
