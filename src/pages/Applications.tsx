import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // عشان الـ Matching Ratio
// 1. استيراد الـ Hook الجديد والنوع
import { useMyApplications } from "@/features/submitedApplication/useSubmitted";
import { Application } from "@/features/submitedApplication/submitedInterface";

// 2. تحديث الألوان لتناسب الحالات الحقيقية من الـ Swagger
const statusColor: Record<string, string> = {
  SUBMITTED: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  SHORTLISTED: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  REJECTED: "bg-red-100 text-red-700 hover:bg-red-100",
  HIRED: "bg-green-100 text-green-700 hover:bg-green-100",
};

const Applications = () => {
  // 3. استخدام الـ Hook بدلاً من الـ useState المحلي
  const { applications, isLoading, error } = useMyApplications();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container flex-1 py-10 max-w-5xl">
        <div className="mb-10 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight">My Applications</h1>
            <p className="text-muted-foreground mt-1">Track and manage your AI-matched job applications</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground animate-pulse">Fetching your applications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20">
            <p className="text-destructive font-semibold">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl bg-card/50">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold text-foreground">No applications yet</h2>
            <p className="text-muted-foreground mb-6">Start applying to jobs to track your progress here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:border-primary/20"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {app.jobTitle}
                    </h3>
                    <Badge className={`${statusColor[app.status]} border-none font-medium px-3`}>
                      {app.status}
                    </Badge>
                  </div>
                  
                  {/* 4. إضافة الـ Matching Ratio بشكل شيك جداً */}
                  <div className="max-w-xs space-y-1.5">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <span>AI Match Score</span>
                      <span className="text-primary">{(app.matchingRatio * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={app.matchingRatio * 100} className="h-2 bg-primary/10" />
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-1 italic">
                    {app.coverLetter || "No cover letter provided."}
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                   {/* ممكن تضيفي هنا زرار "View Details" لو حابة */}
                   <div className="text-right">
                     <p className="text-xs text-muted-foreground">Application ID</p>
                     <p className="font-mono text-sm font-semibold">#{app.id}</p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Applications;