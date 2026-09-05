import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PixelBlast } from '../components/ui/PixelBlast';
import { DecryptedText } from '../components/ui/DecryptedText';
import { TextType } from '../components/ui/TextType';
import { MagneticButton } from '../components/ui/MagneticButton';
import { api } from '../services/api';

export const Home = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const downloadCV = () => {
    if (profile?.cv?.url) {
      window.open(profile.cv.url, '_blank');
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={6}
          color="#9333ea"
          patternScale={3}
          patternDensity={1.5}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-0">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[80vh]">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left z-20 order-2 md:order-1"
          >
            <motion.p
              className="text-white text-sm sm:text-lg md:text-xl mb-3 md:mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Halo, Saya 👋
            </motion.p>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4 text-white leading-tight">
              <DecryptedText text={profile?.name || 'Eka Syarif Maulana'} delay={0.5} className="block" />
            </h1>

            <motion.div
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {profile?.position || 'FULL STACK'}
            </motion.div>

            <motion.p
              className="text-base sm:text-lg md:text-xl mb-2 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Saya seorang{' '}
              <span className="text-primary font-semibold">
                <TextType
                  texts={profile?.profession ? profile.profession.split(',').map((p: string) => p.trim()) : ['Web Developer', 'Full Stack Developer', 'UI/UX Designer', 'Problem Solver']}
                  speed={80}
                  deleteSpeed={40}
                  pauseTime={2000}
                  delay={0.5}
                  cursor="|"
                  cursorBlink={true}
                />
              </span>
            </motion.p>

            <motion.p
              className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 md:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              {profile?.shortDescription || 'Selamat datang di portofolio saya.'}
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
            >
              <MagneticButton
                onClick={downloadCV}
                className="bg-accent hover:bg-accent-dark text-white flex items-center justify-center gap-2 text-sm sm:text-base px-6 py-3 md:px-8 md:py-4"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="text-xs sm:text-sm md:text-base">Unduh Resume</span>
              </MagneticButton>
              
              <MagneticButton
                onClick={() => scrollToSection('portfolio')}
                className="border-2 border-red-500 text-white hover:bg-red-500/10 flex items-center justify-center gap-2 relative text-sm sm:text-base px-6 py-3 md:px-8 md:py-4"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs sm:text-sm md:text-base">Lihat Karya</span>
              </MagneticButton>
            </motion.div>

            {/* Social Media Icons */}
            <motion.div
              className="flex gap-3 md:gap-4 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
            >
              {[
                { icon: '💼', label: 'LinkedIn', url: profile?.linkedinUrl },
                { icon: '📷', label: 'Instagram', url: profile?.instagramUrl },
                { icon: '💻', label: 'GitHub', url: profile?.githubUrl },
                { icon: '👤', label: 'Facebook', url: profile?.facebookUrl },
              ].filter(social => social.url).map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 + i * 0.1 }}
                >
                  <span className="text-base sm:text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Profile Card */}
          <motion.div
            className="relative order-1 md:order-2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
              {/* Profile Picture Card */}
              <motion.div
                className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-white/20 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
                  {profile?.formalPhoto?.url ? (
                    <img src={profile.formalPhoto.url} alt={profile.name || 'Profile'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl sm:text-8xl">👨‍💼</div>
                  )}
                </div>
              </motion.div>

              {/* Stats Badges */}
              <motion.div
                className="absolute -top-3 sm:-top-4 left-2 sm:left-4 bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-xl sm:text-2xl font-bold">{profile?.projectsCompleted || 15}+</div>
                <div className="text-[10px] sm:text-xs">Proyek Selesai</div>
              </motion.div>

              <motion.div
                className="absolute -bottom-3 sm:-bottom-4 right-2 sm:right-4 bg-purple-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-xl sm:text-2xl font-bold">{profile?.yearsExperience || 2}+</div>
                <div className="text-[10px] sm:text-xs">Tahun Pengalaman</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 hidden md:flex"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white/50 text-xs sm:text-sm">Scroll L</span>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
