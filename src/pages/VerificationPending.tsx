import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

const VerificationPending = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="max-w-md text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MailCheck className="h-8 w-8" />
      </div>
      <h1 className="font-display text-2xl font-bold text-foreground">Verification Email Sent</h1>
      <p className="mt-3 text-muted-foreground">
        We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
      </p>
      <Button asChild className="mt-6 gradient-primary border-0">
        <Link to="/login">Back to Login</Link>
      </Button>
    </div>
  </div>
);

export default VerificationPending;
