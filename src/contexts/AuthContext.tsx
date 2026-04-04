
import { loginUser, registerUser } from "@/services/authService";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode"
interface User {
  name: string;
  email: string;
}

interface JWTPayload {
    fullName?: string;
    sub?: string;
    exp?: number;
    iat?: number;
  }

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // أضفنا دي للأمان زيادة
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. الحل الجذري: Initializer function داخل useState
  // دي بتشتغل "مرة واحدة" فقط أول ما الأبلكيشن يفتح وقبل أول ريندر

const getUserFromToken = (token: string | null): User | null => {
    if (!token) return null;
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      
      // ✅ زود السطرين دول بس
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        localStorage.removeItem("token"); // امسح التوكن المنتهي
        return null;
      }

      return { 
        name: decoded.fullName || "User", 
        email: decoded.sub || "" 
      };
    } catch {
      return null;
    }
  };






  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // بنحط بيانات أولية عشان الـ Routes متوقعش
      // يفضل لو مخزن بيانات اليوزر كـ JSON في LocalStorage تقرأها هنا
      return getUserFromToken(token);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      const currentUser = getUserFromToken(token);
      
      // تحديث الحالة بناءً على اللي موجود في الـ Storage فعلياً
      setUser(currentUser); 
    };

    // بيسمع للـ Interceptor وللـ Tabs التانية
    window.addEventListener("storage", syncAuth);
    
    return () => window.removeEventListener("storage", syncAuth);
  }, []);


  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await loginUser({ email, password }); 
      if (data.token) {
        // فكي التوكن الجديد وسيفيه في الـ state
        setUser(getUserFromToken(data.token));
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
      const [firstName, ...rest] = name.trim().split(" ");
      const lastName = rest.join(" ");
      await registerUser({ firstName, lastName, email, password });
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  }, []);

  // 2. الـ useEffect هنا للتأكد فقط (Sync check)
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token && user) {
  //     setUser(null);
  //   }
  //   // هنا ممكن مستقبلاً تنادي API تجيب بيانات البروفايل الحقيقية وتحدث الـ user
  // }, [user]);



  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    // لو عايزة الصفحة تعمل Reload كامل عشان تنضف الـ Cache
    window.location.href = "/login";
  }, []);
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        signup, 
        logout, 
        isDarkMode, 
        toggleDarkMode 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};




