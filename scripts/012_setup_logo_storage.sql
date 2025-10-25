-- Create logos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'logos',
    'logos',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create policy for authenticated users to upload logos
CREATE POLICY "Users can upload logos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'logos' 
    AND auth.role() = 'authenticated'
);

-- Create policy for authenticated users to update their logos
CREATE POLICY "Users can update logos" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'logos' 
    AND auth.role() = 'authenticated'
);

-- Create policy for authenticated users to delete their logos
CREATE POLICY "Users can delete logos" ON storage.objects
FOR DELETE USING (
    bucket_id = 'logos' 
    AND auth.role() = 'authenticated'
);

-- Create policy for public read access to logos
CREATE POLICY "Public can view logos" ON storage.objects
FOR SELECT USING (bucket_id = 'logos');
