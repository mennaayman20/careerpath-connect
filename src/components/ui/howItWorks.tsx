"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Briefcase, ClipboardCheck, Handshake, LucideIcon } from "lucide-react";
import { howItWorksSteps } from "@/data/landingData";

const iconMap: Record<string, LucideIcon> = {
  UserPlus, Search: Briefcase, ClipboardCheck, Handshake,
};

const HowItWorks = () => {
  const [active, setActive] = useState(0);

  // بيتغير أوتوماتيك كل 2.5 ثانية
  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => (p + 1) % howItWorksSteps.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const ActiveIcon = iconMap[howItWorksSteps[active]?.icon] || UserPlus;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[11px] font-medium tracking-widest uppercase text-violet-600 dark:text-violet-400 mb-2">
            Process
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">How It Works</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto items-center">

          {/* Steps */}
          <div className="flex flex-col">
            {howItWorksSteps.map((step, i) => {
              const Icon = iconMap[step.icon] || UserPlus;
              const isActive = active === i;
              const isLast = i === howItWorksSteps.length - 1;

              return (
                <motion.div
                  key={step.title}
                  className="flex gap-4 cursor-pointer"
                  onClick={() => setActive(i)}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  {/* Spine */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all duration-300
                      ${isActive
                        ? "bg-violet-600 border-violet-600 shadow-lg shadow-violet-500/20"
                        : "bg-background border-border/60"}`}>
                      <Icon className={`h-4.5 w-4.5 transition-colors duration-300 ${isActive ? "text-white" : "text-muted-foreground"}`} strokeWidth={1.6} />
                    </div>
                    {!isLast && (
                      <div className={`w-px flex-1 min-h-[28px] my-1 rounded-full transition-colors duration-500
                        ${isActive ? "bg-violet-400" : "bg-border/50"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-7 pt-2 ${isLast ? "pb-0" : ""}`}>
                    <p className="text-[10px] font-medium tracking-widest text-violet-400 mb-1">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className={`text-[15px] font-medium transition-colors duration-200
                      ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.title}
                    </h3>
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.p
                          key={step.title}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm text-muted-foreground leading-relaxed mt-1.5 overflow-hidden"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Visual */}
          <div className="hidden lg:flex rounded-2xl bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 aspect-square flex-col items-center justify-center gap-5 relative overflow-hidden">
            <div className="absolute w-56 h-56 rounded-full bg-violet-500/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4 relative z-10"
              >
                <div className="h-20 w-20 rounded-2xl bg-violet-600 flex items-center justify-center shadow-xl shadow-violet-500/25">
                  <ActiveIcon className="h-9 w-9 text-white" strokeWidth={1.3} />
                </div>
                <p className="text-sm font-medium text-violet-800 dark:text-violet-300">
                  {howItWorksSteps[active]?.title}
                </p>
                <p className="text-[11px] text-violet-500">
                  Step {active + 1} of {howItWorksSteps.length}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex gap-2 relative z-10">
              {howItWorksSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-5 bg-violet-600"
                      : "w-2 bg-violet-300 dark:bg-violet-700"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;


// import { motion } from "framer-motion";
// import { UserPlus, Search, ClipboardCheck, Handshake } from "lucide-react";
// import { howItWorksSteps } from "@/data/landingData";

// const iconMap: Record<string, React.ElementType> = {
//   UserPlus,
//   Search,
//   ClipboardCheck,
//   Handshake,
// };

// const HowItWorks = () => {
//   return (
//     <section className="py-20">
//       <div className="container mx-auto px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <span className="inline-block px-11 py-2 rounded-full bg-accent text-accent-foreground font-semibold text-xl">
//             How It Works ..
//           </span>
//         </motion.div>

//         <div className="max-w-2xl mx-auto space-y-0">
//           {howItWorksSteps.map((step, index) => {
//             const Icon = iconMap[step.icon] || UserPlus;
//             return (
//               <motion.div
//                 key={step.title}
//                 initial={{ opacity: 0, x: -20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="flex gap-4 relative"
//               >
//                 {/* Timeline line */}
//                 <div className="flex flex-col items-center">
//                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//                     <Icon className="w-5 h-5 text-primary" />
//                   </div>
//                   {index < howItWorksSteps.length - 1 && (
//                     <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-transparent my-2" />
//                   )}
//                 </div>

//                 <div className="pb-8">
//                   <h3 className="font-bold text-lg">{step.title}</h3>
//                   <p className="text-muted-foreground mt-1">{step.description}</p>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HowItWorks;
