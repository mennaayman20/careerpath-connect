import { motion } from "framer-motion";
import { SearchCheck, Rocket, ShieldCheck, TrendingUp, LayoutDashboard, Globe } from "lucide-react";
import { whyChooseUsCards } from "@/data/landingData";

const iconMap: Record<string, React.ElementType> = {
  SearchCheck, Rocket, ShieldCheck, TrendingUp, LayoutDashboard, Globe,
};

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-secondary/90">
      <div className="container mx-auto px-6">

        <div className="text-center mb-12">
          <p className="text-[11px] font-medium tracking-widest uppercase text-violet-600 dark:text-violet-400 mb-2">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">Built different, for a reason</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {whyChooseUsCards.map((card, index) => {
            const Icon = iconMap[card.icon] || SearchCheck;
            const num = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="h-44"
                style={{ perspective: "900px" }}
              >
                <div className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ease-[cubic-bezier(0.4,0.2,0.2,1)] group hover:[transform:rotateY(180deg)]">

                  {/* FRONT */}
                  <div className="absolute inset-0 rounded-2xl border border-border/50 bg-background p-5 [backface-visibility:hidden] flex flex-col justify-end">
                    <span className="absolute top-4 right-5 text-4xl font-semibold text-violet-600/10 leading-none tracking-tighter select-none">
                      {num}
                    </span>
                    <div className="h-9 w-9 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center mb-3">
                      <Icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="text-sm font-medium text-foreground leading-snug">{card.title}</h3>
                  </div>

                  {/* BACK */}
                  <div className="absolute inset-0 rounded-2xl bg-violet-600 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">
                    <span className="text-[10px] font-medium tracking-widest uppercase text-white/50">
                      {num} — {card.title}
                    </span>
                    <p className="text-[13px] text-white leading-relaxed flex-1 flex items-center">
                      {card.description}
                    </p>
                    <div className="h-7 w-7 rounded-lg bg-white/15 flex items-center justify-center self-end">
                      <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-6">Hover over a card to flip it</p>

      </div>
    </section>
  );
};

export default WhyChooseUs;



// import { motion } from "framer-motion";
// import {
//   SearchCheck,
//   Rocket,
//   ShieldCheck,
//   TrendingUp,
//   LayoutDashboard,
//   Globe,
// } from "lucide-react";
// import { whyChooseUsCards } from "@/data/landingData";

// const iconMap: Record<string, React.ElementType> = {
//   SearchCheck,
//   Rocket,
//   ShieldCheck,
//   TrendingUp,
//   LayoutDashboard,
//   Globe,
// };

// const WhyChooseUs = () => {
//   return (
//     <section className="py-20 bg-secondary/30">
//       <div className="container mx-auto px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <span className="inline-block px-6 py-2 rounded-full bg-accent text-accent-foreground font-semibold text-sm">
//             Why Choose Us?
//           </span>
//         </motion.div>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
//           {whyChooseUsCards.map((card, index) => {
//             const Icon = iconMap[card.icon] || SearchCheck;
//             return (
//               <motion.div
//                 key={card.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.08 }}
//                 className="group bg-background rounded-2xl p-6 border border-border/50 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
//                   <Icon className="w-6 h-6 text-accent" />
//                 </div>
//                 <h3 className="font-bold text-lg mb-2">{card.title}</h3>
//                 <p className="text-muted-foreground text-sm leading-relaxed">
//                   {card.description}
//                 </p>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WhyChooseUs;
