import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Experience } from "@/types";
import { Link } from "react-router-dom";

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/experience/${experience.id}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={experience.image_url}
            alt={experience.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <div className="space-y-3 p-4">
          <h3 className="font-semibold text-lg">{experience.title}</h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{experience.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{experience.duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">₹{experience.price}</span>
              <span className="text-sm text-muted-foreground">/person</span>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Book Now
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ExperienceCard;
