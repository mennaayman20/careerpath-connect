import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerificationPending from "./pages/VerificationPending";
import EmailVerified from "./pages/EmailVerified";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Jobs from "./pages/Jobs";
import MatchedJobs from "./pages/MatchedJobs";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ActivateAccount from "./pages/ActivateAccount";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import RecruiterDashboard from "./features/Recruiter/RecruiterDashboard";
// import { OrganizationProfile } from "./features/Recruiter/OrgProfile/Orgprofilepage";
// import { OrgCreatePage } from "./features/Recruiter/OrgProfile/OrgCreatePage";
import { RecruiterJobsPage } from "./features/Recruiter/jobPosts/RecruiterJobsPage";

import VerifyOrganization from "@/pages/VerifyOrganization";

import { JobsPage } from "@/features/Recruiter/MangeJobs/components/jobs/JobsPage";
import VerifyOrgPage from "./features/org-connect/VerifyOrgPage";
import OrganizationProfilePage from "./pages/Orgprofilepage";
// import { OrgProfileCard } from "./features/Recruiter/OrgProfile/Orgprofilecard";
import { ApplicationsPage } from "./features/Recruiter/MangeJobs/components/jobs/ApplicationsPage";
import { RecruiterChatPage } from "./features/Recruiter/recruiter-chat/components/RecruiterChatPage";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      // staleTime: 1000 * 60 * 10, // 10 دقائق لكل المشروع
      refetchOnWindowFocus: false, // هيمنع إنه يعمل Fetch لما تدوسي على الصفحة بعد ما كنتِ في Tab تانية
    },
  },
});



const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verification-pending" element={<VerificationPending />} />
            
            <Route path="/email-verified" element={<EmailVerified />} />

            <Route path="/activate" element={<ActivateAccount />} />
            
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/matched-jobs" element={<ProtectedRoute><MatchedJobs /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

<Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />

<Route path="/recruiter/OrganizationProfile" element={<OrganizationProfilePage />} />

<Route path="/organizations/connect/verify" element={<VerifyOrganization />} />

{/* <Route path="/organizations/connect/verify" element={<VerifyOrgPage />} /> */}




      {/* صفحة إنشاء المنظمة - متاحة فقط للموظفين اللي لسه معندهمش شركة */}
    {/* <Route path="/organization/create"  element={<OrgCreatePage />} />  */}
     



<Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
  <Route path="/recruiter/jobs/:jobId/applications" element={<ApplicationsPage />} />
<Route path="/recruiter/jobs/:jobId/chat" element={<RecruiterChatPage />} />

<Route path="/recruiter/manageJobs" element={<JobsPage />} />

            
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/resume-analysis" element={<ProtectedRoute><ResumeAnalysis /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);




export default App;
