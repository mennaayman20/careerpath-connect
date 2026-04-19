import { motion } from "framer-motion";

interface PartnershipSectionProps {
  partnerImage: string;
  partnerName?: string;
}

const PartnershipSection = ({ partnerImage, partnerName = "Partner" }: PartnershipSectionProps) => {
  return (
    <section className="relative py-20 bg-[#2D236A] overflow-hidden">

 

      <div className="container mx-auto px-6">
<div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(ellipse_at_left_center,_#7c3aed55_0%,_transparent_65%)]" />

  {/* إضاءة اليمين */}
  <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(ellipse_at_right_center,_#7c3aed55_0%,_transparent_65%)]" />


        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[11px] font-medium tracking-widest uppercase text-violet-400 mb-2">
            Our Partners
          </p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-3xl font-semibold tracking-tight text-violet-50"  
          >
            Two forces. One vision
          </motion.h2>
          <p className="text-violet-300 text-sm mt-2">  {/* ✅ بدل text-muted-foreground */}
            Driving innovation and unlocking new opportunities together.
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto items-center">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden aspect-video"
          >
            <img
              src={partnerImage}
              alt={`${partnerName} logo`}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            <span className="inline-block bg-violet-800/50 text-violet-200 text-[11px] font-medium tracking-widest uppercase px-3 py-1.5 rounded-full">
              {/* ✅ بدل bg-violet-100 و text-violet-700 */}
              Official Partnership
            </span>

            <h3 className="text-2xl font-semibold text-violet-50 leading-snug">
              {/* ✅ بدل text-foreground */}
              Upply × sho8lanaTech
            </h3>

            <p className="text-violet-200 text-sm leading-relaxed">
              {/* ✅ بدل text-muted-foreground */}
              Our strategic partnership with sho8lanaTech unlocks exclusive tech opportunities,
              empowering job seekers to access cutting-edge careers and accelerate their professional growth.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {["Verified companies", "Exclusive tech jobs", "Trusted hiring"].map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 bg-violet-800/40 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full"
               
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;