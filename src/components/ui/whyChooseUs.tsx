import { motion } from "framer-motion";
import { SearchCheck, Rocket, ShieldCheck, TrendingUp, LayoutDashboard, Globe } from "lucide-react";
import { whyChooseUsCards } from "@/data/landingData";

const iconMap: Record<string, React.ElementType> = {
  SearchCheck, Rocket, ShieldCheck, TrendingUp, LayoutDashboard, Globe,
};

const WhyChooseUs = () => {
  return (
    <section className="relative py-24 bg-secondary/40 overflow-hidden dark:bg-[#0c0a1c]/30">
      {/* خلفيات ضوئية ناعمة لخلفية القسم */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-violet-600 dark:text-violet-400 mb-2.5">
            Why Choose Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
            Built different, <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">
     for a reason</span> 
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {whyChooseUsCards.map((card, index) => {
            const Icon = iconMap[card.icon] || SearchCheck;
            const num = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group h-48 cursor-pointer"
                style={{ perspective: "1500px" }}
              >
                <div
                  className="relative w-full h-full duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                >
                  
                  {/* FRONT SIDE */}
                  <div 
                    className="absolute inset-0 rounded-2xl border border-black/[0.06] dark:border-white/[0.05] bg-gradient-to-b from-background to-background/90 p-6 [backface-visibility:hidden] flex flex-col justify-between shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-violet-500/20"
                    style={{ transform: "rotateY(0deg)" }}
                  >
                    {/* الرقم الخلفي مدمج بذكاء خلف النص وبطبقة z منخفضة لعدم تداخل الحروف */}
                    <span className="absolute top-4 right-6 text-5xl font-black text-violet-600/[0.04] dark:text-violet-400/[0.02] leading-none tracking-tighter select-none transition-colors group-hover:text-violet-500/[0.08]">
                      {num}
                    </span>

                    {/* حاوية الأيقونة */}
                    <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/30 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-violet-600 group-hover:border-violet-600">
                      <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400 transition-colors duration-300 group-hover:text-white" />
                    </div>

                    {/* العنوان */}
                    <h3 className="text-base font-semibold text-foreground tracking-wide leading-snug relative z-10">
                      {card.title}
                    </h3>
                  </div>

                  {/* BACK SIDE */}
                  <div 
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 [backface-visibility:hidden] flex flex-col justify-between shadow-xl shadow-violet-600/10"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    {/* شريط معلومات علوي صغير */}
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">
                        {num} &mdash; Details
                      </span>
                      <span className="text-[11px] font-medium text-white/80 line-clamp-1 max-w-[150px]">
                        {card.title}
                      </span>
                    </div>

                    {/* الوصف */}
                    <p className="text-[13px] text-violet-50/90 leading-relaxed font-medium line-clamp-4 my-auto">
                      {card.description}
                    </p>

                    {/* سهم تجميلي سفلي */}
                    <div className="h-7 w-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center self-end backdrop-blur-sm shadow-inner">
                      <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* تلميح سفلي خفيف */}
        <p className="text-center text-[11px] font-medium tracking-wide text-muted-foreground/40 mt-8 select-none">
           Hover over any card to reveal details
        </p>

      </div>
    </section>
  );
};

export default WhyChooseUs;