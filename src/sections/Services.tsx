import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { SplitText } from '../components/ui/SplitText';

const services = [
  {
    title: 'Web Development',
    description: 'Custom web applications built with modern frameworks and best practices.',
    icon: '🌐',
  },
  {
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that users love to interact with.',
    icon: '🎨',
  },
  {
    title: 'Performance Optimization',
    description: 'Lightning-fast websites with optimized code and assets.',
    icon: '⚡',
  },
  {
    title: 'Responsive Design',
    description: 'Seamless experiences across all devices and screen sizes.',
    icon: '📱',
  },
];

export const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SplitText className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-white text-center">
            Services
          </SplitText>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                className="p-4 md:p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="text-3xl md:text-4xl mb-3 md:mb-4">{service.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{service.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

