import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { SplitText } from '../components/ui/SplitText';
import { api } from '../services/api';

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  return (
    <section id="about" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-black/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SplitText className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-white text-center md:text-left">
            About Me
          </SplitText>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="order-2 md:order-1"
            >
              {profile?.fullDescription ? (
                <div 
                  className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-6 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: profile.fullDescription }}
                />
              ) : (
                <>
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                    Saya adalah mahasiswa Teknologi Informasi di Universitas Muhammadiyah, saat ini berada di semester 6, dengan berbagai keahlian di bidang teknologi informasi. Selama studi saya, saya telah mengembangkan keterampilan dalam pengembangan web, pemrograman, dan solusi teknologi lainnya, serta memiliki minat yang kuat dalam menciptakan solusi inovatif dan efisien.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                    Saya selalu bersemangat untuk belajar hal-hal baru dan mengembangkan keterampilan saya lebih lanjut. Saya percaya bahwa dengan semangat belajar yang tinggi, kerja keras, dan komitmen yang kuat, saya dapat mencapai tujuan dan ambisi saya dalam karir teknologi informasi.
                  </p>
                </>
              )}
            </motion.div>

            <motion.div
              className="relative order-1 md:order-2 mb-6 md:mb-0"
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="aspect-square rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-1 max-w-xs mx-auto md:max-w-none overflow-hidden">
                <div className="w-full h-full rounded-xl md:rounded-2xl bg-black/50 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  {profile?.informalPhoto?.url ? (
                    <img src={profile.informalPhoto.url} alt={profile.name || 'Profile'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl sm:text-5xl md:text-6xl">👨‍💻</div>
                  )}
                </div>
              </div>
              <motion.div
                className="absolute -bottom-2 md:-bottom-4 -right-2 md:-right-4 w-16 h-16 md:w-24 md:h-24 bg-primary/20 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

