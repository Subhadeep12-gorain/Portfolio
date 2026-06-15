import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSectionSnap } from './hooks/use-section-snap';
import { ReactLenis } from 'lenis/react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, useInView, useMotionTemplate, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { HeroSection } from './components/ui/hero-odyssey';
import IntroScreen from './components/ui/intro-screen';
import { GlobalWeatherManager } from './components/layout/global-weather-manager';
import { RainStreaks } from './components/ui/rain-streaks';
import { FogEllipses } from './components/ui/fog-ellipses';
import { ParticleConstellation } from './components/ui/particle-constellation';
import { TypewriterTitle } from './components/ui/typewriter-title';
import { ScrambleText } from './components/ui/scramble-text';
import { CustomCursor } from './components/ui/custom-cursor';
import { SectionNav } from './components/ui/section-nav';
import { SplitHeading } from './components/ui/split-heading';
import { ContactSection } from './components/ui/contact-section';
import './index.css';

const SkillsRedesign = lazy(() => import('./components/ui/skills-redesign'));
const ExperienceTimeline = lazy(() => import('./components/ui/experience-timeline'));
const CinematicFooter = lazy(() => import('./components/ui/cinematic-footer').then(m => ({ default: m.CinematicFooter })));
const TechOverlay = lazy(() => import('./components/ui/tech-overlay').then(m => ({ default: m.TechOverlay })));
const JapanMapVisual = lazy(() => import('./components/ui/bento-visuals').then(m => ({ default: m.JapanMapVisual })));
const PhoneAppVisual = lazy(() => import('./components/ui/bento-visuals').then(m => ({ default: m.PhoneAppVisual })));
const EcommerceVisual = lazy(() => import('./components/ui/bento-visuals').then(m => ({ default: m.EcommerceVisual })));
const GitHubHeatmapVisual = lazy(() => import('./components/ui/bento-visuals').then(m => ({ default: m.GitHubHeatmapVisual })));



// Possible entry directions for bento cards (random each time)
const BENTO_DIRS = [
  { x: -130, y: -90 },  // top-left
  { x: 130, y: -90 },   // top-right
  { x: -130, y: 90 },   // bottom-left
  { x: 130, y: 90 },    // bottom-right
  { x: 0, y: -140 },    // straight up
  { x: 0, y: 140 },     // straight down
  { x: -160, y: 0 },    // straight left
  { x: 160, y: 0 },     // straight right
];
const getRandomDir = () => BENTO_DIRS[Math.floor(Math.random() * BENTO_DIRS.length)];

// Shared hover state for all bento cards
const bentoHover = {
  scale: 1.05,
  borderColor: 'rgba(251, 179, 193, 0.6)',
  boxShadow: '0 0 40px rgba(251,179,193,0.28), 0 0 80px rgba(251,179,193,0.1)',
};

const MagneticCVCard = ({ children, className = "", themeHue, delay, style = {}, initialX = -30 }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);

  const rotateX = useSpring(useTransform(cardY, [-0.5, 0.5], [10, -10]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(cardX, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 150 });
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);

    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    cardX.set(x);
    cardY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
    cardX.set(0);
    cardY.set(0);
  };

  const background = useMotionTemplate`radial-gradient(circle 250px at ${mouseX}px ${mouseY}px, hsla(${themeHue}, 80%, 75%, 0.15), transparent)`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: initialX }}
      animate={{ opacity: 1, x: 0, transition: { delay, duration: 0.6, ease: 'easeOut' } }}
      exit={{ opacity: 0, x: initialX, transition: { duration: 0.4, ease: 'easeIn' } }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseMove}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl backdrop-blur-xl p-6 cursor-pointer ${className}`}
      style={{ 
        border: `1px solid hsla(${themeHue}, 70%, 65%, 0.18)`, 
        background: '#0a0f19cc',
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        ...style
      }}
    >
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ background, opacity: useTransform(mouseX, [-1000, 0], [0, 1]) }}
      />
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
};


const aboutContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2
    }
  }
};

const aboutItemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.25, 1, 0.5, 1]
    }
  }
};


const MobileProjectCard = ({ href, children, tags, title, desc, t, themeHue, github = false }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative overflow-hidden rounded-lg bg-surface-container-low border border-primary/10 block flex-shrink-0 bg-gradient-to-br from-surface-container to-surface"
      style={{ width: '280px', height: '300px' }}
    >
      {github && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <rect x="0.75" y="0.75" width="calc(100% - 1.5px)" height="calc(100% - 1.5px)" rx="8" ry="8" className="border-trace-rect" />
        </svg>
      )}
      {children}
      <div className="absolute bottom-0 left-0 p-5 w-full z-10" style={{ background: 'linear-gradient(to top, rgba(10,12,18,0.95) 0%, transparent 100%)' }}>
        {tags && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-full"
                style={{ color: `hsla(${themeHue}, 75%, 72%, 0.85)`, background: `hsla(${themeHue}, 70%, 65%, 0.09)`, border: `1px solid hsla(${themeHue}, 70%, 65%, 0.18)` }}>{tag}</span>
            ))}
          </div>
        )}
        <h4 className="font-body-lg text-body-lg" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>{title}</h4>
        {desc && <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-xs leading-relaxed">{desc}</p>}
        <div className="mt-2">
          <span className="font-label-sm text-[10px] tracking-wider flex items-center gap-1" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>
            {github ? t('projects.github_activity') : t('projects.view_project')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </div>
      </div>
    </a>
  );
};

function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'jp' : 'en');
  };

  const [introDone, setIntroDone] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [themeHue] = useState(() => {
    const APPROVED_HUES = [170, 195, 220, 250, 275, 25, 45];
    return APPROVED_HUES[Math.floor(Math.random() * APPROVED_HUES.length)];
  });



  // -- Scroll to Top State
  const { scrollYProgress } = useScroll();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.85) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  });



  const aboutRef = useRef(null);
  const technicalMasteryRef = useRef(null);
  const isTechMasteryInView = useInView(technicalMasteryRef, { margin: "-10% 0px" });

  const techVideoRef = useRef(null);
  useEffect(() => {
    if (techVideoRef.current) {
      if (isTechMasteryInView) {
        techVideoRef.current.play().catch(() => {});
      } else {
        techVideoRef.current.pause();
      }
    }
  }, [isTechMasteryInView]);

  // Bento section: replay animation every time, with random directions
  const bentoRef = useRef(null);
  const isBentoInView = useInView(bentoRef, { once: false, margin: '-10% 0px' });
  const [hoveredBento, setHoveredBento] = useState(null);
  const [cardDirs, setCardDirs] = useState(() => [
    getRandomDir(), getRandomDir(), getRandomDir(), getRandomDir()
  ]);
  useEffect(() => {
    if (isBentoInView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCardDirs([getRandomDir(), getRandomDir(), getRandomDir(), getRandomDir()]);
    }
  }, [isBentoInView]);

  // About Me Section Interactive Lighting & Parallax
  const aboutMouseX = useMotionValue(600);
  const aboutMouseY = useMotionValue(400);

  const aboutSpringConfig = { damping: 50, stiffness: 200, mass: 1 };
  const aboutSmoothX = useSpring(aboutMouseX, aboutSpringConfig);
  const aboutSmoothY = useSpring(aboutMouseY, aboutSpringConfig);

  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [isCvExpanded, setIsCvExpanded] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Initialize mouse coordinates to the center of the about container on mount
  useEffect(() => {
    if (aboutRef.current) {
      const rect = aboutRef.current.getBoundingClientRect();
      aboutMouseX.set(rect.width / 2);
      aboutMouseY.set(rect.height / 2);
    }
  }, [aboutMouseX, aboutMouseY]);

  const handleAboutMouseMove = (e) => {
    if (!aboutRef.current) return;
    const rect = aboutRef.current.getBoundingClientRect();
    aboutMouseX.set(e.clientX - rect.left);
    aboutMouseY.set(e.clientY - rect.top);
  };

  const handleAboutMouseEnter = () => {
    setIsAboutHovered(true);
  };

  const handleAboutMouseLeave = () => {
    setIsAboutHovered(false);
    // Smoothly reset spotlight/parallax to the center of the container
    if (aboutRef.current) {
      const rect = aboutRef.current.getBoundingClientRect();
      aboutMouseX.set(rect.width / 2);
      aboutMouseY.set(rect.height / 2);
    }
  };

  // Kanji Parallax Offsets based on dynamic container dimensions (Dramatized Multipliers)
  const kanji1X = useTransform(aboutSmoothX, (x) => {
    const w = aboutRef.current?.offsetWidth || 1200;
    return ((x / w) - 0.5) * -400;
  });
  const kanji1Y = useTransform(aboutSmoothY, (y) => {
    const h = aboutRef.current?.offsetHeight || 800;
    return ((y / h) - 0.5) * -450;
  });

  const kanji2X = useTransform(aboutSmoothX, (x) => {
    const w = aboutRef.current?.offsetWidth || 1200;
    return ((x / w) - 0.5) * 450;
  });
  const kanji2Y = useTransform(aboutSmoothY, (y) => {
    const h = aboutRef.current?.offsetHeight || 800;
    return ((y / h) - 0.5) * -350;
  });

  const kanji3X = useTransform(aboutSmoothX, (x) => {
    const w = aboutRef.current?.offsetWidth || 1200;
    return ((x / w) - 0.5) * -300;
  });
  const kanji3Y = useTransform(aboutSmoothY, (y) => {
    const h = aboutRef.current?.offsetHeight || 800;
    return ((y / h) - 0.5) * 400;
  });

  // Main Content Parallax Offsets (moves in opposite direction of Kanji for 3D stereoscopic depth effect)
  const contentX = useTransform(aboutSmoothX, (x) => {
    const w = aboutRef.current?.offsetWidth || 1200;
    return ((x / w) - 0.5) * 20;
  });
  const contentY = useTransform(aboutSmoothY, (y) => {
    const h = aboutRef.current?.offsetHeight || 800;
    return ((y / h) - 0.5) * 20;
  });

  const gridX = useTransform(aboutSmoothX, (x) => {
    const w = aboutRef.current?.offsetWidth || 1200;
    return ((x / w) - 0.5) * -150;
  });
  const gridY = useTransform(aboutSmoothY, (y) => {
    const h = aboutRef.current?.offsetHeight || 800;
    return ((y / h) - 0.5) * -150;
  });

  // Glassmorphic Card 3D Tilt Values
  const cardRef = useRef(null);
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardRotateX = useSpring(useTransform(cardY, [-0.5, 0.5], [10, -10]), { damping: 20, stiffness: 150 });
  const cardRotateY = useSpring(useTransform(cardX, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 150 });

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardX.set(x);
    cardY.set(y);
  };

  const handleCardMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Force scroll to top on mount/reload to ensure the reveal animation plays correctly
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }
  }, []);

  // Lock scroll while intro is active to prevent scrolling past the hero
  useEffect(() => {
    if (!introDone) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [introDone]);

  // firstvillage-style section snap (skip bento — it free-scrolls)
  useSectionSnap({ freeScrollIds: ['projects'] });

  return (
    <ReactLenis root>
      <div className="antialiased selection:bg-primary-container selection:text-on-primary-container dark text-on-surface bg-transparent overflow-x-hidden w-full max-w-[100vw]">
      
      {/* ====== Global Background Weather ====== */}
      <GlobalWeatherManager />

      {/* ====== Custom Cursor ====== */}
      <CustomCursor />

      {/* ====== Section Dot Navigation (right side) ====== */}
      <SectionNav />

      {/* ====== Unified Intro Screen ====== */}
      <AnimatePresence>
        {!introDone && (
          <IntroScreen
            key="intro-screen"
            themeHue={themeHue}
            onComplete={() => setIntroDone(true)}
          />
        )}
      </AnimatePresence>

      {/* ====== Top Navigation — floating pill style (fades and scales with landing page) ====== */}
      <motion.nav
        style={{
          opacity: introDone ? 1 : 0,
          scale: introDone ? 1 : 0.95,
          pointerEvents: introDone ? 'auto' : 'none',
          willChange: "transform, opacity"
        }}
        className="fixed top-5 left-1/2 -translate-x-1/2 flex justify-between items-center gap-6 md:gap-10 px-6 h-11 z-50 rounded-full bg-black/50 backdrop-blur-xl border border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all ease-in-out duration-700 hidden md:flex"
      >
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-serif text-xs tracking-[0.25em] text-primary uppercase cursor-pointer hover:opacity-80 transition-opacity"
        >
          夜桜
        </div>
        <ul className="flex gap-6 font-label-sm text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/85">
          <li onClick={() => scrollToSection('projects')} className="cursor-pointer hover:text-primary transition-colors duration-300">{t('nav.projects')}</li>
          <li onClick={() => scrollToSection('about')} className="cursor-pointer hover:text-primary transition-colors duration-300">{t('nav.about')}</li>
          <li onClick={() => scrollToSection('skills')} className="cursor-pointer hover:text-primary transition-colors duration-300">{t('nav.skills')}</li>
          <li onClick={() => scrollToSection('contact')} className="cursor-pointer hover:text-primary transition-colors duration-300">{t('nav.contact', 'Contact')}</li>
        </ul>
        <div 
          onClick={toggleLanguage}
          className="cursor-pointer text-xs flex items-center gap-1 hover:text-primary transition-colors duration-300 ml-2 border-l border-white/10 pl-4"
        >
          <span className={`transition-opacity duration-300 ${i18n.language === 'en' ? 'text-white' : 'text-white/40'}`}>EN</span>
          <span className="text-white/20">/</span>
          <span className={`font-serif transition-opacity duration-300 ${i18n.language === 'jp' ? 'text-white' : 'text-white/40'}`}>日本語</span>
        </div>
      </motion.nav>

      {/* ====== Mobile Top Navigation (Expanding Pill) ====== */}
      <motion.nav
        layout
        style={{
          opacity: introDone ? 1 : 0,
          pointerEvents: introDone ? 'auto' : 'none'
        }}
        className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center justify-between px-5 h-11 z-50 rounded-full bg-black/60 backdrop-blur-xl border border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.4)] md:hidden overflow-hidden"
      >
        <motion.div
          layout="position"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="font-serif text-[11px] tracking-[0.2em] text-primary uppercase cursor-pointer flex-shrink-0 flex items-center gap-2"
        >
          <span>夜桜</span>
          <motion.span 
            animate={{ rotate: isMobileMenuOpen ? 180 : 0 }} 
            className="text-[7px] text-white/40"
          >
            ▼
          </motion.span>
        </motion.div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.ul
              initial={{ opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0 }}
              animate={{ opacity: 1, width: "auto", paddingLeft: 12, paddingRight: 12 }}
              exit={{ opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0 }}
              className="flex items-center gap-3.5 font-label-sm text-[8px] uppercase tracking-[0.1em] text-on-surface-variant/85 whitespace-nowrap overflow-hidden"
            >
              <li onClick={() => { setIsMobileMenuOpen(false); scrollToSection('projects'); }} className="cursor-pointer hover:text-primary transition-colors">{t('nav.projects')}</li>
              <li onClick={() => { setIsMobileMenuOpen(false); scrollToSection('about'); }} className="cursor-pointer hover:text-primary transition-colors">{t('nav.about')}</li>
              <li onClick={() => { setIsMobileMenuOpen(false); scrollToSection('skills'); }} className="cursor-pointer hover:text-primary transition-colors">{t('nav.skills')}</li>
              <li onClick={() => { setIsMobileMenuOpen(false); scrollToSection('contact'); }} className="cursor-pointer hover:text-primary transition-colors">{t('nav.contact', 'Contact')}</li>
            </motion.ul>
          )}
        </AnimatePresence>

        <motion.div 
          layout="position"
          onClick={toggleLanguage}
          className="cursor-pointer text-[9px] flex items-center gap-1 hover:text-primary transition-colors border-l border-white/10 pl-3 ml-auto flex-shrink-0"
        >
          <span className={`transition-opacity duration-300 ${i18n.language === 'en' ? 'text-white' : 'text-white/40'}`}>EN</span>
          <span className="text-white/20">/</span>
          <span className={`font-serif transition-opacity duration-300 ${i18n.language === 'jp' ? 'text-white' : 'text-white/40'}`}>日本語</span>
        </motion.div>
      </motion.nav>

      {/* ====== SECTION 1: Hero ====== */}
      <div id="hero-section" data-snap-section className="relative w-full" style={{ height: '100vh', minHeight: '100vh' }}>
        <HeroSection themeHue={themeHue} onExploreClick={() => scrollToSection('projects')} />
      </div>

      {/* ====== SECTION 2: Technical Mastery / Introduction ====== */}
      <div id="mastery" data-snap-section ref={technicalMasteryRef} className="py-section-gap" style={{ position: 'relative', backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
        {/* Rain Streaks — capped at 0.15 per vision doc */}
        <motion.div
          style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
          animate={isTechMasteryInView ? { opacity: 0.15 } : { opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          {isTechMasteryInView && (
            <Suspense fallback={null}>
              <RainStreaks />
            </Suspense>
          )}
        </motion.div>

        {/* Subtle readability layer */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1, pointerEvents: 'none' }} />

        <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4" style={{ position: 'relative', zIndex: 10 }}>
          {/* Introduction Section — 12-col grid */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">

            {/* ── Left column ──────────────────────────────────────── */}
            <div className="md:col-span-5 md:col-start-2">
              {/* Title — left-aligned, blurs in when in view */}
              <motion.div
                initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                animate={isTechMasteryInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 30, filter: 'blur(12px)' }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              >
                <TypewriterTitle speed={100} key={t('tech.title1')} />
              </motion.div>

              {/* Paragraph 1 — ScrambleText */}
              <ScrambleText
                text={t('tech.p1')}
                trigger={isTechMasteryInView}
                delay={0.4}
                className="font-body-md text-body-md text-on-surface-variant mb-4 mt-4"
              />

              {/* Paragraph 2 — ScrambleText staggered */}
              <ScrambleText
                text={t('tech.p2')}
                trigger={isTechMasteryInView}
                delay={0.8}
                className="font-body-md text-body-md text-on-surface-variant mb-6"
              />

              {/* CV Button */}
              <motion.button
                onClick={() => setIsCvExpanded(!isCvExpanded)}
                initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                animate={isTechMasteryInView ? { y: 0, opacity: 1, filter: 'blur(0px)' } : { y: 30, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 1, 0.5, 1] }}
                className="text-primary font-label-sm text-label-sm uppercase tracking-widest btn-glow-underline pb-1 inline-flex items-center gap-2 mb-8"
                style={{ color: `hsl(${themeHue}, 80%, 72%)` }}
              >
                <span>{t('tech.viewCv')}</span>
                <motion.span
                  animate={{ rotate: isCvExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {isCvExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">

                      {/* Education Card */}
                      <MagneticCVCard themeHue={themeHue} delay={0.1} initialX={-40}>
                        <span className="block font-label-sm text-[0.65rem] tracking-[0.2em] mb-3 uppercase"
                          style={{ color: `hsla(${themeHue}, 70%, 65%, 0.55)` }}>{t('cv.education')}</span>
                        <span className="font-serif text-[1.2rem] text-white">{t('cv.degree')}</span>
                      </MagneticCVCard>

                      {/* Core Stack Card */}
                      <MagneticCVCard themeHue={themeHue} delay={0.2} initialX={40}>
                        <span className="block font-label-sm text-[0.65rem] tracking-[0.2em] mb-3 uppercase"
                          style={{ color: `hsla(${themeHue}, 70%, 65%, 0.55)` }}>{t('cv.coreStack')}</span>
                        <div className="flex flex-wrap gap-2">
                          {['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'CatBoost'].map((tech, i) => (
                            <span key={i} className="px-3 py-1 text-[11px] font-mono tracking-wide rounded-full"
                              style={{
                                color: `hsla(${themeHue}, 80%, 78%, 0.92)`,
                                background: `hsla(${themeHue}, 70%, 65%, 0.09)`,
                                border: `1px solid hsla(${themeHue}, 70%, 65%, 0.22)`,
                              }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </MagneticCVCard>

                      {/* Key Projects Card */}
                      <MagneticCVCard className="md:col-span-2" themeHue={themeHue} delay={0.3} initialX={-40}>
                        <span className="block font-label-sm text-[0.65rem] tracking-[0.2em] mb-4 uppercase"
                          style={{ color: `hsla(${themeHue}, 70%, 65%, 0.55)` }}>{t('cv.keyProjects')}</span>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 pl-4" style={{ borderLeft: `2px solid hsla(${themeHue}, 70%, 65%, 0.35)` }}>
                            <h4 className="font-serif text-[1.1rem] text-white">{t('cv.project1')}</h4>
                          </div>
                          <div className="flex-1 pl-4" style={{ borderLeft: `2px solid hsla(${themeHue}, 70%, 65%, 0.35)` }}>
                            <h4 className="font-serif text-[1.1rem] text-white">{t('cv.project2')}</h4>
                          </div>
                        </div>
                      </MagneticCVCard>

                      {/* Summary Card */}
                      <MagneticCVCard className="md:col-span-2" themeHue={themeHue} delay={0.4} initialX={40} style={{ background: `linear-gradient(135deg, hsla(${themeHue}, 60%, 55%, 0.07), #0a0f19cc)` }}>
                        <span className="font-serif italic text-[1.25rem] relative z-10 tracking-wide"
                          style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>
                          {t('cv.summary')}
                        </span>
                      </MagneticCVCard>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right column — video panel ────────────────────────── */}
            <motion.div
              className="md:col-span-5 md:col-start-8 relative mt-12 md:mt-0"
              initial={{ x: 80, opacity: 0, filter: 'blur(12px)' }}
              animate={
                isTechMasteryInView
                  ? { x: 0, opacity: 1, filter: 'blur(0px)' }
                  : { x: 80, opacity: 0, filter: 'blur(12px)' }
              }
              transition={{ type: 'spring', stiffness: 65, damping: 18, delay: 0.85 }}
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden relative bloom-glow sakura-vignette">
                <video
                  ref={techVideoRef}
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="/videos/15707984_1080_1920_30fps.mp4"
                />
                {isTechMasteryInView && (
                  <Suspense fallback={null}>
                    <TechOverlay />
                  </Suspense>
                )}
                <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-lg z-20"></div>
              </div>
            </motion.div>

          </section>
        </main>
      </div>

      {/* ====== SECTION 3: Bento Projects ====== */}
      {/* No snap — free scroll zone; snap resumes at next section */}
      <div id="bento-wrapper" style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'transparent' }}>
        <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
          {/* Bento Gallery Grid */}
          <section id="projects" className="mb-section-gap relative">

            {/* The "Cinematic Focus" header */}
            <div className="text-center mb-8 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 pointer-events-none -translate-y-20 z-0"
                style={{ background: `radial-gradient(ellipse at top, hsla(${themeHue}, 70%, 65%, 0.04) 0%, transparent 70%)` }} />

              <motion.span
                initial={{ opacity: 0, x: -60, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: false, margin: "-60px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[0.65rem] tracking-[0.2em] uppercase mb-3 block relative z-10 text-center"
                style={{ color: `hsla(${themeHue}, 70%, 72%, 0.55)` }}
              >
                {t('projects.section_label')}
              </motion.span>
              <motion.h3
                initial={{ opacity: 0, x: 60, filter: "blur(15px)", scale: 1.05 }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)", scale: 1 }}
                viewport={{ once: false, margin: "-60px" }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="font-headline-lg text-[1.8rem] md:text-[2.6rem] text-white font-light tracking-wide relative z-10 text-center"
              >
                <SplitHeading>{t('projects.title')}</SplitHeading>
              </motion.h3>
            </div>

            {/* Desktop Bento grid */}
            <div ref={bentoRef} className="hidden md:block">
              <Suspense fallback={null}>
                <div
                  className="grid grid-cols-4 gap-6 auto-rows-[300px] relative z-10"
                >
              {/* ── Card 1: Japan Tourism Demand Forecasting ── */}
              <motion.a
                href="https://github.com/Subhadeep12-gorain/japan-tourism-forecasting"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: cardDirs[0].x, y: cardDirs[0].y, scale: 0.9 }}
                animate={isBentoInView
                  ? { opacity: 1, x: 0, y: 0, scale: 1 }
                  : { opacity: 0, x: cardDirs[0].x, y: cardDirs[0].y, scale: 0.9 }
                }
                transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0 }}
                whileHover={bentoHover}
                onMouseEnter={() => setHoveredBento(1)}
                onMouseLeave={() => setHoveredBento(null)}
                style={{ zIndex: 1 }}
                className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-lg bg-surface-container-low border border-primary/10 cursor-pointer block"
              >
                {/* <JapanMapVisual isInView={true} /> */}
                <JapanMapVisual isHovered={hoveredBento === 1} />
                <div className="absolute bottom-0 left-0 p-8 w-full z-10 transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-all duration-500" style={{ background: 'linear-gradient(to top, rgba(10,12,18,0.9) 0%, transparent 100%)' }}>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['Python', 'Pandas', 'XGBoost', 'Time-Series'].map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-full"
                        style={{ color: `hsla(${themeHue}, 75%, 72%, 0.85)`, background: `hsla(${themeHue}, 70%, 65%, 0.09)`, border: `1px solid hsla(${themeHue}, 70%, 65%, 0.18)` }}>{tag}</span>
                    ))}
                  </div>
                  <h4 className="font-headline-md text-headline-md" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>{t('projects.p1_title')}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm leading-relaxed opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{t('projects.p1_desc')}</p>
                  <div className="mt-3 opacity-100 md:opacity-0 group-hover:opacity-100 transform translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <span className="font-label-sm text-xs tracking-wider flex items-center gap-1" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>
                      {t('projects.view_project')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </motion.a>

              {/* ── Card 2: NoteApp (React Native) ── */}
              <motion.a
                href="https://github.com/Subhadeep12-gorain/NoteApp"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: cardDirs[1].x, y: cardDirs[1].y, scale: 0.9 }}
                animate={isBentoInView
                  ? { opacity: 1, x: 0, y: 0, scale: 1 }
                  : { opacity: 0, x: cardDirs[1].x, y: cardDirs[1].y, scale: 0.9 }
                }
                transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.08 }}
                whileHover={bentoHover}
                onMouseEnter={() => setHoveredBento(2)}
                onMouseLeave={() => setHoveredBento(null)}
                style={{ zIndex: 1 }}
                className="md:col-span-1 md:row-span-2 group relative overflow-hidden rounded-lg bg-surface-container-low border border-primary/10 cursor-pointer block"
              >
                {/* <PhoneAppVisual /> */}
                <PhoneAppVisual isHovered={hoveredBento === 2} />
                <div className="absolute bottom-0 left-0 p-6 w-full z-10 transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-all duration-500" style={{ background: 'linear-gradient(to top, rgba(10,12,18,0.95) 0%, transparent 100%)' }}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['React Native', 'Expo', 'AsyncStorage'].map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-full"
                        style={{ color: `hsla(${themeHue}, 75%, 72%, 0.85)`, background: `hsla(${themeHue}, 70%, 65%, 0.09)`, border: `1px solid hsla(${themeHue}, 70%, 65%, 0.18)` }}>{tag}</span>
                    ))}
                  </div>
                  <h4 className="font-body-lg text-body-lg" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>{t('projects.p3_title')}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-xs leading-relaxed opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{t('projects.p3_desc')}</p>
                  <div className="mt-3 opacity-100 md:opacity-0 group-hover:opacity-100 transform translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <span className="font-label-sm text-xs tracking-wider flex items-center gap-1" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>
                      {t('projects.view_project')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </motion.a>

              {/* ── Card 3: Ecommerce Platform ── */}
              <motion.a
                href="https://github.com/Subhadeep12-gorain/Ecommerce-website-"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: cardDirs[2].x, y: cardDirs[2].y, scale: 0.9 }}
                animate={isBentoInView
                  ? { opacity: 1, x: 0, y: 0, scale: 1 }
                  : { opacity: 0, x: cardDirs[2].x, y: cardDirs[2].y, scale: 0.9 }
                }
                transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.16 }}
                whileHover={bentoHover}
                onMouseEnter={() => setHoveredBento(3)}
                onMouseLeave={() => setHoveredBento(null)}
                style={{ zIndex: 1 }}
                className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-lg bg-surface-container-low border border-primary/10 cursor-pointer block"
              >
                {/* <EcommerceVisual /> */}
                <EcommerceVisual isHovered={hoveredBento === 3} />
                <div className="absolute bottom-0 left-0 p-6 w-full z-10 transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-all duration-500" style={{ background: 'linear-gradient(to top, rgba(10,12,18,0.95) 0%, transparent 100%)' }}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Django', 'React', 'PostgreSQL'].map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-full"
                        style={{ color: `hsla(${themeHue}, 75%, 72%, 0.85)`, background: `hsla(${themeHue}, 70%, 65%, 0.09)`, border: `1px solid hsla(${themeHue}, 70%, 65%, 0.18)` }}>{tag}</span>
                    ))}
                  </div>
                  <h4 className="font-body-lg text-body-lg" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>{t('projects.p2_title')}</h4>
                  <div className="mt-2 opacity-100 md:opacity-0 group-hover:opacity-100 transform translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <span className="font-label-sm text-xs tracking-wider flex items-center gap-1" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>
                      {t('projects.view_project')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </motion.a>

              {/* ── Card 4: GitHub Heatmap ── */}
              <motion.a
                href="https://github.com/Subhadeep12-gorain"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: cardDirs[3].x, y: cardDirs[3].y, scale: 0.9 }}
                animate={isBentoInView
                  ? { opacity: 1, x: 0, y: 0, scale: 1 }
                  : { opacity: 0, x: cardDirs[3].x, y: cardDirs[3].y, scale: 0.9 }
                }
                transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.24 }}
                whileHover={bentoHover}
                onMouseEnter={() => setHoveredBento(4)}
                onMouseLeave={() => setHoveredBento(null)}
                style={{ zIndex: 1 }}
                className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-lg bg-surface-container-low border border-primary/10 cursor-pointer block bg-gradient-to-br from-surface-container to-surface"
              >
                {/* SVG border tracer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <rect x="0.75" y="0.75" width="calc(100% - 1.5px)" height="calc(100% - 1.5px)" rx="8" ry="8" className="border-trace-rect" />
                </svg>
                <div className="absolute inset-0 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, hsla(${themeHue}, 70%, 65%, 0.07) 0%, transparent 60%)` }} />
                <GitHubHeatmapVisual />
                <div className="absolute bottom-0 left-0 p-5 w-full z-10">
                  <h4 className="font-body-lg text-body-lg transition-colors duration-300" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>{t('projects.view_github')}</h4>
                  <p className={`font-label-sm text-[10px] tracking-[0.15em] uppercase mt-0.5 transition-colors duration-300 ${hoveredBento === 4 ? 'text-white' : 'text-on-surface-variant'}`}>{t('projects.github_activity')}</p>
                </div>
              </motion.a>
                </div>
              </Suspense>
            </div>

            {/* Mobile Looping Marquee */}
            <div className="block md:hidden relative z-10 mt-4 w-full overflow-hidden" style={{ height: '300px' }}>
              <Suspense fallback={null}>
                <motion.div
                  className="flex gap-4"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ ease: "linear", duration: 25, repeat: Infinity }}
                  style={{ width: "max-content" }}
                >
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <MobileProjectCard href="https://github.com/Subhadeep12-gorain/japan-tourism-forecasting" tags={['Python', 'Pandas', 'XGBoost', 'Time-Series']} title={t('projects.p1_title')} desc={t('projects.p1_desc')} themeHue={themeHue} t={t}>
                        <JapanMapVisual isHovered={true} />
                      </MobileProjectCard>
                      <MobileProjectCard href="https://github.com/Subhadeep12-gorain/NoteApp" tags={['React Native', 'Expo', 'AsyncStorage']} title={t('projects.p3_title')} desc={t('projects.p3_desc')} themeHue={themeHue} t={t}>
                        <PhoneAppVisual isHovered={true} />
                      </MobileProjectCard>
                      <MobileProjectCard href="https://github.com/Subhadeep12-gorain/Ecommerce-website-" tags={['Django', 'React', 'PostgreSQL']} title={t('projects.p2_title')} themeHue={themeHue} t={t}>
                        <EcommerceVisual isHovered={true} />
                      </MobileProjectCard>
                      <MobileProjectCard href="https://github.com/Subhadeep12-gorain" title={t('projects.view_github')} desc={t('projects.github_activity')} themeHue={themeHue} t={t} github>
                        <GitHubHeatmapVisual />
                      </MobileProjectCard>
                    </div>
                  ))}
                </motion.div>
              </Suspense>
            </div>
          </section>
        </main>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to top, rgba(180, 190, 210, 0.12) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />
      </div>

      {/* ====== SECTION 4: About Me ====== */}
      <div id="about-wrapper" data-snap-section className="relative bg-transparent min-h-fit py-section-gap">
        
        {/* BACKGROUND LAYER (Absolute to fill full section on all devices) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <div className="relative h-full w-full overflow-hidden">
            <FogEllipses />

            {/* Katakana name watermark — bottom-left, ghost */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-2%',
                left: '-2%',
                fontFamily: "'Shippori Mincho', serif",
                fontSize: 'clamp(6rem, 18vw, 20rem)',
                lineHeight: 1,
                color: 'rgba(255,255,255,0.035)',
                transform: 'rotate(-15deg)',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 0,
                whiteSpace: 'nowrap',
              }}
            >
              スバディープ ゴレイン
            </div>

            {/* LAYER 1: Background Neural Grid — themeHue tinted */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              <motion.div
                className="absolute inset-0 w-full h-[200%]"
                animate={{
                  backgroundPosition: ["0px 0px", "60px 60px"]
                }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                style={{
                  backgroundImage: `radial-gradient(circle, hsla(${themeHue}, 70%, 65%, 0.055) 1px, transparent 1px)`,
                  backgroundSize: '60px 60px',
                  x: gridX,
                  y: gridY,
                }}
              />
            </div>

            {/* LAYER 1.5: Cursor Backlight Spotlight — themeHue */}
            <motion.div
              className="absolute w-[450px] h-[450px] rounded-full blur-[90px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-5 hidden md:block"
              style={{
                background: `radial-gradient(circle, hsla(${themeHue}, 80%, 65%, 0.2) 0%, hsla(${themeHue}, 70%, 55%, 0.07) 45%, transparent 70%)`,
                x: aboutSmoothX,
                y: aboutSmoothY,
              }}
              animate={{ opacity: isAboutHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* LAYER 2: Ghost Kanji — breath pulse + mouse parallax */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none font-serif">
              {/* 工 Kanji */}
              <motion.div
                animate={{
                  x: [0, -20], y: [0, -30],
                  opacity: [0.025, 0.09, 0.025],
                  scale: [1, 1.04, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', times: [0, 0.5, 1] }}
                className="absolute left-[8%] bottom-[20%] text-[20vw] text-white leading-none"
              >
                <motion.div style={{ x: kanji1X, y: kanji1Y }}>工</motion.div>
              </motion.div>

              {/* 房 Kanji */}
              <motion.div
                animate={{
                  x: [0, 15], y: [0, 20],
                  opacity: [0.025, 0.09, 0.025],
                  scale: [1, 1.04, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 3.3, times: [0, 0.5, 1] }}
                className="absolute right-[8%] top-[15%] text-[15vw] text-white leading-none"
              >
                <motion.div style={{ x: kanji2X, y: kanji2Y }}>房</motion.div>
              </motion.div>

              {/* 脳 Kanji */}
              <motion.div
                animate={{
                  x: [0, -25], y: [0, 10],
                  opacity: [0.025, 0.09, 0.025],
                  scale: [1, 1.04, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 6.6, times: [0, 0.5, 1] }}
                className="absolute left-[50%] -translate-x-1/2 top-[8%] text-[12vw] text-white leading-none"
              >
                <motion.div style={{ x: kanji3X, y: kanji3Y }}>脳</motion.div>
              </motion.div>
            </div>

            {/* LAYER 2.5: Atmospheric Bokeh Circles — themeHue */}
            <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
              <div style={{
                position: 'absolute', top: '10%', left: '-5%',
                width: '400px', height: '400px', borderRadius: '50%',
                background: `hsla(${themeHue}, 70%, 65%, 0.05)`,
                filter: 'blur(80px)', pointerEvents: 'none', zIndex: 1,
              }} />
              <div style={{
                position: 'absolute', bottom: '10%', right: '-5%',
                width: '500px', height: '500px', borderRadius: '50%',
                background: `hsla(${themeHue}, 50%, 55%, 0.04)`,
                filter: 'blur(100px)', pointerEvents: 'none', zIndex: 1,
              }} />
              <div style={{
                position: 'absolute', top: '40%', left: '30%',
                width: '350px', height: '350px', borderRadius: '50%',
                background: `hsla(${themeHue}, 70%, 65%, 0.03)`,
                filter: 'blur(90px)', pointerEvents: 'none', zIndex: 1,
              }} />
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <section
          id="about"
          ref={aboutRef}
          onMouseMove={handleAboutMouseMove}
          onMouseEnter={handleAboutMouseEnter}
          onMouseLeave={handleAboutMouseLeave}
          className="w-full py-4 flex flex-col items-center justify-center relative z-20"
        >

          {/* LAYER 3: Main Content */}
          <motion.div
            variants={aboutContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-80px' }}
            style={{ x: contentX, y: contentY }}
            className="relative z-20 w-full max-w-3xl flex flex-col items-center text-center px-6"
          >
            <div className="flex flex-col items-center w-full py-10 relative">
              <motion.span
                variants={aboutItemVariants}
                className="text-[0.65rem] tracking-[0.2em] uppercase mb-3 text-center"
                style={{ color: `hsla(${themeHue}, 70%, 72%, 0.55)` }}
              >
                {t('about.section_title')}
              </motion.span>
              <motion.h2
                variants={aboutItemVariants}
                className="font-serif text-[2.2rem] md:text-[3.5rem] text-white font-normal mb-2 text-center"
              >
                {t('about.name')}
              </motion.h2>
              {/* 3rem gap between heading and content per vision */}
              <motion.p
                variants={aboutItemVariants}
                className="font-sans text-base text-white/50 text-center"
                style={{ marginBottom: '3rem' }}
              >
                {t('about.subtitle')}
              </motion.p>
              <div className="flex flex-col gap-4 mb-6 max-w-2xl mt-10 md:mt-0">
                <motion.p 
                  initial={{ opacity: 0, x: -50, filter: "blur(5px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: false, margin: "-15%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="font-body-lg text-body-lg text-on-surface leading-relaxed"
                >
                  {t('about.p1')}
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, x: 50, filter: "blur(5px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: false, margin: "-15%" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="font-body-lg text-body-lg text-on-surface/80 leading-relaxed tracking-tight"
                >
                  {t('about.p2')}
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: false, margin: "-15%" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="font-body-lg text-body-lg text-on-surface/70 leading-relaxed tracking-tight"
                >
                  {t('about.p3')}
                </motion.p>
              </div>
            </div>

            {/* Outer wrapper for the flip effect so it doesn't conflict with inner 3D tilt */}
            <motion.div
              variants={aboutItemVariants}
              whileHover={{ rotateX: 360 }}
              whileInView={{ rotateY: [0, 10, -10, 0], rotateX: [0, 5, -5, 0] }}
              viewport={{ once: false, margin: "-10%" }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ perspective: 1000 }}
              className="w-full max-w-lg"
            >
              {/* Glassmorphic "Now Building" Card — themeHue border */}
              <motion.div
                ref={cardRef}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  rotateX: cardRotateX,
                  rotateY: cardRotateY,
                  transformStyle: 'preserve-3d',
                  perspective: 1000,
                  border: `1px solid hsla(${themeHue}, 70%, 65%, 0.18)`,
                }}
                className="shifting-card-glow backdrop-blur-md bg-white/[0.02] rounded-2xl p-6 w-full flex flex-col items-center gap-2 shadow-lg cursor-pointer justify-center"
              >
                <span
                  className="font-label-sm tracking-[0.2em] text-[10px] uppercase"
                  style={{ transform: 'translateZ(15px)', color: `hsla(${themeHue}, 60%, 75%, 0.45)` }}
                >
                  {t('about.now_building')}
                </span>
                <div
                  className="flex items-center gap-3"
                  style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
                >
                  <span className="w-2.5 h-2.5 rounded-full status-pulse-dot" />
                  <span
                    className="font-serif italic text-xl md:text-2xl text-white"
                    style={{ fontFamily: "'EB Garamond', serif" }}
                  >
                    — {t('about.building_what')}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* ====== SECTION 5: Skills ====== */}
      <div id="skills-wrapper" data-snap-section className="relative overflow-hidden bg-transparent min-h-fit w-full py-section-gap">
        {/* Particle constellation replaces LightRays per vision doc */}
        <ParticleConstellation themeHue={themeHue} />
        <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4" style={{ position: 'relative', zIndex: 1 }}>
          {/* Skills & Tech Stack Section */}
          <section id="skills" className="w-full mb-section-gap relative">
            <Suspense fallback={null}>
              <SkillsRedesign themeHue={themeHue} />
            </Suspense>
          </section>
        </main>
      </div>

      {/* ====== SECTION 6: Experience ====== */}
      <div id="experience-wrapper" data-snap-section className="py-section-gap" style={{ position: 'relative', overflow: 'clip', backgroundColor: 'transparent' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 40% at 50% -20%, hsla(${themeHue}, 60%, 45%, 0.04) 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
        <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
          {/* Experience / Timeline Section */}
          <section id="experience" className="w-full mb-section-gap relative">
            <Suspense fallback={null}>
              <ExperienceTimeline themeHue={themeHue} />
            </Suspense>
          </section>
        </main>
      </div>

      {/* ====== SECTION 7: Contact ====== */}
      <div id="contact-wrapper" data-snap-section className="py-section-gap" style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'transparent' }}>
        <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
          <ContactSection themeHue={themeHue} />
        </main>
      </div>

      {/* ====== Gradient Bridge: Contact → Footer ====== */}
      <div style={{ width: '100%', height: 40, pointerEvents: 'none', position: 'relative', zIndex: 1, background: 'linear-gradient(to bottom, rgb(8,8,25), #000000)' }} />

      {/* ====== UPGRADED CINEMATIC FOOTER ====== */}
      <Suspense fallback={null}>
        <CinematicFooter />
      </Suspense>

      {/* ====== SCROLL TO TOP BUTTON ====== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-3 md:p-4 rounded-full bg-black/40 backdrop-blur-md border hover:bg-black/60 transition-colors cursor-pointer group"
            style={{
              borderColor: `hsla(${themeHue}, 70%, 65%, 0.3)`,
              boxShadow: `0 0 20px hsla(${themeHue}, 70%, 65%, 0.2)`
            }}
          >
            <ArrowUp className="w-5 h-5 text-white group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>

      </div>
    </ReactLenis>
  );
}

export default App;
