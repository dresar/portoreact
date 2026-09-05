import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface TextTypeProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  pauseTime?: number;
  className?: string;
  cursor?: string;
  cursorBlink?: boolean;
}

export const TextType = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  delay = 0,
  pauseTime = 2000,
  className = '',
  cursor = '|',
  cursorBlink = true,
}: TextTypeProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!textRef.current || texts.length === 0) return;

    // Clean up previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const timeline = gsap.timeline({ repeat: -1, delay });

    const typeText = (text: string, index: number) => {
      const element = textRef.current;
      if (!element) return;

      // Set initial state
      element.textContent = '';

      // Type each character
      const chars = text.split('');
      chars.forEach((_, charIndex) => {
        timeline.call(
          () => {
            if (element) {
              element.textContent = text.slice(0, charIndex + 1);
            }
          },
          undefined,
          charIndex * (speed / 1000)
        );
      });

      // Pause after typing complete
      timeline.to({}, { duration: pauseTime / 1000 });

      // Delete text (only if there are multiple texts or not the last one)
      if (texts.length > 1 && index < texts.length - 1) {
        for (let i = text.length; i >= 0; i--) {
          timeline.call(
            () => {
              if (element) {
                element.textContent = text.slice(0, i);
              }
            },
            undefined,
            (text.length - i) * (deleteSpeed / 1000)
          );
        }
        // Short pause before next text
        timeline.to({}, { duration: 300 / 1000 });
      }
    };

    // Type all texts in sequence
    texts.forEach((text, index) => {
      typeText(text, index);
    });

    timelineRef.current = timeline;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [texts, speed, deleteSpeed, delay, pauseTime]);

  // Cursor blink animation
  useEffect(() => {
    if (!cursorRef.current || !cursorBlink) return;

    const cursorTimeline = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });

    return () => {
      cursorTimeline.kill();
    };
  }, [cursorBlink]);

  return (
    <span className={`inline-block ${className}`}>
      <span ref={textRef} className="inline-block"></span>
      {cursor && (
        <span
          ref={cursorRef}
          className="inline-block ml-1 text-primary"
          style={{ opacity: 1 }}
        >
          {cursor}
        </span>
      )}
    </span>
  );
};

