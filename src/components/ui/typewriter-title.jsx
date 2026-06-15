import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * TypewriterTitle
 * 
 * Renders a two-part animated heading:
 *  1. "Technical" — typed letter-by-letter with a blinking cursor
 *  2. "Mastery"  — fades in with a shimmer sweep after typing completes
 * 
 * Triggered once when the component scrolls into view.
 */
export const TypewriterTitle = ({ speed = 100, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useTranslation();

  const word = t('tech.title1');
  const [displayedCount, setDisplayedCount] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [shimmerDone, setShimmerDone] = useState(false);

  // Start typing when in view
  useEffect(() => {
    if (!isInView) return;

    if (displayedCount < word.length) {
      const timeout = setTimeout(() => {
        setDisplayedCount((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!typingDone) {
      // Small pause before revealing "Mastery"
      const pause = setTimeout(() => setTypingDone(true), 300);
      return () => clearTimeout(pause);
    } else {
      // Wait for reading time, then reset to loop the animation
      const restart = setTimeout(() => {
        setDisplayedCount(0);
        setTypingDone(false);
        setShimmerDone(false);
      }, 4000);
      return () => clearTimeout(restart);
    }
  }, [isInView, displayedCount, typingDone, speed, word.length]);

  // Hide cursor after shimmer animation completes
  useEffect(() => {
    if (!typingDone) return;
    // Shimmer sweep duration is 1.2s, then settle
    const timer = setTimeout(() => setShimmerDone(true), 1400);
    return () => clearTimeout(timer);
  }, [typingDone]);

  return (
    <h2 ref={ref} className={`font-serif text-[2.2rem] md:text-[3.5rem] font-normal text-left text-white mb-8 ${className}`}>
      {/* "Technical" — letter-by-letter reveal */}
      <span className="inline-block">
        {word.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={i < displayedCount ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.04 }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </span>

      {/* Blinking cursor */}
      {!shimmerDone && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'loop',
            times: [0, 0.5, 0.5, 1],
          }}
          className="inline-block w-[3px] h-[0.85em] bg-white ml-1 align-middle rounded-sm"
          style={{ verticalAlign: 'baseline', marginBottom: '0.05em' }}
        />
      )}

      <br />

      {/* "Mastery" — shimmer sweep + persistent glow */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={typingDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`italic text-white inline-block font-serif text-[2.2rem] md:text-[3.5rem] font-normal mastery-shimmer ${typingDone ? 'mastery-shimmer-active' : ''} ${shimmerDone ? 'mastery-shimmer-settled' : ''}`}
      >
        {t('tech.title2')}
      </motion.span>
    </h2>
  );
};
