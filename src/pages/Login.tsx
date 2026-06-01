import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { AlertCircle } from "lucide-react";
import styled, { keyframes } from "styled-components";
import organizationService from "../features/org-connect/organization.service";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recruiterLoading, setRecruiterLoading] = useState(false);
  const [error, setError] = useState("");

  // ─── مشترك: Validation + استدعاء الـ login من AuthContext فقط ────────────────
  const attemptLogin = async (): Promise<boolean> => {
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    // login() من AuthContext هو اللي بيعمل الـ API call وبيحفظ الـ token
    // مفيش داعي ننادي loginUser مباشرة هنا خالص
    try {
      const ok = await login(email, password);
      if (!ok) {
        setError("Invalid email or password. Please try again.");
      }
      return ok;
   // ✅ بعد
} catch (err) {
  const error = err as { response?: { status?: number } };
  
  if (error.response?.status === 401) {
    setError("Invalid email or password. Please try again.");
  } else if (error.response?.status === 403) {
    setError("Account is disabled, please contact support.");
  } else if (!error.response) {
    setError("Network error. Please check your internet connection.");
  } else {
    setError("Something went wrong. Please try again later.");
  }
  return false;
}
  };

  // ─── زرار Sign In العادي ──────────────────────────────────────────────────
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await attemptLogin();
      if (ok) navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  // ─── زرار Sign In as a Recruiter ─────────────────────────────────────────
  const handleRecruiterLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setRecruiterLoading(true);
    try {
      const ok = await attemptLogin();
      if (!ok) return;

      // بعد ما الـ token اتحفظ من login()، دلوقتي آمن ننادي الـ org check
      const org = await organizationService.getMyOrganization();
      if (org) {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/settings");
      }
    } finally {
      setRecruiterLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <HeroSection>
        <div className="max-w-sm text-center mr-36">
          <h2 className="text-4xl tracking-tight">welcome back ..</h2>
          <p className="mt-4 text-purple-100/80">
            Sign in to your account and continue your career journey with us.
          </p>
        </div>
      </HeroSection>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <FormContainer>
          <div className="w-full max-w-sm">
            <PulsingTitle className="font-display text-2xl font-bold text-foreground">
              Sign In
            </PulsingTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>

            <form onSubmit={handleUserLogin} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <ErrorMessage>
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </ErrorMessage>
              )}

              {/* ─── زرار المستخدم العادي (type=submit يبعت الـ form) ─── */}
              <Button
                type="submit"
                className="w-full gradient-primary border-0"
                disabled={loading || recruiterLoading}
              >
                {loading ? "Signing in…" : "Sign In"}
              </Button>

              {/* ─── زرار الركروتر (type=button عشان ميبعتش الـ form) ─── */}
<Button
  type="button"
  variant="ghost"
  className="w-full h-11 gap-2 mt-5 rounded-xl font-semibold relative overflow-hidden
             border-2 border-primary/40 text-primary bg-transparent
             transition-all duration-300 group
             hover:border-transparent hover:text-white hover:bg-transparent
             hover:[background:var(--gradient-primary,linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary)/0.7)))]
             hover:shadow-[0_4px_20px_hsl(var(--primary)/0.35)] hover:-translate-y-0.5
             disabled:opacity-60 disabled:pointer-events-none"
  disabled={loading || recruiterLoading}
  onClick={handleRecruiterLogin}
>
  {/* تأثير اللمعة السحرية (Shimmer Effect) - يختفي أثناء التحميل لمنع التداخل البصري */}
  {!recruiterLoading && (
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent
                     -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
  )}

  {recruiterLoading ? (
    <>
      {/* أيقونة التحميل المتحركة متناسقة مع النص */}
      <svg className="animate-spin h-4 w-4 text-current relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="relative z-10">Checking…</span>
    </>
  ) : (
    <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-px">
      Sign In as a Recruiter
    </span>
  )}
</Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

// ─── Styled Components (بدون تغيير) ──────────────────────────────────────────

const PulsingTitle = styled.h1`
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
  &::before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: hsl(var(--primary));
  }
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
    from { transform: scale(0.9); opacity: 1; }
    to   { transform: scale(1.8); opacity: 0; }
  }
`;

const HeroSection = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: flex;
    flex: 1.2;
    background: #2D236A;
    clip-path: polygon(0 0, 100% 0, 65% 100%, 0% 100%);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    padding: 40px;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25%       { transform: translateX(-5px); }
  75%       { transform: translateX(5px); }
`;

const ErrorMessage = styled.div`
  background-color: #fff1f2;
  color: #e11d48;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 4px solid #e11d48;
  animation: ${shake} 0.5s cubic-bezier(.36,.07,.19,.97) both;
`;

export default Login;