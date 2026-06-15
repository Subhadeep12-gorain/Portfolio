import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Animation variants for staggered content sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: 'easeOut',
    },
  }),
};

// Social links data
const socialLinks = [
  {
    label: 'GITHUB',
    href: 'https://github.com/Subhadeep12-gorain',
  },
  {
    label: 'LINKEDIN',
    href: 'https://linkedin.com/in/subhadeep-gorain',
  },
  {
    label: 'EMAIL',
    href: 'mailto:subhadeepgorain8@gmail.com',
  },
];

export function CinematicFooter() {
  const prefersReducedMotion = useReducedMotion();
  // When reduced motion is preferred, skip all animations
  const getAnimationProps = (delay = 0) => {
    if (prefersReducedMotion) {
      return { initial: { opacity: 1, y: 0 } };
    }
    return {
      variants: sectionVariants,
      initial: 'hidden',
      whileInView: 'visible',
      viewport: { once: true, margin: '-60px' },
      custom: delay,
    };
  };

  return (
    <footer className="relative w-full min-h-[35vh] flex items-center justify-center overflow-hidden">
      {/* ═══════ LAYER 0: Video Background ═══════ */}
      <motion.video
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/footer-night-1.mp4" type="video/mp4" />
      </motion.video>

      {/* ═══════ LAYER 1: Dark Gradient Overlay ═══════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 100%)',
        }}
      />

      {/* ═══════ LAYER 2: Footer Content ═══════ */}
      <div
        className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-6 py-12 gap-6"
        style={{ zIndex: 10 }}
      >
        {/* ── Top Section: Brand ── */}
        <motion.div
          {...getAnimationProps(0)}
          className="flex flex-col items-center gap-3 text-center"
        >
          <h2
            className="text-4xl md:text-6xl text-white tracking-[0.3em] uppercase"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            夜桜
          </h2>
          <p
            className="text-sm md:text-base italic"
            style={{
              fontFamily: "'EB Garamond', serif",
              color: 'rgba(251, 179, 193, 0.5)',
            }}
          >
            Sakura Nocturne — AI/ML Engineering Portfolio
          </p>
        </motion.div>

        {/* ── Middle Section: Social Links ── */}
        <motion.nav
          {...getAnimationProps(0.15)}
          className="flex items-center gap-4 md:gap-6 flex-wrap justify-center"
          aria-label="Social links"
        >
          {socialLinks.map((link, index) => (
            <React.Fragment key={link.label}>
              {index > 0 && (
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: 'rgba(251, 179, 193, 0.25)' }}
                  aria-hidden="true"
                />
              )}
              <a
                href={link.href}
                target={link.label !== 'EMAIL' ? '_blank' : undefined}
                rel={link.label !== 'EMAIL' ? 'noopener noreferrer' : undefined}
                className="group relative text-sm tracking-[0.2em] uppercase cursor-pointer transition-colors duration-300"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: 'rgba(251, 179, 193, 0.6)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(251, 179, 193, 1.0)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(251, 179, 193, 0.6)';
                }}
              >
                {link.label}
                {/* Hover underline */}
                <span
                  className="absolute left-0 -bottom-1 w-full h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                  style={{ backgroundColor: 'rgba(251, 179, 193, 0.8)' }}
                />
              </a>
            </React.Fragment>
          ))}
        </motion.nav>

        {/* ── Bottom Section: Copyright ── */}
        <motion.p
          {...getAnimationProps(0.3)}
          className="text-xs text-center"
          style={{
            fontFamily: "'Manrope', sans-serif",
            color: 'rgba(255, 255, 255, 0.25)',
          }}
        >
          © 2026 Subhadeep Gorain. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
}

export default CinematicFooter;
