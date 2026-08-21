import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';

// A kinetic counter for the metric
const KineticCounter = ({ value, suffix = "", themeHue }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    const duration = 1500; // 1.5s animation
    
    // Parse value as float for smooth animation, assuming it's a number
    const targetValue = parseFloat(value) || 0;
    
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * targetValue));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animationFrame = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (nodeRef.current) observer.observe(nodeRef.current);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [value]);

  return (
    <div ref={nodeRef} className="font-headline-lg font-light tracking-tighter" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: `hsl(${themeHue}, 75%, 75%)`, lineHeight: 1 }}>
      {count}{suffix}
    </div>
  );
};

export const ProjectModal = ({ project, themeHue, onClose, lowPowerMode = false }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Mouse tracking for shimmer inside modal
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    if (lowPowerMode) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };
  
  const shimmerBg = useMotionTemplate`radial-gradient(circle 350px at ${mouseX}px ${mouseY}px, hsla(${themeHue}, 80%, 75%, 0.08), transparent)`;

  useEffect(() => {
    // Lock body scroll when modal mounts
    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      // Restore body scroll on unmount
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  // Using simple variants for the modal container
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        type: 'spring', 
        stiffness: 70, 
        damping: 20, 
        mass: 1,
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 20,
      filter: 'blur(10px)',
      transition: { duration: 0.3, ease: 'easeIn' } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 lg:p-12 pointer-events-auto">
        {/* Backdrop: Ink Bleed + Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
          style={{ 
            backdropFilter: lowPowerMode ? 'none' : 'blur(24px) saturate(0.4) brightness(0.3)',
            WebkitBackdropFilter: lowPowerMode ? 'none' : 'blur(24px) saturate(0.4) brightness(0.3)',
            background: lowPowerMode ? 'rgba(5,7,12,0.95)' : `radial-gradient(circle at center, hsla(${themeHue}, 60%, 50%, 0.08) 0%, rgba(5,7,12,0.8) 100%)` 
          }}
          onClick={onClose}
        />
        
        {/* Main Modal Shell */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseMove={handleMouseMove}
          className="relative w-full max-w-5xl h-[85vh] max-h-[900px] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{ 
            background: 'rgba(10, 12, 18, 0.7)',
            border: `1px solid hsla(${themeHue}, 70%, 65%, 0.18)`,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px hsla(${themeHue}, 70%, 65%, 0.1)`
          }}
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          onWheel={(e) => e.stopPropagation()} // prevent useSectionSnap from triggering
        >
          {/* Mouse-tracked Shimmer */}
          {!lowPowerMode && (
            <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: shimmerBg }} />
          )}
          
          {/* Reading Progress Bar */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 z-20 origin-left"
            style={{ background: `hsl(${themeHue}, 75%, 65%)`, scaleX }}
          />
          
          {/* Escape Hatch (Header) */}
          <div className="absolute top-0 right-0 left-0 p-6 flex justify-between items-center z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Case Study 0{project.index || 1}</span>
            </div>
            <button 
              onClick={onClose}
              className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <span className="font-mono text-xs text-white/60 group-hover:text-white/90">ESC</span>
              <span className="material-symbols-outlined text-sm text-white/60 group-hover:text-white/90">close</span>
            </button>
          </div>
          
          {/* Scrollable Content */}
          <div data-lenis-prevent="true" ref={containerRef} className="relative z-10 flex-1 overflow-y-auto px-6 py-20 md:px-16 md:py-24 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {/* Chapter 01: Brief */}
            <motion.section variants={itemVariants} className="mb-32">
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-[11px] font-mono tracking-wider rounded-full"
                    style={{ color: `hsla(${themeHue}, 75%, 72%, 0.9)`, background: `hsla(${themeHue}, 70%, 65%, 0.1)`, border: `1px solid hsla(${themeHue}, 70%, 65%, 0.2)` }}>
                    {tag}
                  </span>
                ))}
                <span className="px-3 py-1 text-[11px] font-mono tracking-wider rounded-full text-white/50 border border-white/10">
                  {project.year}
                </span>
              </div>
              
              <h2 className="font-headline-lg text-4xl md:text-6xl text-white font-light tracking-tight mb-8">
                {project.title}
              </h2>
              
              <p className="font-body-lg text-xl md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed font-light">
                {project.brief}
              </p>
            </motion.section>
            
            {/* Chapter 02: Approach */}
            {project.approach && project.approach.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mb-32"
              >
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] mb-8" style={{ color: `hsl(${themeHue}, 70%, 65%)` }}>
                  02 — Approach & Architecture
                </h3>
                
                <div className="flex flex-col gap-4">
                  {project.approach.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 md:gap-6 group">
                      <div className="flex flex-col items-center mt-1">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/40 font-mono text-xs group-hover:border-white/30 group-hover:text-white/80 transition-colors">
                          0{idx + 1}
                        </div>
                        {idx !== project.approach.length - 1 && (
                          <div className="w-px h-12 bg-white/10 my-2 group-hover:bg-white/20 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-body-md text-lg text-white/80 group-hover:text-white transition-colors">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
            
            {/* Chapter 03: Results (Kinetic Metric) */}
            {project.metric && (
              <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mb-32"
              >
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] mb-8" style={{ color: `hsl(${themeHue}, 70%, 65%)` }}>
                  03 — The Impact
                </h3>
                
                <div className="flex flex-col md:flex-row items-baseline gap-4 md:gap-8 p-8 md:p-12 rounded-2xl bg-white/5 border border-white/5">
                  <KineticCounter value={project.metric.value} suffix={project.metric.unit} themeHue={themeHue} />
                  <div className="flex-1">
                    <p className="font-body-lg text-xl md:text-2xl text-white/70 font-light leading-relaxed">
                      {project.metric.label}
                    </p>
                  </div>
                </div>
              </motion.section>
            )}
            
            {/* Chapter 04: Links */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="pb-20"
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] mb-8" style={{ color: `hsl(${themeHue}, 70%, 65%)` }}>
                04 — Live Links
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-between group transition-all"
                  >
                    <div>
                      <h4 className="font-body-lg text-white text-lg mb-1">Source Code</h4>
                      <p className="font-label-sm text-xs text-white/50">View repository on GitHub</p>
                    </div>
                    <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1">arrow_outward</span>
                  </a>
                )}
                
                {project.demo && (
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 p-6 rounded-xl border flex items-center justify-between group transition-all"
                    style={{ 
                      borderColor: `hsla(${themeHue}, 70%, 65%, 0.3)`, 
                      background: `hsla(${themeHue}, 70%, 65%, 0.1)` 
                    }}
                  >
                    <div>
                      <h4 className="font-body-lg text-white text-lg mb-1">Live Demo</h4>
                      <p className="font-label-sm text-xs text-white/60">Experience the project</p>
                    </div>
                    <span className="material-symbols-outlined transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>arrow_outward</span>
                  </a>
                )}
                
                {project.biDashboard && (
                  <a 
                    href={project.biDashboard} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 p-6 rounded-xl border flex items-center justify-between group transition-all"
                    style={{ 
                      borderColor: `hsla(${themeHue}, 70%, 65%, 0.3)`, 
                      background: `hsla(${themeHue}, 70%, 65%, 0.1)` 
                    }}
                  >
                    <div>
                      <h4 className="font-body-lg text-white text-lg mb-1">BI Dashboard</h4>
                      <p className="font-label-sm text-xs text-white/60">View Power BI Report</p>
                    </div>
                    <span className="material-symbols-outlined transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" style={{ color: `hsl(${themeHue}, 75%, 75%)` }}>arrow_outward</span>
                  </a>
                )}
              </div>
            </motion.section>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
