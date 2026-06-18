import Navbar from "@/components/Navbar";
import HeroSection from "@/components/ui/heroSection";
import AboutSection from "@/components/ui/aboutSection";
import HowItWorks from "@/components/ui/howItWorks";
import WhyChooseUs from "@/components/ui/whyChooseUs";
import KeyFeatures from "@/components/ui/keyFeatures";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import phoneMockup from "@/assets/phone-mockup-removebg-preview.png";
import { motion } from "framer-motion";
import { Bell, ArrowLeftRight, MapPin } from "lucide-react";
import PartnershipSection from "@/components/ui/PartnershipSection";
import partnerLogo from "@/assets/convertio.in_a5er nos22.png"; // حطي صورة الشراكة هنا
import AIInterviewSection from "@/components/ui/Aiinterviewsection";
import aiInterviewVideo from "../../public/aiinterview.mp4"; // اسم الفيديو اللي حطيتيه في public

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const mobileHighlights = [
  {
    icon: Bell,
    title: "AI Match Alerts",
    description: "Get notified the instant a job matching 90%+ of your skills goes live.",
  },
  {
    icon: ArrowLeftRight,
    title: "Swipe to Apply",
    description: "Browse jobs as cards — swipe right to apply, left to save for later.",
  },
  {
    icon: MapPin,
    title: "Track on the go",
    description: "Follow your application status and join voice interviews from anywhere.",
  },
];

const SectionBadge = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="mx-auto mb-10 w-fit rounded-full bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary shadow-md"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <HeroSection />
      <AboutSection />
      <HowItWorks />
      <PartnershipSection partnerImage={partnerLogo} partnerName="اسم الشريك" />

      <KeyFeatures />

      <AIInterviewSection videoSrc={aiInterviewVideo} />

      <WhyChooseUs />

      <section className="py-14 md:py-30 relative">
        <div className="container px-4">
          <SectionBadge>
            <span className="text-[11px] font-medium tracking-widest uppercase text-violet-600 dark:text-violet-400">
              Mobile Experience
            </span>
          </SectionBadge>

          <motion.div
            className="mx-auto max-w-5xl rounded-[2.5rem] border border-border bg-secondary/40 backdrop-blur-md p-8 md:p-16 shadow-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="flex flex-col items-center gap-12 md:flex-row">
              <div className="flex-1 space-y-6 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Don't just search, <br />
                  <span className="text-primary italic">Get Found.</span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  Stay present, stay fast — your next opportunity finds you first.
                </p>

                {/* Highlights */}
                <div className="space-y-4 pt-2">
                  {mobileHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-3 text-left">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-semibold leading-tight">
                            {item.title}
                          </p>
                          <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 justify-center md:justify-start pt-2">
                  <Button variant="outline" size="lg" className="bg-[#2D236A] text-white">
                    Download Now
                  </Button>
                </div>
              </div>

              <div className="w-56 md:w-64">
                <motion.img
                  src={phoneMockup}
                  alt="App mockup"
                  className="w-full drop-shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
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