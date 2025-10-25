-- Update default currency from ETB to EUR for Dutch-based platform
UPDATE settings SET currency = 'EUR' WHERE currency = 'ETB';

-- Update the default value for future records
ALTER TABLE settings ALTER COLUMN currency SET DEFAULT 'EUR';
