
-- Create payment_proofs storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment_proofs',
  'payment_proofs',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create policy for authenticated users to upload their own payment proofs
CREATE POLICY "Users can upload payment proofs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment_proofs' AND
  auth.role() = 'authenticated'
);

-- Create policy for users to view their own payment proofs
CREATE POLICY "Users can view payment proofs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payment_proofs' AND
  auth.role() = 'authenticated'
);

-- Create policy for business owners to view payment proofs for their appointments
CREATE POLICY "Business owners can view payment proofs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payment_proofs' AND
  auth.role() = 'authenticated'
);
