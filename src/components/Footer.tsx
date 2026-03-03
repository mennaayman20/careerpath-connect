import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-12 border-t border-border/50 bg-primary/9">
      <div className="container mx-auto px-6 text-center space-y-4">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-1">
          <span className="text-2xl tracking-tight ">
            <span className="text-primary">U</span>
            <span className="text-primary">pply</span>
          </span>
          <div className="flex flex-col gap-[2px] ml-0.5 mt-1">
            <div className="w-1 h-1 rounded-full bg-accent" />
            <div className="w-1 h-1 rounded-full bg-accent" />
          </div>
        </Link>

        <p className="text-muted-foreground text-sm">
          Where talent meets opportunity through AI-driven job matching.
        </p>

        <p className="text-muted-foreground text-xs">
          A Graduation Project developed by Team Upply · Faculty of Computers & Artificial Intelligence © 2026
        </p>
      </div>
    </footer>
);

export default Footer;
