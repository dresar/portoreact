import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

export const DecryptedText = ({ text, className = '', delay = 0 }: DecryptedTextProps) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let iteration = 0;
    const interval = setTimeout(() => {
      const intervalId = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((_, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(intervalId);
        }

        iteration += 1 / 3;
      }, 30);

      return () => clearInterval(intervalId);
    }, delay * 1000);

    return () => clearTimeout(interval);
  }, [text, delay]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText || text}
    </motion.span>
  );
};

