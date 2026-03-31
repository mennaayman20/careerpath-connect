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

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

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
      <WhyChooseUs />
      <KeyFeatures />

      <section className="py-24 md:py-32 relative">
        <div className="container px-4">
<SectionBadge>
  <span className="text-[11px] font-medium tracking-widest uppercase text-violet-600 dark:text-violet-400">
    Mobile Experience
  </span>
</SectionBadge>
          
          <motion.div
            className="mx-auto max-w-4xl rounded-[2.5rem] border border-border bg-secondary/40 backdrop-blur-md p-8 md:p-16 shadow-2xl"
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
                  Download the Upply app for real-time notifications.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                 
                  <Button variant="outline" size="lg" className="bg-[#2D236A] text-white">Download Now</Button>
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


