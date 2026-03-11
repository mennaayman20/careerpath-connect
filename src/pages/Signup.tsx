import axios from "axios";
import { useState } from "react";
import { registerUser } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import styled from "styled-components";
const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<{ name: string; email: string; password: string; confirm: string }>({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const [firstName, ...rest] = form.name.trim().split(" ");
      const lastName = rest.join(" ");
      const res = await registerUser({
        firstName: firstName || "",
        lastName: lastName || "",
        email: form.email,
        password: form.password,
      });
      if (res.status === 200 || res.status === 201) {
        toast({
          title: "Account created!",
          description: "Check your email to activate your account.",
        });
        navigate("/verification-pending");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: unknown) {
     if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
     } finally {
      setLoading(false);
    }
  };

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 items-center justify-center gradient-hero lg:flex">
        <div className="max-w-sm text-center text-primary-foreground">
          <Briefcase className="mx-auto mb-4 h-12 w-12" />
          <h2 className="font-display text-3xl font-bold">Join Upply</h2>
          <p className="mt-3 text-primary-foreground/80">Create your account and start your journey with AI-powered recruitment.</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold text-primary lg:hidden">
            <Briefcase className="h-6 w-6" /> Upply
          </Link>
          {/* 2. استبدال الـ h1 العادي بـ PulsingTitle */}
          <PulsingTitle className="font-display text-2xl font-bold text-foreground">
            Create Account
          </PulsingTitle>
          <p className="mt-1 text-sm text-muted-foreground">Fill in your details to get started</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Doe" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPw ? "text" : "password"} required value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min. 6 characters" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" required value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="Re-enter password" className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
              {loading ? "Creating account…" : "Sign Up"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};






const PulsingTitle = styled.h1`
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px; /* مسافة للنقطة */

  /* النقطة الثابتة */
  &::before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    /* استخدمت لون الـ primary بتاعك (أزرق) */
    background-color: hsl(var(--primary)); 
  }

  /* النقطة اللي بتنبض */
  &::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: hsl(var(--primary));
    animation: pulse 1s linear infinite;
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;

export default Signup;
