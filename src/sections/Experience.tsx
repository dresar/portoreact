import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { SplitText } from '../components/ui/SplitText';
import { api } from '../services/api';

export const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await api.getExperiences();
      // Sort by startDate descending
      const sorted = data.sort((a: any, b: any) => {
        const dateA = new Date(a.startDate || 0).getTime();
        const dateB = new Date(b.startDate || 0).getTime();
        return dateB - dateA;
      });
      setExperiences(sorted);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return '';
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Sekarang';
    return `${start} - ${end}`;
  };

  return (
    <section id="experience" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SplitText className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-white text-center">
            Pengalaman Kerja
          </SplitText>

          {loading ? (
            <div className="text-center text-gray-400 py-12">Memuat pengalaman...</div>
          ) : experiences.length === 0 ? (
            <div className="text-center text-gray-400 py-12">Data belum ada</div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />

              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.id || i}
                  className={`relative flex items-start mb-8 md:mb-12 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-6 sm:left-8 md:left-1/2 transform -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary border-2 md:border-4 border-black z-10" />

                  {/* Content */}
                  <div
                    className={`ml-14 sm:ml-20 md:ml-0 md:w-5/12 ${
                      i % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                    }`}
                  >
                    <motion.div
                      className="p-4 md:p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]"
                      whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                    >
                      <span className="text-primary text-xs sm:text-sm font-medium">
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </span>
                      <h3 className="text-lg md:text-xl font-semibold text-white mt-2">{exp.title}</h3>
                      <p className="text-accent text-xs sm:text-sm mb-2">{exp.company}</p>
                      {exp.location && (
                        <p className="text-gray-500 text-xs sm:text-sm mb-2">{exp.location}</p>
                      )}
                      {exp.description && (
                        <div 
                          className="text-gray-400 text-xs sm:text-sm prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: typeof exp.description === 'string' ? exp.description : exp.description || '' }}
                        />
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {exp.technologies.map((tech: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-[10px] sm:text-xs bg-primary/20 text-primary rounded"
                            >
                              {tech.name || tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

