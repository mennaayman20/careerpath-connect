import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const EmailVerified = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="max-w-md text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle className="h-8 w-8" />
      </div>
      <h1 className="font-display text-2xl font-bold text-foreground">Email Verified!</h1>
      <p className="mt-3 text-muted-foreground">
        Your email has been successfully verified. You can now sign in and start exploring opportunities.
      </p>
      <Button asChild className="mt-6 gradient-primary border-0">
        <Link to="/login">Sign In</Link>
      </Button>
    </div>
  </div>
);

export default EmailVerified;
