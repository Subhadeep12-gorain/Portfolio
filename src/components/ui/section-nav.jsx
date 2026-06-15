import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { id: 'hero',      label: 'Hero',              target: null },      // scrolls to top
  { id: 'mastery',   label: 'Technical Mastery', target: 'mastery' },
  { id: 'projects',  label: 'Projects',          target: 'projects' },
  { id: 'about',     label: 'About Me',          target: 'about' },
  { id: 'skills',    label: 'Skills',            target: 'skills' },
  { id: 'experience',label: 'Journey',           target: 'experience' },
  { id: 'contact',   label: 'Contact',           target: 'contact' },
];

export function SectionNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredDot, setHoveredDot] = useState(null);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers = [];
    const sectionEls = [];

    // Watch hero (top of page — special case)
    const heroObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActiveSection('hero'); },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    const heroEl = document.getElementById('hero-section');
    if (heroEl) { heroObserver.observe(heroEl); observers.push(heroObserver); }

    // Watch remaining sections
    SECTIONS.slice(1).forEach(({ id, target }) => {
      const el = document.getElementById(target);
      if (!el) return;
      sectionEls.push({ id, el });

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const handleClick = useCallback((section) => {
    if (!section.target) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(section.target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-[9000] hidden md:flex flex-col items-center gap-4"
      style={{ pointerEvents: 'auto' }}
    >
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.id;
        const isHovered = hoveredDot === section.id;

        return (
          <div
            key={section.id}
            className="relative flex items-center justify-end"
            onMouseEnter={() => setHoveredDot(section.id)}
            onMouseLeave={() => setHoveredDot(null)}
          >
            {/* Section label tooltip — appears to the left of dot */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute right-6 whitespace-nowrap text-[9px] tracking-[0.18em] uppercase pointer-events-none select-none"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: isActive ? 'rgba(251,179,193,0.9)' : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* The dot */}
            <motion.button
              onClick={() => handleClick(section)}
              aria-label={`Navigate to ${section.label}`}
              animate={{
                width:  isActive ? 10 : 6,
                height: isActive ? 10 : 6,
                backgroundColor: isActive
                  ? 'rgba(251,179,193,0.95)'
                  : isHovered
                    ? 'rgba(251,179,193,0.55)'
                    : 'rgba(255,255,255,0.22)',
                boxShadow: isActive
                  ? '0 0 10px rgba(251,179,193,0.6), 0 0 20px rgba(251,179,193,0.25)'
                  : 'none',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{
                borderRadius: '50%',
                border: 'none',
                outline: 'none',
                cursor: 'none',
                flexShrink: 0,
                display: 'block',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default SectionNav;
