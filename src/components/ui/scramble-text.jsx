import { motion } from 'framer-motion';

/**
 * ScrambleText — Word-by-word slide & fade reveal.
 *
 * Each word slides in from the right and fades into position sequentially,
 * fitting naturally into the paragraph lines. Uses Framer Motion stagger.
 *
 * Props:
 *   text    — the full paragraph string
 *   trigger — boolean (tied to useInView) — true = reveal, false = reset
 *   delay   — seconds before the first word starts animating
 *   className — applied to the wrapping <p> element
 */

const containerVariants = (delay) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.048,
      delayChildren: delay,
    },
  },
});

const wordVariants = {
  hidden: { opacity: 0, x: 14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

export function ScrambleText({ text, trigger, delay = 0, className = '' }) {
  const words = text.split(' ');

  return (
    <motion.p
      className={className}
      variants={containerVariants(delay)}
      initial="hidden"
      animate={trigger ? 'visible' : 'hidden'}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}
