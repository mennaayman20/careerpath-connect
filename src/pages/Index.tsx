import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, CheckCircle, Globe, LayoutDashboard, Rocket, Search, Shield, Smartphone, Sparkles, Users, Zap, UserPlus, Briefcase, FileSearch, Handshake } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } }),
};

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container relative z-10 flex flex-col items-center gap-12 py-20 md:flex-row md:py-28">
          <motion.div className="flex-1 text-center md:text-left" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Find the right job.
              <br />
              Hire the right talent.
            </h1>
            <p className="mt-5 max-w-lg text-base text-primary-foreground/80 md:text-lg">
              Upply uses AI-powered matching to connect job seekers with their dream roles and help recruiters find top talent — faster and smarter.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Button asChild size="lg" className="gradient-accent border-0 text-accent-foreground shadow-elevated">
                <Link to="/signup">Begin Journey</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div className="flex-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <img src={heroIllustration} alt="AI-powered hiring platform illustration" className="mx-auto w-full max-w-md animate-float" />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* About */}
      <section className="container py-20">
        <motion.div className="mx-auto max-w-2xl text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">What is Upply?</h2>
          <p className="mt-4 text-muted-foreground">
            Upply is an intelligent recruitment platform that leverages AI to match candidates with the most relevant job opportunities. Our algorithms analyze skills, experience, and preferences to create meaningful connections between talent and companies.
          </p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/50 py-20">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { icon: UserPlus, title: "Create Account", desc: "Sign up in seconds and build your professional profile." },
              { icon: Briefcase, title: "Explore or Post Jobs", desc: "Browse opportunities or post openings for your company." },
              { icon: FileSearch, title: "Apply or Review", desc: "Apply to matched jobs or review ranked applicants." },
              { icon: Handshake, title: "Connect & Hire", desc: "Make the perfect match and start your journey." },
            ].map((step, i) => (
              <motion.div key={step.title} className="flex flex-col items-center rounded-xl bg-card p-6 text-center shadow-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="mb-1 text-xs font-semibold text-accent">Step {i + 1}</span>
                <h3 className="font-display font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container py-20">
        <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">Why Choose Upply?</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Brain, title: "AI-Powered Matching", desc: "Smart algorithms rank candidates and jobs for maximum compatibility." },
            { icon: Shield, title: "Verified Users", desc: "All profiles go through verification to ensure authenticity." },
            { icon: Zap, title: "Fast Hiring", desc: "Streamlined process reduces time-to-hire by up to 60%." },
            { icon: LayoutDashboard, title: "Powerful Dashboard", desc: "Track applications, manage jobs, and analyze insights." },
            { icon: Globe, title: "Global Opportunities", desc: "Access jobs and talent worldwide with no borders." },
            { icon: Users, title: "Team Collaboration", desc: "Invite team members to review and rate candidates together." },
          ].map((feature, i) => (
            <motion.div key={feature.title} className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-elevated hover:border-primary/20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-secondary/50 py-20">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">Key Features</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: Sparkles, title: "AI Recommendations", desc: "Get personalized job suggestions tailored to your skills and goals." },
              { icon: Search, title: "Browse & Filter", desc: "Advanced search with filters for location, type, skills, and more." },
              { icon: Rocket, title: "Ranked Applicants", desc: "Recruiters see candidates ranked by AI-calculated match scores." },
            ].map((f, i) => (
              <motion.div key={f.title} className="rounded-xl bg-card p-8 text-center shadow-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App */}
      <section className="container py-20">
        <motion.div className="mx-auto max-w-xl text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <Smartphone className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="font-display text-3xl font-bold text-foreground">Take Upply On the Go</h2>
          <p className="mt-3 text-muted-foreground">
            Get notified about new matches, apply instantly, and manage your profile — all from your mobile device.
          </p>
          <Button className="mt-6 gradient-primary border-0" size="lg">
            Download App
          </Button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
