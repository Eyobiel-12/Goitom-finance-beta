-- Create logos storage bucket manually
-- Run this in Supabase Dashboard SQL Editor

-- First, create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'logos',
    'logos', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Then create the policies
CREATE POLICY "Users can upload logos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'logos' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update logos" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'logos' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete logos" ON storage.objects
FOR DELETE USING (
    bucket_id = 'logos' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Public can view logos" ON storage.objects
FOR SELECT USING (bucket_id = 'logos');
