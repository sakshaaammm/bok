import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <MapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">BookIt</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
