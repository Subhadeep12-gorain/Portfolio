import { motion } from 'framer-motion';

/**
 * SplitHeading — wraps a heading string so each character
 * floats up 2–3px with a stagger when the heading is hovered.
 * Use as a drop-in wrapper around any heading text.
 *
 * Usage:
 *   <SplitHeading className="font-serif text-4xl text-white">
 *     My Heading
 *   </SplitHeading>
 */

const containerVariants = {
  rest: {},
  hover: {
    transition: { staggerChildren: 0.022, delayChildren: 0 }
  }
};

const charVariants = {
  rest: { y: 0 },
  hover: {
    y: -3,
    transition: { type: 'spring', stiffness: 500, damping: 18, mass: 0.5 }
  }
};

export function SplitHeading({ children, className, style }) {
  const text = String(children);
  // Split into words — each word is a non-breaking inline-block unit
  // Words wrap normally between each other (standard word-wrap)
  // Chars within a word never break across lines
  const words = text.split(' ');

  return (
    <motion.span
      variants={containerVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={className}
      style={{ display: 'inline', cursor: 'default', ...style }}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          {word.split('').map((char, ci) => (
            <motion.span
              key={ci}
              variants={charVariants}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
          {/* Space between words — as a separate inline-block so it doesn't collapse */}
          {wi < words.length - 1 && (
            <motion.span
              variants={charVariants}
              style={{ display: 'inline-block' }}
            >
              &nbsp;
            </motion.span>
          )}
        </span>
      ))}
    </motion.span>
  );
}

export default SplitHeading;
