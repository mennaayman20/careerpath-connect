import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import myLogo from '../assets/Copy_of_Green_Modern_Marketing_Logo__2_-removebg-preview.svg'; // اتأكد إن المسار صح حسب مكان الملف

const Footer = () => (
  <footer className="py-12 border-t border-border/50 bg-[#e9e9e9]">
      <div className="container mx-auto px-6 text-center space-y-2">
        {/* Logo */}
       
          <span className="text-2xl tracking-tight ">
             <Link to="/" className="inline-flex items-center gap-3">
          <img src={myLogo} className="logo logo-light" alt="Light Logo" />
           
          
        </Link>
          </span>
        
       

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
