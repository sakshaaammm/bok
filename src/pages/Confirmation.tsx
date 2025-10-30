import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, experience, slot, numPeople } = location.state || {};

  if (!booking) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-green-600">Booking Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Your booking has been successfully confirmed
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono font-medium">{booking.id?.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Experience</span>
              <span className="font-medium">{experience.title}</span>
            </div>
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
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">Total Paid</span>
              <span className="text-xl font-bold">₹{booking.total_price?.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to {booking.user_email}
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default Confirmation;
