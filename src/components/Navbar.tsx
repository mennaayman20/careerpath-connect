import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // قمنا بتغيير Link إلى NavLink للتحكم في الـ Active State
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Briefcase, Sparkles, FileText, Building2 } from "lucide-react";
import '../styles/logo.css'
import React from 'react';
import myLogo from '../assets/Copy_of_Green_Modern_Marketing_Logo__2_-removebg-preview.svg'; 
import darkLogo from '../assets/Copy_of_Green_Modern_Marketing_Logo-removebg-preview.svg'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-white/40 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-8 hover:scale-102 active:scale-98 transition-all duration-200">
          <img src={myLogo} className="logo logo-light" alt="Light Logo" />
          <img src={darkLogo} className="logo logo-dark" alt="Dark Logo" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-2 md:flex">
          
          {/* Jobs Button */}
          <NavLink to="/jobs" className="no-underline">
            {({ isActive }) => (
              <Button 
                variant="ghost" 
                className={`text-sm font-medium rounded-full px-4 transition-all duration-200 hover:scale-105 active:scale-95 group flex items-center gap-1.5
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-md scale-105" 
                    : "text-gray-800 hover:text-primary-foreground hover:bg-primary"
                  }`}
              >
                <Briefcase className={`h-4 w-4 transition-colors duration-200 
                  ${isActive ? "text-primary-foreground" : "text-primary group-hover:text-white"}`} 
                />
                Jobs
              </Button>
            )}
          </NavLink>

          {isAuthenticated ? (
            <>
              {/* AI Match Button */}
              <NavLink to="/matched-jobs" className="no-underline">
                {({ isActive }) => (
                  <Button 
                    variant="ghost" 
                    className={`text-sm font-medium rounded-full px-4 transition-all duration-200 hover:scale-105 active:scale-95 group flex items-center gap-1.5
                      ${isActive 
                        ? "bg-primary text-primary-foreground shadow-md scale-105" 
                        : "text-gray-800 hover:text-primary-foreground hover:bg-primary"
                      }`}
                  >
                    <Sparkles 
  className={`h-4 w-4 transition-colors duration-200 
    ${isActive ? "text-primary-foreground" : "text-primary group-hover:text-primary-foreground"}`} 
  style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} // السحر هنا!
/>
                    AI Match
                  </Button>
                )}
              </NavLink>

              {/* My Applications Button */}
              <NavLink to="/applications" className="no-underline">
                {({ isActive }) => (
                  <Button 
                    variant="ghost" 
                    className={`text-sm font-medium rounded-full px-4 transition-all duration-200 hover:scale-105 active:scale-95 group flex items-center gap-1.5
                      ${isActive 
                        ? "bg-primary text-primary-foreground shadow-md scale-105" 
                        : "text-gray-800 hover:text-primary-foreground hover:bg-primary"
                      }`}
                  >
                    <FileText className={`h-4 w-4 transition-colors duration-200 
                      ${isActive ? "text-primary-foreground" : "text-primary group-hover:text-white"}`} 
                    />
                    My Applications
                  </Button>
                )}
              </NavLink>

              {/* خط فاصل عمودي باهت وأنيق */}
              <div className="h-5 w-[1px] bg-gray-500 mx-1" />
              
              {/* For Employers Button */}
              <NavLink to="/settings" className="no-underline">
                {({ isActive }) => (
                  <Button 
                    variant="outline" 
                    className={`text-sm font-medium rounded-full px-4 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5
                      ${isActive 
                        ? "bg-primary text-primary-foreground border-primary scale-105" 
                        : "border-primary/40 text-primary bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      }`}
                  >
                    <Building2 className="h-4 w-4" />
                    For Employers
                  </Button>
                )}
              </NavLink>

              {/* User Dropdown Profile */}
              <div className="ml-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:scale-105 active:scale-95 group flex items-center justify-center p-0"
                    >
                      <User className="h-4 w-4 text-gray-600 transition-colors duration-200 group-hover:text-primary-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl p-1.5 border border-border/60 shadow-xl bg-popover/95 backdrop-blur-md">
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-semibold text-foreground leading-none">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate leading-none mt-1">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator className="my-1.5" />
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer rounded-lg gap-2 text-muted-foreground hover:text-primary-foreground hover:bg-primary transition-all duration-150">
                      <User className="h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1.5" />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-lg gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-150">
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            /* Get Started Button */
            <NavLink to="/login" className="no-underline">
              <Button className="gradient-primary border-0 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 hover:scale-105 active:scale-95 rounded-full px-5 ml-1">
                Get Started
              </Button>
            </NavLink>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-md px-4 py-4 md:hidden animate-in fade-in-50 slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-1.5">
            
            <NavLink to="/jobs" className="no-underline" onClick={() => setMobileOpen(false)}>
              {({ isActive }) => (
                <Button variant="ghost" className={`justify-start rounded-xl py-2.5 w-full flex items-center gap-2 transition-all ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/10"}`}>
                  <Briefcase className="h-4 w-4" /> Jobs
                </Button>
              )}
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/matched-jobs" className="no-underline" onClick={() => setMobileOpen(false)}>
                  {({ isActive }) => (
                    <Button variant="ghost" className={`justify-start rounded-xl py-2.5 w-full flex items-center gap-2 transition-all ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/10"}`}>
                      <Sparkles className="h-4 w-4" /> AI Match
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/applications" className="no-underline" onClick={() => setMobileOpen(false)}>
                  {({ isActive }) => (
                    <Button variant="ghost" className={`justify-start rounded-xl py-2.5 w-full flex items-center gap-2 transition-all ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/10"}`}>
                      <FileText className="h-4 w-4" /> My Applications
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/settings" className="no-underline" onClick={() => setMobileOpen(false)}>
                  {({ isActive }) => (
                    <Button variant="ghost" className={`justify-start rounded-xl py-2.5 w-full flex items-center gap-2 transition-all ${isActive ? "bg-primary text-primary-foreground" : "text-primary bg-primary/5 hover:bg-primary/10"}`}>
                      <Building2 className="h-4 w-4" /> For Employers
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/profile" className="no-underline" onClick={() => setMobileOpen(false)}>
                  {({ isActive }) => (
                    <Button variant="ghost" className={`justify-start rounded-xl py-2.5 w-full flex items-center gap-2 transition-all ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/10"}`}>
                      <User className="h-4 w-4" /> Profile
                    </Button>
                  )}
                </NavLink>
                
                <div className="h-[1px] bg-border/60 my-1" />
                <Button variant="ghost" className="justify-start rounded-xl py-2.5 text-destructive hover:bg-destructive/10 transition-all" onClick={() => { logout(); setMobileOpen(false); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <NavLink to="/login" className="no-underline" onClick={() => setMobileOpen(false)}>
                <Button className="gradient-primary border-0 w-full mt-2 rounded-xl py-2.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Get Started
                </Button>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;