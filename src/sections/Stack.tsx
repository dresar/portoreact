import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { SplitText } from '../components/ui/SplitText';
import { api } from '../services/api';

export const Stack = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await api.getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const technologies = skills.length > 0 
    ? skills.map((skill: any) => skill.name)
    : ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Node.js', 'Tailwind CSS', 'Framer Motion', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'Figma'];

  return (
    <section id="stack" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-black/50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SplitText className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-white text-center">
            Keahlian Saya
          </SplitText>

          {loading ? (
            <div className="text-center text-gray-400 py-12">Memuat keahlian...</div>
          ) : technologies.length === 0 ? (
            <div className="text-center text-gray-400 py-12">Data belum ada</div>
          ) : (
            <>

          {/* Infinite Marquee */}
          <div className="relative overflow-hidden">
            <div className="flex">
              <motion.div
                className="flex gap-4 md:gap-8"
                animate={{
                  x: [0, -50 * technologies.length * 10],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 30,
                    ease: 'linear',
                  },
                }}
              >
                {[...technologies, ...technologies, ...technologies].map((tech, i) => (
                  <motion.div
                    key={`${tech}-${i}`}
                    className="px-4 py-2 md:px-6 md:py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium whitespace-nowrap text-sm md:text-base"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Gravity-based Grid */}
          <div className="mt-12 md:mt-16 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
            {technologies.slice(0, 14).map((tech, i) => (
              <motion.div
                key={tech}
                className="aspect-square rounded-lg md:rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center p-2 md:p-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: i * 0.05,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.1,
                  borderColor: 'rgba(59, 130, 246, 0.5)',
                }}
              >
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-center text-white leading-tight">
                  {tech}
                </span>
              </motion.div>
            ))}
          </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

