import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Briefcase, Menu, X, LogOut, User, Settings } from "lucide-react";
import '../styles/logo.css'
import React from 'react';
import myLogo from '../assets/Copy_of_Green_Modern_Marketing_Logo__2_-removebg-preview.svg'; // اتأكد إن المسار صح حسب مكان الملف
import darkLogo from '../assets/Copy_of_Green_Modern_Marketing_Logo-removebg-preview.svg'; // استبدل بالمسار الصحيح لشعار الدارك مود
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// const Navbar = () => {
//   const { isAuthenticated, user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [mobileOpen, setMobileOpen] = useState(false);
//  const [isDark, setIsDark] = useState(false);
//   return (
//     <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
//       <div className="container flex h-16 items-center justify-between">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-8">
//           {/* صورة اللايت مود */}
//       <img src={myLogo} className="logo logo-light" alt="Light Logo" />
      
//       {/* صورة الدارك مود */}
//       <img src={darkLogo} className="logo logo-dark" alt="Dark Logo" />
//         </Link>

//         {/* Desktop */}
//         <div className="hidden items-center gap-2 md:flex">
//           <Button variant="ghost" asChild>
//             <Link to="/jobs">Jobs</Link>
//           </Button>
//           {isAuthenticated ? (
//             <>
//               <Button variant="ghost" asChild>
//                 <Link to="/matched-jobs">AI Match</Link>
//               </Button>
//               <Button variant="ghost" asChild>
//                 <Link to="/applications">My Applications</Link>
//               </Button>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="icon" className="rounded-full">
//                     <User className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-48">
//                   <div className="px-3 py-2">
//                     <p className="text-sm font-medium">{user?.name}</p>
//                     <p className="text-xs text-muted-foreground">{user?.email}</p>
//                   </div>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={() => navigate("/profile")}>
//                     <User className="mr-2 h-4 w-4" /> Profile
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => navigate("/settings")}>
//                     <Settings className="mr-2 h-4 w-4" /> Settings
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={logout}>
//                     <LogOut className="mr-2 h-4 w-4" /> Logout
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </>
//           ) : (
//             <Button asChild className="gradient-primary border-0">
//               <Link to="/login">Get Started</Link>
//             </Button>
//           )}
//         </div>

//         {/* Mobile toggle */}
//         <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
//           {mobileOpen ? <X /> : <Menu />}
//         </Button>
//       </div>

//       {/* Mobile menu */}
//       {mobileOpen && (
//         <div className="border-t border-border bg-card p-4 md:hidden">
//           <div className="flex flex-col gap-2">
//             <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileOpen(false)}>
//               <Link to="/jobs">Jobs</Link>
//             </Button>
//             {isAuthenticated ? (
//               <>
//                 <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileOpen(false)}>
//                   <Link to="/matched-jobs">AI Match</Link>
//                 </Button>
//                 <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileOpen(false)}>
//                   <Link to="/applications">My Applications</Link>
//                 </Button>
//                 <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileOpen(false)}>
//                   <Link to="/profile">Profile</Link>
//                 </Button>
//                 <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileOpen(false)}>
//                   <Link to="/settings">Settings</Link>
//                 </Button>
//                 <Button variant="ghost" className="justify-start text-destructive" onClick={() => { logout(); setMobileOpen(false); }}>
//                   Logout
//                 </Button>
//               </>
//             ) : (
//               <Button asChild className="gradient-primary border-0" onClick={() => setMobileOpen(false)}>
//                 <Link to="/login">Get Started</Link>
//               </Button>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-8">
          <img src={myLogo} className="logo logo-light" alt="Light Logo" />
          <img src={darkLogo} className="logo logo-dark" alt="Dark Logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-2 md:flex">
          {/* 1. دا بيظهر للكل (مسجل أو لا) */}
          <Button variant="ghost" asChild>
            <Link to="/jobs">Jobs</Link>
          </Button>

          {isAuthenticated ? (
            /* 2. الحاجات دي بتظهر بس لو مسجل دخول */
            <>
              <Button variant="ghost" asChild>
                <Link to="/matched-jobs">AI Match</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/applications">My Applications</Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* 3. لو مش مسجل، يظهر Get Started بس بجانب الـ Jobs */
            <Button asChild className="gradient-primary border-0 shadow-lg shadow-primary/20">
              <Link to="/login">Get Started</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {/* دايماً ظاهر */}
            <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileOpen(false)}>
              <Link to="/jobs">Jobs</Link>
            </Button>

            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileOpen(false)}>
                  <Link to="/matched-jobs">AI Match</Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileOpen(false)}>
                  <Link to="/applications">My Applications</Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileOpen(false)}>
                  <Link to="/profile">Profile</Link>
                </Button>
                <Button variant="ghost" className="justify-start text-destructive" onClick={() => { logout(); setMobileOpen(false); }}>
                  Logout
                </Button>
              </>
            ) : (
              /* يظهر فقط لو مش مسجل دخول في الموبايل */
              <Button asChild className="gradient-primary border-0 w-full mt-2" onClick={() => setMobileOpen(false)}>
                <Link to="/login">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
