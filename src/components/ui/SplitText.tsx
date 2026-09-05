import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export const SplitText = ({ children, className = '', delay = 0 }: SplitTextProps) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const words = children.split(' ');

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.span className="inline-block">
        {words.map((word, i) => (
          <span key={i} className="inline-block mr-2">
            {word.split('').map((char, j) => (
              <motion.span
                key={j}
                className="inline-block"
                initial={{ y: 100, opacity: 0 }}
                animate={
                  isInView
                    ? {
                        y: 0,
                        opacity: 1,
                      }
                    : {}
                }
                transition={{
                  delay: delay + i * 0.05 + j * 0.02,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </div>
  );
};

