import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Settings as SettingsIcon, Moon, Building2, Mail, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useNavigate } from "react-router-dom";
const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useAuth();
  const { toast } = useToast();
  const [businessEmail, setBusinessEmail] = useState("");
  const [recruiterSent, setRecruiterSent] = useState(false);
const navigate = useNavigate();
  const handleRecruiterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessEmail.trim()) {
      setRecruiterSent(true);
      toast({ title: "Verification Link Sent", description: "Check your business email to verify." });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container max-w-2xl flex-1 py-8">
        <div className="mb-8 flex items-center gap-3">
          <SettingsIcon className="h-7 w-7 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        </div>

        {/* Dark Mode */}
        {/* <section className="mb-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-display font-semibold text-foreground">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </section> */}

        {/* Become Recruiter */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-display font-semibold text-foreground">Become a Recruiter</h3>
              <p className="text-sm text-muted-foreground">Enter your business email to get verified</p>
            </div>
          </div>

          {recruiterSent ? (
            <div className="rounded-lg bg-success/10 p-4 text-center">
              <Mail className="mx-auto mb-2 h-8 w-8 text-success" />
              <p className="font-medium text-foreground">Verification link sent!</p>
              <p className="text-sm text-muted-foreground">Check <strong>{businessEmail}</strong> to complete verification.</p>





              <Button 
                onClick={() => navigate("/recruiter-dashboard")}
                variant="outline"
                className="gap-2"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>


            </div>
          ) : (
            <form onSubmit={handleRecruiterSubmit} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="biz-email">Business Email</Label>
                <Input id="biz-email" type="email" required value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="name@company.com" className="mt-1" />
              </div>
              <Button type="submit" className="mt-6 gradient-primary border-0">Verify</Button>
            </form>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
