
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/ui/heroSection";
import AboutSection from "@/components/ui/aboutSection";
import HowItWorks from "@/components/ui/howItWorks";
import WhyChooseUs from "@/components/ui/whyChooseUs";
import KeyFeatures from "@/components/ui/keyFeatures";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button"; // ✅ صح
import phoneMockup from "@/assets/phone-mockup.png";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
   visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
 };

 const fadeIn = {
   hidden: { opacity: 0 },
   visible: { opacity: 1, transition: { duration: 0.6 } },
};

const SectionBadge = ({ children }: { children: React.ReactNode }) => (
   <motion.div
     className="mx-auto mb-10 w-fit rounded-full gradient-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-md"
     initial={{ opacity: 0, scale: 0.9 }}
     whileInView={{ opacity: 1, scale: 1 }}
     viewport={{ once: true }}
     transition={{ duration: 0.4 }}
   >
     {children}
   </motion.div>
 );

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HowItWorks />
      <WhyChooseUs />
      <KeyFeatures />


     {/* <section className="py-16 md:py-20">
        <div className="container">
          <SectionBadge>why download mobile app ?</SectionBadge>
          <motion.div
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-secondary/60 p-8 md:p-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="flex-1">
                <p className="text-muted-foreground leading-relaxed">
                  Download the mobile app to get real-time notifications for jobs that perfectly
                  match your skills and profile. Be among the first to apply, stay updated instantly,
                  and never miss an opportunity made for you.
                </p>
                <Button className="mt-6 gradient-primary border-0 text-primary-foreground">
                  Download App
                </Button>
              </div>
              <div className="w-40 shrink-0 md:w-48">
                <img src={phoneMockup} alt="Upply mobile app" className="w-full animate-float" />
              </div>
            </div>
          </motion.div>
        </div>
      </section> */}


      <section className="py-24 md:py-32 relative overflow-hidden">
  {/* إضافة خلفية بلور خفيفة للزينة */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />

  <div className="container px-4">
    <SectionBadge>Mobile Experience</SectionBadge>
    
    <motion.div
      className="mx-auto max-w-4xl relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-secondary/40 backdrop-blur-md p-8 md:p-16 shadow-2xl"
      initial="hidden"
      whileInView="visible"
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      variants={fadeIn}
    >
      <div className="flex flex-col items-center gap-12 md:flex-row">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Don't just search, <br />
            <span className="text-primary italic">Get Found.</span>
          </h2>
          
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            Download the <span className="font-semibold text-foreground">Upply</span> mobile app to get real-time notifications for jobs that perfectly match your skills.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            {/* أزرار الـ Store شكلها احترافي أكتر */}
            <Button className="h-14 px-8 rounded-2xl bg-foreground text-background hover:bg-foreground/90 gap-3 font-bold transition-all hover:scale-105">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 12c0-2.5 1.7-4.6 4.1-5.3-1.1-1.6-2.9-2.7-5-2.9-2.2-.2-4.3 1.3-5.4 1.3-1.1 0-2.9-1.3-4.7-1.3-2.4 0-4.6 1.4-5.8 3.5C-.1 9.7.9 14.8 3.2 18.2c1.1 1.6 2.5 3.4 4.2 3.4 1.7 0 2.3-1 4.3-1s2.6 1 4.3 1c1.7 0 3-1.6 4.1-3.2.7-1.1 1.1-2.2 1.3-2.3-4.2-.2-4.1-5.1-.1-5.1zM15.5 2.1c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.9.9-3.8 2-1 1-1.7 2.6-1.5 4 1.5.1 2.9-.8 4-1.9z"/>
              </svg>
              App Store
            </Button>
            
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 gap-3 font-bold hover:bg-secondary transition-all hover:scale-105">
              Download Now
            </Button>
          </div>
        </div>

        <div className="relative w-56 shrink-0 md:w-64">
          {/* الـ Glow اللي ورا الموبايل */}
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <motion.img 
            src= {phoneMockup}
            alt="Upply mobile app" 
            className="relative z-10 w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </motion.div>
  </div>
</section>


      <Footer />


      
    </div>
  );
};

export default Index;


// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import {
//   Brain, CheckCircle, Globe, LayoutDashboard, Rocket, Search, Shield,
//   Smartphone, Sparkles, Users, Zap, UserPlus, Briefcase, FileSearch,
//   Handshake, Grid3X3, ArrowRight
// } from "lucide-react";
// import heroIllustration from "@/assets/hero-illustration.png";
// import phoneMockup from "@/assets/phone-mockup.png";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// const fadeUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (i: number) => ({
//     opacity: 1, y: 0,
//     transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
//   }),
// };

// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { duration: 0.6 } },
// };

// const SectionBadge = ({ children }: { children: React.ReactNode }) => (
//   <motion.div
//     className="mx-auto mb-10 w-fit rounded-full gradient-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-md"
//     initial={{ opacity: 0, scale: 0.9 }}
//     whileInView={{ opacity: 1, scale: 1 }}
//     viewport={{ once: true }}
//     transition={{ duration: 0.4 }}
//   >
//     {children}
//   </motion.div>
// );

// const Index = () => {
//   return (
//     <div className="flex min-h-screen flex-col bg-background">
//       <Navbar />

//       {/* Hero */}
//       <section className="container py-16 md:py-24">
//         <div className="flex flex-col items-center gap-10 md:flex-row">
//           <motion.div
//             className="flex-1 text-center md:text-left"
//             initial="hidden"
//             animate="visible"
//             variants={fadeUp}
//             custom={0}
//           >
//             <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
//               Upply — Find the{" "}
//               <span className="text-accent">right</span> job.
//               <br />
//               Hire the <span className="text-accent">right</span> talent.
//             </h1>
//             <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
//               <Button asChild size="lg" className="gradient-primary border-0 text-primary-foreground shadow-elevated">
//                 <Link to="/signup">Begin Journey</Link>
//               </Button>
//               <Button asChild size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-secondary">
//                 <Link to="/jobs">Browse Jobs</Link>
//               </Button>
//             </div>
//           </motion.div>
//           <motion.div
//             className="flex-1"
//             initial={{ opacity: 0, x: 30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//           >
//             <img
//               src={heroIllustration}
//               alt="AI-powered hiring platform illustration"
//               className="mx-auto w-full max-w-sm animate-float"
//             />
//           </motion.div>
//         </div>
//       </section>

//       {/* About */}
//       <section className="py-20 bg-secondary/30">
//       <div className="container mx-auto px-6">
//         <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start max-w-4xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//           >
//             <h2 className="text-3xl sm:text-4xl font-bold">
//               About{" "}
//               <span className="text-accent">Upply</span>
//             </h2>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="relative"
//           >
//             <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-primary rounded-full hidden md:block" />
//             <p className="text-muted-foreground text-lg leading-relaxed">
//               Where talent meets opportunity. Whether you're a job seeker searching for your dream company or a
//               recruiter looking for top talent, our platform uses intelligent ranking and smart matching to connect
//               the right people with the right opportunities. Hiring has never been easier—personalized, precise, and
//               powerful.
//             </p>
//           </motion.div>
//         </div>
//       </div>
//     </section>

//       {/* How It Works */}
//       <section className="container py-16 md:py-20">
//         <SectionBadge>How It Works ?</SectionBadge>
//         <div className="mx-auto max-w-2xl space-y-6">
//           {[
//             { icon: UserPlus, title: "Create an Account", desc: "Sign up quickly and for free, and set up your profile." },
//             { icon: Briefcase, title: "Explore & Post Opportunities", desc: "Access jobs recommended for you based on your skills and experience, or post job openings to reach the most suitable candidates." },
//             { icon: FileSearch, title: "Apply or Review Applicants", desc: "As Job Seekers apply instantly and track your applications. As Employers filter, review, and shortlist applicants with ease." },
//             { icon: Handshake, title: "Connect & Hire", desc: "Connecting the right people with the right opportunities." },
//           ].map((step, i) => (
//             <motion.div
//               key={step.title}
//               className="flex items-start gap-4"
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               custom={i}
//             >
//               <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
//                 <step.icon className="h-5 w-5" />
//               </div>
//               <div>
//                 <h3 className="font-display font-semibold text-foreground">{step.title}</h3>
//                 <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Why Choose Us */}
//       <section className="py-16 md:py-20">
//         <div className="container">
//           <SectionBadge>Why Choose Us?</SectionBadge>
//           <div className="grid gap-5 sm:grid-cols-2">
//             {[
//               { icon: Search, title: "Curated Job Matches", desc: "Our smart algorithm connects job seekers with the most relevant roles—no endless scrolling, just real opportunities." },
//               { icon: Zap, title: "Fast & Transparent Hiring", desc: "We prioritize speed, simplicity, and communication so both employers and job seekers stay in the loop at every stage." },
//               { icon: Shield, title: "Verified Employers & Talent", desc: "Every profile is screened to ensure authenticity and professionalism on both sides." },
//               { icon: Rocket, title: "Built for Every Career Stage", desc: "From entry-level to executive, freelance to full-time—we've got something for everyone." },
//               { icon: LayoutDashboard, title: "All-in-One Dashboard", desc: "Manage everything—applications, and candidate tracking—in one powerful, easy-to-use dashboard." },
//               { icon: Globe, title: "Global Opportunities", desc: "Access jobs and talent worldwide, while filtering for region-specific relevance and cultural fit." },
//             ].map((feature, i) => (
//               <motion.div
//                 key={feature.title}
//                 className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-elevated"
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true }}
//                 variants={fadeUp}
//                 custom={i}
//               >
//                 <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
//                   <feature.icon className="h-5 w-5" />
//                 </div>
//                 <h3 className="font-display font-semibold text-foreground">{feature.title}</h3>
//                 <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Key Features */}
//       <section className="py-16 md:py-20">
//         <div className="container">
//           <SectionBadge>Key Features</SectionBadge>
//           <div className="grid gap-5 sm:grid-cols-2">
//             {[
//               { icon: Sparkles, title: "AI-Powered Job Recommendations", desc: "As you build your profile, the AI analyzes your skills and experience to show you recommended jobs that fit you best." },
//               { icon: Briefcase, title: "Custom Job Postings", desc: "Recruiters can add specific questions or fields to applications to get the info they need." },
//               { icon: Brain, title: "Ranked Applicants", desc: "Candidates are automatically sorted based on resume-job compatibility for smarter hiring decisions." },
//               { icon: Search, title: "Browse & Filter Jobs", desc: "Find the perfect job using filters like location, skills, and organization." },
//             ].map((f, i) => (
//               <motion.div
//                 key={f.title}
//                 className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-elevated"
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true }}
//                 variants={fadeUp}
//                 custom={i}
//               >
//                 <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
//                 <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>







//       {/* Mobile App */}
     








//       <Footer />
//     </div>
//   );
// };

// export default Index;
