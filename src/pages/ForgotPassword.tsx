import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSent(true); setLoading(false); }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold text-primary">
          <Briefcase className="h-6 w-6" /> Upply
        </Link>
        {sent ? (
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Check Your Email</h1>
            <p className="mt-3 text-sm text-muted-foreground">We've sent password reset instructions to <strong>{email}</strong>.</p>
            <Button asChild variant="ghost" className="mt-6">
              <Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Login</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold text-foreground">Forgot Password</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter your email to receive a reset link</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1" />
              </div>
              <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
                {loading ? "Sending…" : "Send Reset Link"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-primary hover:underline">
                <ArrowLeft className="mr-1 inline h-3 w-3" /> Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
