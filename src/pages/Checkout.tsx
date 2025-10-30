import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Tag } from "lucide-react";
import { toast } from "sonner";
import { Experience, Slot, Booking } from "@/types";
import { format } from "date-fns";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience, slot, numPeople } = location.state as {
    experience: Experience;
    slot: Slot;
    numPeople: number;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount_type: string;
    discount_value: number;
  } | null>(null);

  const subtotal = experience.price * numPeople;
  const discountAmount = appliedPromo
    ? appliedPromo.discount_type === 'percentage'
      ? (subtotal * appliedPromo.discount_value) / 100
      : appliedPromo.discount_value
    : 0;
  const total = subtotal - discountAmount;

  const validatePromo = useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single();

      if (error) throw new Error("Invalid promo code");
      return data;
    },
    onSuccess: (data) => {
      setAppliedPromo(data);
      toast.success("Promo code applied successfully!");
    },
    onError: () => {
      toast.error("Invalid or expired promo code");
    },
  });

  const createBooking = useMutation({
    mutationFn: async (bookingData: Omit<Booking, 'id' | 'booking_date' | 'status'>) => {
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Update slot booked seats
      const { error: slotError } = await supabase
        .from('slots')
        .update({ booked_seats: slot.booked_seats + numPeople })
        .eq('id', slot.id);

      if (slotError) throw slotError;

      return booking;
    },
    onSuccess: (data) => {
      toast.success("Booking confirmed!");
      navigate('/confirmation', {
        state: {
          booking: data,
          experience,
          slot,
          numPeople,
        },
      });
    },
    onError: () => {
      toast.error("Failed to create booking. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    const bookingData = {
      experience_id: experience.id,
      slot_id: slot.id,
      user_name: formData.name,
      user_email: formData.email,
      user_phone: formData.phone,
      num_people: numPeople,
      total_price: total,
      promo_code: appliedPromo?.code,
      discount_amount: discountAmount,
    };

    createBooking.mutate(bookingData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="pt-4">
                <Label htmlFor="promo">Promo Code (Optional)</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => validatePromo.mutate(promoCode)}
                    disabled={!promoCode || validatePromo.isPending}
                  >
                    Apply
                  </Button>
                </div>
                {appliedPromo && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Promo code applied: {appliedPromo.code}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={createBooking.isPending}
              >
                {createBooking.isPending ? "Processing..." : "Confirm Booking"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 h-fit">
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={experience.image_url}
                  alt={experience.title}
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold">{experience.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {experience.location}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {format(new Date(slot.date), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{slot.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">People</span>
                  <span className="font-medium">{numPeople}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
