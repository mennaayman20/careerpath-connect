import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRef, useEffect } from "react";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let dots: {
      x: number; y: number;
      vx: number; vy: number;
      r: number; opacity: number;
    }[] = [];
    const mouse = { x: -999, y: -999 };
    const MAX_DIST = 130;

    const resize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
      createDots();
    };

    const createDots = () => {
      let DOT_COUNT = 90;
      if (window.innerWidth < 640) {
        DOT_COUNT = 30;
      } else if (window.innerWidth < 1024) {
        DOT_COUNT = 50;
      }

      dots = Array.from({ length: DOT_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.5,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

        // رسم النقط بلون موف
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(270, 71%, 35%, ${d.opacity})`; 
        ctx.fill();

        // ربط النقط المجاورة
        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const dx = d.x - d2.x;
          const dy = d.y - d2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.strokeStyle = `hsla(270, 71%, 35%, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // التفاعل مع الماوس
        const mx = d.x - mouse.x;
        const my = d.y - mouse.y;
        const md = Math.sqrt(mx * mx + my * my);
        if (md < 100) {
          const alpha = (1 - md / 100) * 0.6;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `hsla(270, 71%, 35%, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };

    resize();
    draw();

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 text-center bg-slate-50"
    >
<div className="pointer-events-none absolute inset-y-0 top-0 w-1/2 bg-[radial-gradient(ellipse_at_top_center,_#7c3aed10_0%,_transparent_66%)]" />      {/* الـ Canvas يغطي المساحات الفارغة المحيطة بالمحتوى ولا يمر من تحت النصوص */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{
          maskImage: "radial-gradient(circle at center, transparent 450px, black 500px)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 450px, black 500px)",
        }}
      />

      {/* لمسات إضاءة ناعمة في الخلفية */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl opacity-50" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl opacity-50" />
      </div>

      {/* المحتوى في المقدمة */}
      <div className="container mx-auto px-6" style={{ position: "relative", zIndex: 2 }}>
        <div className="flex flex-col items-center justify-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center text-center max-w-4xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Upply — Find the{" "}
              <span className="text-[#1ca37b]">right</span> job.
              <br />
              Hire the <span className="text-[#1ca37b]">right</span> talent.
            </h1>

            <p className="mt-6 text-lg max-w-lg animate-shine tracking-wide">
              Where talent meets opportunity through AI-driven job matching.
              Personalized, precise, and powerful.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <Link to={isAuthenticated ? "/jobs" : "/login"}>
                  Begin Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link to="/jobs">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { value: "1000+", label: "Jobs Posted" },
                { value: "50+", label: "Companies" },
                { value: "100+", label: "Candidates" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;