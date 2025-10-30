export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  image_url: string;
  category: string | null;
  created_at: string;
}

export interface Slot {
  id: string;
  experience_id: string;
  date: string;
  time: string;
  available_seats: number;
  booked_seats: number;
  created_at: string;
}

export interface Booking {
  id?: string;
  experience_id: string;
  slot_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  num_people: number;
  total_price: number;
  promo_code?: string;
  discount_amount?: number;
  booking_date?: string;
  status?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  active: boolean;
  created_at: string;
}
