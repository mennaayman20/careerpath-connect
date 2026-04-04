import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/services/authService";
import myLogo from '../assets/Copy_of_Green_Modern_Marketing_Logo__2_-removebg-preview.svg';

import styled, { keyframes } from "styled-components";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

const [error, setError] = useState(""); // لتخزين رسالة الخطأ

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    // setError("");
  
    // if (password.length < 9) {
    //   setError("Password must be at least 9 characters.");
    //   return;
    // }

    setLoading(true);

    // try {
    //   const ok = await loginUser({ email, password }); 
      
    //   // لو الـ API رجع نجاح (Success)
    //   if (ok) {
    //     login(email, password);
    //     navigate("/jobs");
    //   } else {
    //     // دي احتياطي لو الـ API رجع false من غير ما يرمي Error (ثقافة قديمة شوية)
    //     setError("Invalid email or password. Please try again.");
    //   }

    // } catch (err) {

    //   console.error("Login failed:", err);

    //   // الفحص الذكي للـ Error اللي جاي من السيرفر (Axios/Fetch Error)
    //   if (err.response?.status === 401) {
    //     // كود 401 يعني الـ Credentials (إيميل أو باسورد) غلط
    //     setError("Invalid email or password. Please try again.");
    //   } 
    //   else if (err.response?.status === 403) {
    //     // كود 403 يعني ملوش صلاحية يدخل (الحساب معطل مثلاً)
    //     setError("Account is disabled, please contact support.");
    //   } 
    //   else if (!err.response) {
    //     // لو الـ response مش موجود أصلاً، يبقى غالباً مفيش إنترنت أو السيرفر واقع
    //     setError("Network error. Please check your internet connection.");
    //   } 
    //   else {
    //     // أي خطأ تاني غير متوقع (زي 500 مثلاً)
    //     setError("Something went wrong. Please try again later.");
    //   }

    // } finally {
    //   // لازم نقفل الـ loading في كل الحالات
    //   setLoading(false);
    // }

    try {
    const ok = await loginUser({ email, password }); 
    
    if (ok) {
      login(email, password);
      navigate("/jobs");
    } 
    // مفيش else تظهر أخطاء
  } catch (err) {
    console.error("Login failed:", err);
    // مفيش أي setError هنا، الفشل هيعدي في صمت
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
            {/* <img src={myLogo} className="ml-28 logo logo-light" alt="Light Logo" /> */}
           
          </Link>
          {/* 2. استبدال الـ h1 العادي بـ PulsingTitle */}
          <PulsingTitle className="font-display text-2xl font-bold text-foreground">
            Sign In
          </PulsingTitle>
          <p className="mt-1 text-sm text-muted-foreground">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
              id="email" 
              type="email" 
              required 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                if(error) setError(""); // تختفي وأنا بكتب
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
                  if(error) setError(""); // تختفي وأنا بكتب
                }} 
                placeholder="••••••••" 
              />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>

{error && (
  <ErrorMessage>
    <AlertCircle className="h-4 w-4" /> 
    <span>{error}</span>
  </ErrorMessage>
)}



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
  
  /* الاهتزاز بيشتغل مرة واحدة أول ما يظهر */
  animation: ${shake} 0.5s cubic-bezier(.36,.07,.19,.97) both;
`;



export default Login;
