import { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export const TypingText = ({ text, speed = 100, className = '' }: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  );
};

