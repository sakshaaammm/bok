import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Experience, Slot } from "@/types";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Users, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [numPeople, setNumPeople] = useState(1);

  const { data: experience, isLoading: experienceLoading } = useQuery({
    queryKey: ['experience', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Experience;
    },
  });

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', id, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      
      const { data, error } = await supabase
        .from('slots')
        .select('*')
        .eq('experience_id', id)
        .eq('date', format(selectedDate, 'yyyy-MM-dd'))
        .order('time');
      
      if (error) throw error;
      return data as Slot[];
    },
    enabled: !!selectedDate,
  });

  const handleCheckout = () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    navigate('/checkout', {
      state: {
        experience,
        slot: selectedSlot,
        numPeople,
      },
    });
  };

  const availableSeats = selectedSlot
    ? selectedSlot.available_seats - selectedSlot.booked_seats
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to experiences
        </Button>

        {experienceLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        ) : experience ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={experience.image_url}
                  alt={experience.title}
                  className="h-[400px] w-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold">{experience.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{experience.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{experience.duration}</span>
                  </div>
                </div>

                <p className="text-lg leading-relaxed">{experience.description}</p>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">₹{experience.price}</span>
                  <span className="text-lg text-muted-foreground">/person</span>
                </div>
              </div>
            </div>

            <Card className="p-6 space-y-6">
              <h2 className="text-2xl font-bold">Select Date & Time</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Choose Date</label>
                  <div className="mt-2 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium">Choose Time</label>
                    <div className="mt-2 grid gap-2">
                      {slotsLoading ? (
                        <Skeleton className="h-12 w-full" />
                      ) : slots && slots.length > 0 ? (
                        slots.map((slot) => {
                          const available = slot.available_seats - slot.booked_seats;
                          const isSoldOut = available <= 0;
                          
                          return (
                            <Button
                              key={slot.id}
                              variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                              className="justify-between"
                              disabled={isSoldOut}
                              onClick={() => setSelectedSlot(slot)}
                            >
                              <span>{slot.time}</span>
                              <span className="text-sm">
                                {isSoldOut ? "Sold Out" : `${available} seats left`}
                              </span>
                            </Button>
                          );
                        })
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          No slots available for this date. Please select another date.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedSlot && (
                  <div>
                    <label className="text-sm font-medium">Number of People</label>
                    <div className="mt-2 flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                      >
                        -
                      </Button>
                      <span className="min-w-[3rem] text-center font-medium">
                        {numPeople}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNumPeople(Math.min(availableSeats, numPeople + 1))
                        }
                        disabled={numPeople >= availableSeats}
                      >
                        +
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        (Max: {availableSeats})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {selectedSlot && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹{(experience.price * numPeople).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ExperienceDetails;
