-- Create payments table to store donation records
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  branch TEXT NOT NULL,
  screenshot_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert payments (for donation form)
CREATE POLICY "Anyone can insert payments" ON payments
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow only authenticated reads (for admin)
-- For now, allow all reads since we have app-level auth
CREATE POLICY "Anyone can view payments" ON payments
  FOR SELECT
  USING (true);
