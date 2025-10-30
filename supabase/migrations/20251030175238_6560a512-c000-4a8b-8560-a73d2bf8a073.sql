-- Create experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create slots table
CREATE TABLE IF NOT EXISTS public.slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  available_seats INTEGER NOT NULL DEFAULT 10,
  booked_seats INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(experience_id, date, time)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES public.slots(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  num_people INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  promo_code TEXT,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  booking_date TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'confirmed'
);

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for experiences (public read)
CREATE POLICY "Anyone can view experiences"
  ON public.experiences FOR SELECT
  USING (true);

-- RLS Policies for slots (public read)
CREATE POLICY "Anyone can view slots"
  ON public.slots FOR SELECT
  USING (true);

-- RLS Policies for bookings (public insert, own read)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (true);

-- RLS Policies for promo_codes (public read active codes)
CREATE POLICY "Anyone can view active promo codes"
  ON public.promo_codes FOR SELECT
  USING (active = true);

-- Insert sample experiences
INSERT INTO public.experiences (title, description, location, duration, price, image_url, category) VALUES
('Kayaking Adventure', 'Explore serene waterways surrounded by lush mangroves. Perfect for nature lovers and adventure seekers looking for a peaceful yet exciting experience.', 'Goa', '2 hours', 899.00, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'Water Sports'),
('Sunset Boat Ride', 'Experience breathtaking sunset views on a peaceful boat cruise. Relax and enjoy the golden hour on calm waters.', 'Kerala', '1.5 hours', 649.00, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', 'Cruise'),
('River Rafting', 'Experience the thrill of white water rafting through scenic rapids. An adrenaline-pumping adventure for thrill seekers.', 'Rishikesh', '3 hours', 1299.00, 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800', 'Adventure'),
('Beach Cycling', 'Cycle along pristine beaches with ocean views. A perfect blend of exercise and scenic beauty.', 'Goa', '2 hours', 499.00, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800', 'Cycling'),
('Mountain Trekking', 'Trek through scenic mountain trails with stunning valley views. Experience nature at its finest.', 'Himachal', '4 hours', 799.00, 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', 'Trekking'),
('Jungle Safari', 'Explore wildlife in their natural habitat. Spot exotic animals and birds in a guided safari experience.', 'Ranthambore', '3 hours', 1499.00, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', 'Wildlife');

-- Insert sample promo codes
INSERT INTO public.promo_codes (code, discount_type, discount_value, active) VALUES
('SAVE10', 'percentage', 10.00, true),
('FLAT100', 'fixed', 100.00, true),
('WELCOME20', 'percentage', 20.00, true);