import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device is mobile/touch
    const checkMobile = () => {
      const mobile = window.matchMedia('(pointer: coarse)').matches || 
                    window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(mobile);
      return mobile;
    };
    
    const isMobileDevice = checkMobile();
    if (isMobileDevice) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Add hover listeners to interactive elements
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', checkMobile);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-white"
          animate={{
            scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <div className="w-full h-full rounded-full bg-primary" />
      </motion.div>
    </>
  );
};

