import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import styled, { keyframes } from "styled-components";
import axios from "axios";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <HeroSection className="hidden lg:flex">
        <div className="max-w-sm text-center mr-36">
          <h2 className="text-3xl tracking-tight">Forgot your password?</h2>
          <p className="mt-4 text-purple-100/80">
            No worries — we'll send you a reset link right away.
          </p>
        </div>
      </HeroSection>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <FormContainer>
          <div className="w-full max-w-sm">
            <PulsingTitle className="font-display text-2xl font-bold text-foreground">
              Reset Password
            </PulsingTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email and we'll send you a reset link
            </p>

            {success ? (
              <SuccessMessage>
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Check your inbox!</p>
                  <p className="text-sm opacity-80">
                    We sent a reset link to <strong>{email}</strong>
                  </p>
                </div>
              </SuccessMessage>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
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

                {error && (
                  <ErrorMessage>
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </ErrorMessage>
                )}

                <Button
                  type="submit"
                  className="w-full gradient-primary border-0"
                  disabled={loading || !email.includes("@")}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remembered it?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign In
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
export default ForgotPassword;



// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Briefcase, ArrowLeft } from "lucide-react";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [sent, setSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setTimeout(() => { setSent(true); setLoading(false); }, 800);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background px-4">
//       <div className="w-full max-w-sm">
//         <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold text-primary">
//           <Briefcase className="h-6 w-6" /> Upply
//         </Link>
//         {sent ? (
//           <div className="text-center">
//             <h1 className="font-display text-2xl font-bold text-foreground">Check Your Email</h1>
//             <p className="mt-3 text-sm text-muted-foreground">We've sent password reset instructions to <strong>{email}</strong>.</p>
//             <Button asChild variant="ghost" className="mt-6">
//               <Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Login</Link>
//             </Button>
//           </div>
//         ) : (
//           <>
//             <h1 className="font-display text-2xl font-bold text-foreground">Forgot Password</h1>
//             <p className="mt-1 text-sm text-muted-foreground">Enter your email to receive a reset link</p>
//             <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1" />
//               </div>
//               <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
//                 {loading ? "Sending…" : "Send Reset Link"}
//               </Button>
//             </form>
//             <div className="mt-4 text-center">
//               <Link to="/login" className="text-sm text-primary hover:underline">
//                 <ArrowLeft className="mr-1 inline h-3 w-3" /> Back to Login
//               </Link>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
