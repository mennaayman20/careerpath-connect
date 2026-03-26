import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react"; // غيرت السهم لـ ChevronDown شكله أشيك في الأكورديون

// 1. مكون الرقم المتحرك (بيعمل Count-up animation)
export const AnimatedNumber = ({ target, className, delay = 0 }: { target: number; className?: string; delay?: number }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const duration = 1000; // مدة الأنميشن بالملي ثانية
      const increment = target / (duration / 16); // 16ms هي مدة الفريم الواحد تقريباً (60fps)

      const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
          setDisplay(target);
          clearInterval(counter);
        } else {
          setDisplay(Math.floor(start));
        }
      }, 16);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, delay]);

  return <span className={className}>{display}%</span>;
};

// 2. مكون البار المتحرك (التقدم الأفقي)
export const AnimatedBar = ({ value, color, delay }: { value: number; color: string; delay: number }) => (
  <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${value}%` }}
    transition={{ duration: 1.2, delay: delay / 1000, ease: [0.34, 1.56, 0.64, 1] }} // Spring-like ease
    className="h-full rounded-full"
    style={{ backgroundColor: color }}
  />
);

// 3. مكون الأكورديون الخاص بالـ Feedback
export const FeedbackAccordion = ({ label, text, fix, score, color, isLast }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${!isLast ? "border-b" : ""} border-border bg-background transition-colors duration-200`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          {/* دائرة اللون الصغير بجانب العنوان */}
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/80">{label}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold font-mono" style={{ color }}>{score}%</span>
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-10 pb-5 space-y-4">
              {/* نص التحليل */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {text}
              </p>
              
              {/* صندوق نصيحة التصليح */}
              {fix && (
                <div className="bg-stone-50 dark:bg-stone-900/60 p-4 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-4 bg-primary/40 rounded-full" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">How to improve</p>
                  </div>
                  <p className="text-xs text-foreground/90 italic leading-relaxed">
                    {fix}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// مكون فرعي لعرض المهارات (Matched / Missing) بشكل أنيق
export const SkillCard = ({ title, skills, variant, icon }: { 
  title: string; 
  skills: string[]; 
  variant: 'green' | 'red'; 
  icon: React.ReactNode 
}) => {
  const isGreen = variant === 'green';
  
  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col h-full">
      <div className={`
        ${isGreen ? "bg-green-50/50 dark:bg-green-950/20" : "bg-red-50/50 dark:bg-red-950/20"} 
        px-5 py-3 flex items-center gap-2 border-b border-border
      `}>
        <span className={`
          ${isGreen ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"} 
          flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest
        `}>
          {icon} {title}
        </span>
      </div>
      <div className="p-4 flex flex-wrap gap-2 bg-background flex-1">
        {skills && skills.length > 0 ? (
          skills.map((skill, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`
                ${isGreen 
                  ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800" 
                  : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-100 dark:border-red-800"} 
                rounded-lg px-3 py-1.5 text-xs font-semibold border
              `}
            >
              {skill}
            </motion.span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground italic p-1">No skills detected.</span>
        )}
      </div>
    </div>
  );
};