import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { type Application } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

const statusColor: Record<string, string> = {
  Pending: "bg-warning text-warning-foreground",
  Accepted: "bg-success text-success-foreground",
  Rejected: "bg-destructive text-destructive-foreground",
};

const Applications = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getApplications().then((data) => { setApps(data); setLoading(false); });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container flex-1 py-8">
        <div className="mb-8 flex items-center gap-3">
          <FileText className="h-7 w-7 text-primary" />
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Applications</h1>
            <p className="text-muted-foreground">Track the status of your job applications</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : apps.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No applications yet</p>
        ) : (
          <div className="space-y-4">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-card"
              >
                <div>
                  <h3 className="font-display font-semibold text-foreground">{app.jobTitle}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{app.organization} · Applied {app.appliedAt}</p>
                </div>
                <Badge className={statusColor[app.status]}>{app.status}</Badge>
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
