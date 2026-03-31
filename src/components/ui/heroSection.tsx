import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // 1. استيراد الهوك
const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Upply — Find the{" "}
              <span className="text-[#1ca37b]">right</span> job.
              <br />
              Hire the <span className="text-[#1ca37b]">right</span> talent.
            </h1>

            {/* <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Where talent meets opportunity through AI-driven job matching.
              Personalized, precise, and powerful.
            </p> */}

            <p className="mt-6 text-lg  max-w-lg animate-shine tracking-wide">
   Where talent meets opportunity through AI-driven job matching.
              Personalized, precise, and powerful.
</p> 

            <div className="flex flex-wrap gap-4 mt-8">
              <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Link to={isAuthenticated ? "/jobs" : "/login"}>
                  Begin Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/jobs">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { value: "10K+", label: "Jobs Posted" },
                { value: "5K+", label: "Companies" },
                { value: "50K+", label: "Candidates" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Abstract shapes representing hiring */}
              <div className="relative">
                <div className="w-72 h-72 mx-auto rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50 flex items-center justify-center">
                  <div className="space-y-4 text-center p-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-32 mx-auto rounded-full bg-primary/15" />
                      <div className="h-3 w-24 mx-auto rounded-full bg-accent/20" />
                      <div className="h-3 w-28 mx-auto rounded-full bg-primary/10" />
                    </div>
                  </div>
                </div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-background shadow-xl rounded-2xl p-4 border border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">Matched!</div>
                      <div className="text-[10px] text-muted-foreground">95% fit</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-background shadow-xl rounded-2xl p-4 border border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">New Job Alert</div>
                      <div className="text-[10px] text-muted-foreground">3 new matches</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
