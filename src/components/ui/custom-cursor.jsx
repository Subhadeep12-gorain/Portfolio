import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor — Expanding ring cursor
 * - Small rose dot tracks cursor exactly
 * - Larger ring follows with spring lag
 * - Ring expands on hover over interactive elements
 * - Hidden on touch/mobile devices
 */
export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTouchDevice] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(hover: none)').matches;
    }
    return false;
  });

  // Raw cursor position (dot follows instantly)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Ring follows with a very tight spring — barely perceptible magnetic lag
  const springConfig = { damping: 40, stiffness: 600, mass: 0.15 };
  const ringX = useSpring(dotX, springConfig);
  const ringY = useSpring(dotY, springConfig);

  useEffect(() => {
    // Detect touch device
    if (isTouchDevice) {
      return;
    }

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [tabindex], .cursor-pointer';

    const onMouseMove = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      setIsVisible(true);

      // Check if hovering over interactive element
      const target = e.target.closest(INTERACTIVE);
      setIsExpanded(!!target);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [dotX, dotY, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Outer ring — lags behind, expands on interactive hover */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 99999,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          width: isExpanded ? 56 : 36,
          height: isExpanded ? 56 : 36,
          borderColor: isExpanded
            ? 'rgba(251, 179, 193, 0.7)'
            : 'rgba(251, 179, 193, 0.4)',
          backgroundColor: isExpanded
            ? 'rgba(251, 179, 193, 0.06)'
            : 'transparent',
        }}
        transition={{
          opacity: { duration: 0.2 },
          width: { type: 'spring', stiffness: 250, damping: 22 },
          height: { type: 'spring', stiffness: 250, damping: 22 },
          borderColor: { duration: 0.25 },
          backgroundColor: { duration: 0.25 },
        }}
        className="rounded-full border"
      />

      {/* Inner dot — follows exactly */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 99999,
          pointerEvents: 'none',
          willChange: 'transform',
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: 'rgba(251, 179, 193, 0.9)',
          boxShadow: '0 0 8px rgba(251, 179, 193, 0.6)',
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}

export default CustomCursor;
