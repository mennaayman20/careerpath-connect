import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/services/authService";
import myLogo from '../assets/Copy_of_Green_Modern_Marketing_Logo__2_-removebg-preview.svg';

import styled from "styled-components";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await loginUser({ email, password }); 
      if (ok) {
        login(email, password);
        navigate("/jobs");
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <HeroSection className="hidden lg:flex">
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
          <Link to="/" className="flex items-center font-display text-xl font-bold text-primary">
            <img src={myLogo} className="ml-28 logo logo-light" alt="Light Logo" />
           
          </Link>
          {/* 2. استبدال الـ h1 العادي بـ PulsingTitle */}
          <PulsingTitle className="font-display text-2xl font-bold text-foreground">
            Sign In
          </PulsingTitle>
          <p className="mt-1 text-sm text-muted-foreground">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full gradient-primary border-0" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
</FormContainer>

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

export default Login;
