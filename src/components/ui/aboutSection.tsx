import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="py-20 bg-[#2D236A] mt-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl  text-white">
              About{" "}
              <span className="text-[#13CA92]">Upply</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-green-300 via-purple-500 to-primary rounded-full hidden md:block" />
            <p className="text-white text-m leading-relaxed">
UPPlY is redefining the job market by eliminating the noise of traditional recruitment. 
By combining smart CV analysis with real-time semantic matching, we bridge the gap between top talent and visionary companies instantly. 
Welcome to a streamlined, data-driven ecosystem built for pure professional growth. </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
