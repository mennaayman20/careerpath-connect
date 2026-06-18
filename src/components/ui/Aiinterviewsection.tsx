import { motion } from "framer-motion";
import { Sparkles, Mic, Brain, ClipboardCheck } from "lucide-react";

interface AIInterviewSectionProps {
  videoSrc: string;
}

const highlights = [
  {
    icon: Mic,
    title: "Voice-based interviews",
    description: "AI conducts the technical & behavioral interview on your behalf.",
  },
  {
    icon: Brain,
    title: "Dynamic questions",
    description: "Generated from the job description and candidate profile — 70% technical, 30% behavioral.",
  },
  {
    icon: ClipboardCheck,
    title: "Instant evaluation",
    description: "Employers get a detailed report & accurate scores; candidates get tips to improve.",
  },
];

const AIInterviewSection = ({ videoSrc }: AIInterviewSectionProps) => {
  return (
    <section className="relative py-20 bg-[#2D236A] overflow-hidden">

      {/* إضاءة الشمال */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(ellipse_at_left_center,_#7c3aed40_0%,_transparent_65%)]" />

      {/* إضاءة اليمين */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(ellipse_at_right_center,_#7c3aed40_0%,_transparent_65%)]" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[11px] font-medium tracking-widest uppercase text-violet-400 mb-2">
            AI Interview
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-violet-50"
          >
            Three simple steps. <span className="text-[#13CA92]">Zero manual effort.</span>
          </motion.h2>
          <p className="text-violet-300 text-sm mt-3 max-w-md mx-auto">
            Hire for mindset, not just skills — let AI run the interview for you.
          </p>
        </div>

        {/* Laptop mockup with video */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto max-w-2xl mb-14"
          style={{ perspective: "1400px" }}
        >
          {/* Screen body */}
          <div
            className="relative rounded-t-2xl p-3 pb-4 shadow-2xl"
            style={{
              background: "linear-gradient(155deg, #5a5a5f 0%, #3a3a3d 55%, #1f1f22 100%)",
              boxShadow:
                "0 30px 60px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* شريط علوي فيه الكاميرا */}
            <div className="flex items-center justify-center mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0e0c1c] ring-1 ring-white/10" />
            </div>

            {/* الشاشة نفسها */}
            <div className="relative rounded-md overflow-hidden aspect-video bg-black ring-1 ring-black/40">
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* لمعة زجاج خفيفة على الشاشة */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.06]" />
            </div>
          </div>

          {/* Hinge — المفصلة بين الشاشة والقاعدة */}
          <div
            className="relative h-2.5"
            style={{
              background: "linear-gradient(155deg, #5a5a5f 0%, #3a3a3d 55%, #1f1f22 100%)",
            }}
          />

          {/* Base / keyboard deck — منظور 3D خفيف */}
          <div
            className="relative h-7 rounded-b-[10px]"
            style={{
              background: "linear-gradient(180deg, #2c2c2c 0%, #1f1f1f 60%, #121212 100%)",
              transform: "perspective(600px) rotateX(28deg)",
              transformOrigin: "top",
              boxShadow: "0 18px 30px -10px rgba(0,0,0,0.55)",
            }}
          >
            {/* فتحة تثبيت/نوتش صغيرة لإحساس واقعي */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 rounded-b-md bg-[#0e0c1c]/70" />
            {/* خط لمعة على حافة القاعدة */}
            <div className="absolute top-0 inset-x-4 h-px bg-white/10" />
          </div>

          {/* ظل أرضي */}
          <div className="mx-auto mt-3 h-4 w-[72%] rounded-full bg-black/40 blur-xl" />
        </motion.div>

        {/* Highlight cards — compact row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto px-4 sm:px-0">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-b from-violet-900/30 to-violet-950/20 border border-violet-500/10 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#13CA92]/30 hover:shadow-[0_8px_30px_rgb(19,202,146,0.08)]"
              >
                {/* تأثير توهج خلفي خفيف عند التحويم */}
                <div className="absolute -inset-px bg-gradient-to-br from-[#13CA92]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

                {/* الرقم الترتيبي - تم إصلاحه بـ z-0 ليبقى بالخلفية تماماً */}
                <span className="absolute top-3 right-4 text-4xl font-extrabold text-violet-400/[0.03] group-hover:text-[#13CA92]/[0.05] leading-none select-none tracking-tighter transition-colors pointer-events-none z-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* المحتوى العلوي: تم وضع z-10 ليرتفع النص فوق الرقم ويبقى مقروءاً */}
                <div className="flex items-start gap-3.5 relative z-10 pr-2">
                  {/* حاوية الأيقونة */}
                  <div className="h-10 w-10 rounded-xl bg-violet-800/40 border border-violet-500/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#13CA92] group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(19,202,146,0.4)]">
                    <Icon 
                      className="h-5 w-5 text-[#13CA92] transition-colors duration-300 group-hover:text-violet-950" 
                      strokeWidth={2} 
                    />
                  </div>

                  {/* النصوص */}
                  <div className="min-w-0 space-y-1.5 pt-0.5">
                    <h3 className="text-violet-50 text-sm font-semibold leading-snug tracking-wide group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-violet-300/70 text-xs leading-relaxed line-clamp-4 group-hover:text-violet-200/90 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AIInterviewSection;