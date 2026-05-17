import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle, Circle, CheckCircle2 } from "lucide-react";
import styled, { keyframes } from "styled-components";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[@$!%*?&#^_]/.test(password) },
    { label: "Passwords match", met: password === confirm && confirm !== "" },
  ];

  const isValid = requirements.every((r) => r.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await resetPassword(token, password);
      navigate("/login?reset=success");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Reset failed. The link may have expired.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-destructive font-medium">
            Invalid reset link. Please request a new one.
          </p>
          <Link to="/forgot-password" className="mt-4 inline-block text-primary hover:underline">
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <HeroSection className="hidden lg:flex">
        <div className="max-w-sm text-center mr-36">
          <h2 className="text-4xl tracking-tight">Set new password</h2>
          <p className="mt-4 text-purple-100/80">
            Choose a strong password to secure your account.
          </p>
        </div>
      </HeroSection>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <FormContainer>
          <div className="w-full max-w-sm">
            <PulsingTitle className="font-display text-2xl font-bold text-foreground">
              New Password
            </PulsingTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter and confirm your new password below
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
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
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="mt-1"
                />
              </div>

              {/* Requirements checklist */}
              <div
                className={`grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/30 border border-border transition-all duration-500 overflow-hidden ${
                  password.length > 0 ? "max-h-60 opacity-100" : "max-h-0 opacity-0 border-none"
                }`}
              >
                {requirements.map((req, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-[11px] font-medium transition-colors duration-300 ${
                      req.met
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground opacity-70"
                    }`}
                  >
                    {req.met ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-muted-foreground/40" />
                    )}
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>

              {error && (
                <ErrorMessage>
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </ErrorMessage>
              )}

              <Button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full transition-all ${
                  !isValid ? "opacity-50 cursor-not-allowed bg-gray-400" : "gradient-primary"
                }`}
              >
                {loading ? "Saving..." : "Set New Password"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-medium text-primary hover:underline">
                Back to Sign In
              </Link>
            </p>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};
 const FormContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* ظل خفيف للفورم */
  border: 1px solid rgba(0, 0, 0, 0.1); /* حدود خفيفة للفورم */
  background-color: white; /* أو لون خلفية الفورم */
`;

const HeroSection = styled.div`
  /* العرض والظهور */
  display: none; /* مخفي افتراضياً في الموبايل */
  
  @media (min-width: 1024px) {
  
    display: flex;
    flex: 1.2; /* بياخد مساحة أكبر شوية من الفورم */
  background: #2D236A;
    clip-path: polygon(0 0, 100% 0, 65% 100%, 0% 100%);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    padding: 40px;


  }

`;


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

// Add this SuccessMessage to both files that need it
const SuccessMessage = styled.div`
  background-color: #f0fdf4;
  color: #16a34a;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border-left: 4px solid #16a34a;
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
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

export default ResetPassword;