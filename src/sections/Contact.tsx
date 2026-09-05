import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { SplitText } from '../components/ui/SplitText';
import { MagneticButton } from '../components/ui/MagneticButton';

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SplitText className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-white text-center">
            Get In Touch
          </SplitText>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">Let's work together</h3>
              <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">
                I'm always open to discussing new projects, creative ideas, or opportunities to be
                part of your visions.
              </p>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg md:text-xl">📧</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm md:text-base">Email</p>
                    <p className="text-gray-400 text-xs md:text-sm truncate">hello@portfolio.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg md:text-xl">💼</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm md:text-base">LinkedIn</p>
                    <p className="text-gray-400 text-xs md:text-sm truncate">linkedin.com/in/portfolio</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6 order-1 md:order-2"
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none text-sm md:text-base"
                  placeholder="Your message..."
                  required
                />
              </div>
              <MagneticButton type="submit" className="w-full text-sm md:text-base px-6 py-3 md:px-8 md:py-4">
                Send Message
              </MagneticButton>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

