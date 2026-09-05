import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { SplitText } from '../components/ui/SplitText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { api } from '../services/api';

export const Portfolio = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data.docs || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="portfolio" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-black/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SplitText className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-white text-center">
            Portfolio
          </SplitText>

          {loading ? (
            <div className="text-center text-gray-400 py-12">Memuat projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-400 py-12">Data belum ada</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <SpotlightCard>
                    {project.images && project.images.length > 0 ? (
                      <div className="w-full h-48 overflow-hidden rounded-lg mb-3 md:mb-4">
                        <img
                          src={project.images[0]?.image?.url || project.images[0]?.url || project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : project.image?.url ? (
                      <img
                        src={project.image.url}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-3 md:mb-4"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-4xl sm:text-5xl md:text-6xl mb-3 md:mb-4 text-center">💼</div>
                    )}
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{project.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 md:mb-4">{project.description}</p>
                    {project.tech && project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {project.tech.map((tech: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 md:py-1 text-[10px] sm:text-xs bg-primary/20 text-primary rounded"
                          >
                            {tech.name || tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

