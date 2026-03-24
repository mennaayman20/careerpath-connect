import axios from "axios";
import { useState } from "react";
import { registerUser } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Eye, EyeOff , Circle , CheckCircle2 } from "lucide-react";


import styled from "styled-components";
const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<{ name: string; email: string; password: string; confirm: string }>({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ضيفي دي جوه الكومبوننت قبل الـ handleSubmit
const passwordRequirements = [
  { label: "At least 9 characters", met: form.password.length >= 9 },
  { label: " At Least One uppercase letter (A-Z)", met: /[A-Z]/.test(form.password) },
  { label: "Contains a number", met: /\d/.test(form.password) },
  { label: "Contains special character", met: /[@$!%*?&]/.test(form.password) },
  { label: "Passwords match", met: form.password === form.confirm && form.confirm !== "" },
];




  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // setError("");
    // if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    // if (form.password.length < 9) { setError("Password must be at least 9 characters"); return; }

    e.preventDefault();

  // 🛑 المنع البات: لو الفورم مش Valid اخرج فوراً ومتكملش للـ API
  if (!isFormValid) {
    setError("Please fulfill all requirements first.");
    return; // السطر ده هو اللي بيمنع الـ registerUser إنها تشتغل
  }

  setLoading(true);
  setError("");


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
const isFormValid = passwordRequirements.every(req => req.met) && form.email.includes('@') && form.name.trim() !== "";
  return (

    
    <div className="flex min-h-screen">
    

      <HeroSection className="hidden lg:flex">


        <div className="max-w-sm text-center mr-36">

                    <div className="card">
  <div className="loader ">
    <p>APPLY</p>
    <div className="words">
      <span className="word">NOW</span>
      <span className="word">Quickly</span>
      <span className="word">Smartly</span>
      <span className="word">Better</span>
      <span className="word">Easily</span>
    </div>
  </div>
</div>




          {/* <Briefcase className="mx-auto mb-6 h-16 w-16" />
          <h2 className="text-4xl font-bold tracking-tight">Join Upply</h2>
          <p className="mt-4 text-lg text-purple-100/80">
            Create your account and start your journey with AI-powered recruitment.
          </p> */}
        </div>


      </HeroSection>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        
        <FormContainer>
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold text-primary lg:hidden">
            
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

<div 
  className={`grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/30 border border-border transition-all duration-500 overflow-hidden ${
    form.password.length > 0 ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0 border-none"
  }`}
>
  {passwordRequirements.map((req, index) => (
    <div
      key={index}
      className={`flex items-center gap-2 text-[11px] font-medium transition-colors duration-300 ${
        req.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground opacity-70"
      }`}
    >
      {req.met ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 animate-in zoom-in duration-300" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-muted-foreground/40" />
      )}
      <span>{req.label}</span>
    </div>
  ))}
</div>



            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button 
  type="submit" 
  disabled={!isFormValid || loading} // 🔒 هيمنع الكليك برمجياً
  className={`w-full transition-all ${
    !isFormValid ? "opacity-50 cursor-not-allowed bg-gray-400" : "gradient-primary"
  }`}
>
  {loading ? "Creating account..." : "Sign Up"}
</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link>
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




export default Signup;
