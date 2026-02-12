import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Briefcase className="h-5 w-5" />
            Upply
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            AI-powered recruitment connecting the right talent with the right opportunity.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-display font-semibold text-foreground">Platform</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Get Started</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display font-semibold text-foreground">About</h4>
          <p className="text-sm text-muted-foreground">
            Upply is a graduation project built to showcase modern AI-powered recruitment solutions.
          </p>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 Upply. A graduation project — built with ❤️
      </div>
    </div>
  </footer>
);

export default Footer;
