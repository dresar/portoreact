import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const MagneticButton = ({
  children,
  className = '',
  onClick,
  type = 'button',
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    const maxDistance = 100;

    if (distance < maxDistance) {
      x.set(distanceX * 0.3);
      y.set(distanceY * 0.3);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative px-8 py-4 rounded-lg font-semibold overflow-hidden transition-colors ${className}`}
      style={{
        x: mouseXSpring,
        y: mouseYSpring,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {className.includes('bg-') ? null : (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </motion.button>
  );
};

