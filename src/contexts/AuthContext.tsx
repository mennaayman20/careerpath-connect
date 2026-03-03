import { loginUser, registerUser } from "@/services/authService";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  
 const login = useCallback(async (email: string, password: string) => {
  try {
    // 1. نكلم الباك اند فعلياً باستخدام الـ Service
    // الـ loginUser هي اللي بتبعت POST لـ /auth/login
    const data = await loginUser({ email, password }); 

    // 2. الباك اند بيرجع توكن
    // والـ loginUser service اللي كتبناها قبل كدة المفروض بتسيفه في localStorage
    if (data.token) {
      // 3. نحدث حالة اليوزر ببيانات حقيقية (ممكن تفك التوكن أو تاخد البيانات لو راجعة)
      setUser({ email: email, name: "User" }); 
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
}, []);

const signup = useCallback(async (name: string, email: string, password: string) => {
  try {
    // 1. تنادي الـ Service اللي بيكلم /auth/register
    // الـ registerUser دي المفروض موجودة عندك في الـ authService
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ");
    await registerUser({ firstName, lastName, email, password });

    // 2. في حالة النجاح، الباك اند غالباً مش بيديك توكن فوراً (بيبعت إيميل تفعيل أولاً)
    // فإحنا مش هنحدث الـ User state هنا، هنستنى لما يفعل ويدخل Login
    return true;
  } catch (error) {
    console.error("Signup failed:", error);
    return false;
  }
}, []);

  // 1. إضافة useEffect عشان الـ Login ميروحش مع الـ Refresh
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    // هنا ممكن نكلم API تجيب بيانات اليوزر (Me/Profile) 
    // أو مبدئياً نعتبره موجود طالما التوكن موجود
    setUser({ name: "User", email: "" }); 
  }
}, []);

// 2. تعديل الـ logout عشان يمسح التوكن
const logout = useCallback(() => {
  localStorage.removeItem("token"); // امسح الباسبور
  setUser(null); // فضي الـ state
  window.location.href = "/login"; // يفضل توجيهه للـ login فوراً
}, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, isDarkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
