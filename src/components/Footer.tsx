import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <motion.p
            className="text-gray-400 text-xs sm:text-sm text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </motion.p>
          <div className="flex gap-4 md:gap-6">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <motion.a
                key={social}
                href="#"
                className="text-gray-400 hover:text-primary text-xs sm:text-sm transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

