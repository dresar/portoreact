import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export const SpotlightCard = ({ children, className = '' }: SpotlightCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(mouseX, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 500, damping: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            x: mouseXSpring,
            y: mouseYSpring,
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%)',
            left: -300,
            top: -300,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
