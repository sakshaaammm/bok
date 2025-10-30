-- Insert time slots for all experiences for the next 7 days
INSERT INTO public.slots (experience_id, date, time, available_seats, booked_seats)
SELECT 
  e.id,
  (CURRENT_DATE + d.day_offset)::date as date,
  t.time_slot,
  10 as available_seats,
  0 as booked_seats
FROM public.experiences e
CROSS JOIN (
  SELECT generate_series(1, 7) as day_offset
) d
CROSS JOIN (
  SELECT unnest(ARRAY[
    '09:00 AM',
    '11:00 AM',
    '01:00 PM',
    '03:00 PM',
    '05:00 PM'
  ]) as time_slot
) t
ON CONFLICT (experience_id, date, time) DO NOTHING;