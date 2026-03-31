
import { loginUser, registerUser } from "@/services/authService";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface User {
  name: string;
  email: string;
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
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // بنحط بيانات أولية عشان الـ Routes متوقعش
      // يفضل لو مخزن بيانات اليوزر كـ JSON في LocalStorage تقرأها هنا
      return { name: "User", email: "" }; 
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await loginUser({ email, password }); 
      if (data.token) {
        // تأكد أن loginUser هي اللي بتعمل localStorage.setItem("token", data.token)
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

  useEffect(() => {
  const syncLogout = () => {
    const token = localStorage.getItem("token");
    // لو التوكن اتمسح (من الـ Interceptor مثلاً) واليوزر لسه متسجل في الـ State
    if (!token && user) {
      setUser(null); // فضي بيانات اليوزر فوراً
    }
  };

  // المراقبة دي بتخلي الـ App يحس بالـ Logout حتى لو اليوزر فاتح كذا Tab
  window.addEventListener("storage", syncLogout);

  return () => window.removeEventListener("storage", syncLogout);
}, [user]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
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




