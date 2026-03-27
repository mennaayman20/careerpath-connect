
"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, FileText, BarChart3, Filter, LucideIcon } from "lucide-react";
import { keyFeaturesCards } from "@/data/landingData";

const icons: LucideIcon[] = [Sparkles, FileText, BarChart3, Filter];
const tags = ["Powered by AI", "For employers", "Smart ranking", "For job seekers"];

const KeyFeatures = () => {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = itemRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i); },
        { threshold: 0.6 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  const ActiveIcon = icons[active];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[11px] font-medium tracking-widest uppercase text-violet-600 dark:text-violet-400 mb-2">
            Key Features
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Everything you need,<br />nothing you don't
          </h2>
        </div>

        {/* Sticky layout */}
        <div className="grid lg:grid-cols-2 gap-0 max-w-5xl mx-auto items-start">

          {/* LEFT — sticky visual */}
          <div className="hidden lg:block sticky top-24 pr-12">
            <motion.div
              key={active}
              initial={{ opacity: 0.6, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 aspect-[4/5] flex flex-col items-center justify-center gap-5 relative overflow-hidden"
            >
              {/* bg circle */}
              <div className="absolute w-64 h-64 rounded-full bg-violet-500/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

              <div className="h-20 w-20 rounded-2xl bg-violet-600 flex items-center justify-center relative z-10 shadow-lg shadow-violet-500/20">
                <ActiveIcon className="h-9 w-9 text-white" strokeWidth={1.4} />
              </div>

              <p className="text-sm font-medium text-violet-800 dark:text-violet-300 relative z-10">
                {keyFeaturesCards[active]?.title}
              </p>

              {/* dots */}
              <div className="flex gap-1.5 relative z-10">
                {keyFeaturesCards.map((_, i) => (
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
            </motion.div>
          </div>

          {/* RIGHT — scrollable items */}
          <div className="flex flex-col divide-y divide-border/40">
            {keyFeaturesCards.map((card, index) => {
              const Icon = icons[index];
              const isActive = active === index;
              return (
                <motion.div
                  key={card.title}
                  ref={(el) => (itemRefs.current[index] = el)}
                  onClick={() => setActive(index)}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group cursor-pointer py-8 pl-8 relative"
                >
                  {/* left accent line */}
                  <div
                    className={`absolute left-0 top-0 w-0.5 rounded-full bg-violet-600 transition-all duration-500 ${
                      isActive ? "h-full" : "h-0"
                    }`}
                  />

                  <p className="text-[10px] font-medium tracking-widest text-violet-400 mb-2">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300 ${
                      isActive
                        ? "bg-violet-600"
                        : "bg-violet-50 dark:bg-violet-950/40"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors duration-300 ${
                        isActive ? "text-white" : "text-violet-600 dark:text-violet-400"
                      }`}
                      strokeWidth={1.6}
                    />
                  </div>

                  <h3
                    className={`text-base font-medium mb-1.5 transition-colors duration-200 ${
                      isActive ? "text-violet-600 dark:text-violet-400" : "text-foreground"
                    }`}
                  >
                    {card.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                    {card.description}
                  </p>

                  <motion.span
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -6 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-medium text-violet-600 dark:text-violet-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
                    {tags[index]}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;


// import { motion } from "framer-motion";
// import { keyFeaturesCards } from "@/data/landingData";
// import { Sparkles, FileText, BarChart3, Filter } from "lucide-react";

// const icons = [Sparkles, FileText, BarChart3, Filter];

// const KeyFeatures = () => {
//   return (
//     <section className="py-20">
//       <div className="container mx-auto px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <span className="inline-block px-6 py-2 rounded-full bg-accent text-accent-foreground font-semibold text-sm">
//             Key Features
//           </span>
//         </motion.div>

//         <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
//           {keyFeaturesCards.map((card, index) => {
//             const Icon = icons[index];
//             return (
//               <motion.div
//                 key={card.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="relative overflow-hidden rounded-2xl border border-border/50 p-6 hover:shadow-lg transition-all duration-300 group"
//               >
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full" />
//                 <div className="relative">
//                   <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
//                     <Icon className="w-5 h-5 text-primary" />
//                   </div>
//                   <h3 className="font-bold text-lg mb-2">{card.title}</h3>
//                   <p className="text-muted-foreground text-sm leading-relaxed">
//                     {card.description}
//                   </p>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default KeyFeatures;
