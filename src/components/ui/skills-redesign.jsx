/* eslint-disable react-hooks/purity */
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView, useAnimation } from "framer-motion";
import { Brain, Database, BarChart, Server, Code, Network } from "lucide-react";
import { CpuArchitecture } from "./cpu-architecture";
import { SplitHeading } from "./split-heading";
import { useTranslation } from 'react-i18next';
import { FloatingSkillOrbs } from "./floating-skill-orbs";

// skillsData moved inside component
export default function SkillsRedesign({ themeHue = 220 }) {
  const containerRef = useRef(null);
  const { t } = useTranslation();

  const skillsData = useMemo(() => [
    {
      id: 1,
      title: "Machine Learning",
      icon: Brain,
      items: ["XGBoost, CatBoost, Scikit-learn", "Model tuning and time-aware cross-validation", "Classification and regression pipelines", "84% accuracy, AUC 0.89 on real forecasting project"],
    },
    {
      id: 2,
      title: t('skills.data_eng_title'),
      icon: Database,
      items: [t('skills.de_1'), t('skills.de_2'), t('skills.de_3'), t('skills.de_4')],
    },
    {
      id: 3,
      title: t('skills.node_data_viz'),
      icon: BarChart,
      items: ["Streamlit dashboard development", "Feature importance visualisation", "Model performance comparison dashboards", "Interactive data exploration interfaces"],
    },
    {
      id: 4,
      title: t('skills.node_databases'),
      icon: Server,
      items: ["MySQL — relational data modelling", "MongoDB — document-based storage", "Query optimisation basics", "Data storage for ML pipeline integration"],
    },
    {
      id: 5,
      title: t('skills.node_programming'),
      icon: Code,
      items: ["Python — primary language for all ML/data work", "JavaScript — frontend and React projects", "Java — foundational OOP (Udemy certified)", "GitHub — version control, project documentation"],
    }
  ], [t]);

  const isInView = useInView(containerRef, { margin: "-100px 0px" });
  const orbitControls = useAnimation();
  const nodeControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      // Start continuous rotations from their current position
      orbitControls.start({ rotate: 360, transition: { duration: 40, ease: "linear", repeat: Infinity }});
      nodeControls.start({ rotate: -360, transition: { duration: 40, ease: "linear", repeat: Infinity }});
    } else {
      // Stop animations immediately when out of view
      orbitControls.stop();
      nodeControls.stop();
    }
  }, [isInView, orbitControls, nodeControls]);

  const [activeNodeId, setActiveNodeId] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [energyPulse, setEnergyPulse] = useState(false);
  const [cardYDir, setCardYDir] = useState(100); // Random Y direction state

  // Magnetic hover state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [25, -25]), { stiffness: 400, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), { stiffness: 400, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeaveCard = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleNodeClick = (id) => {
    setCardYDir(Math.random() > 0.5 ? 100 : -100);
    setActiveNodeId(id);
    setEnergyPulse(true);
    setTimeout(() => setEnergyPulse(false), 600);
  };

  // Auto-cycle through nodes
  useEffect(() => {
    if (isHovered || !isInView) return;
    
    const cycleTimer = setInterval(() => {
      setCardYDir(Math.random() > 0.5 ? 100 : -100);
      setActiveNodeId((prevId) => {
        const currentIndex = skillsData.findIndex((item) => item.id === prevId);
        const nextIndex = (currentIndex + 1) % skillsData.length;
        const nextId = skillsData[nextIndex].id;
        setEnergyPulse(true);
        setTimeout(() => setEnergyPulse(false), 600);
        return nextId;
      });
    }, 3000);
    
    return () => clearInterval(cycleTimer);
  }, [isHovered, isInView, skillsData]);

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360) % 360;
    const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 110 : 180; // smaller on mobile
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    return { x, y };
  };

  const activeNode = skillsData.find((item) => item.id === activeNodeId) || skillsData[0];
  const ActiveIcon = activeNode.icon;

  return (
    <div 
      ref={containerRef}
      className="w-full md:min-h-screen flex flex-col items-center md:justify-center relative overflow-hidden select-none md:py-20 pt-6 pb-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 pointer-events-none z-0"
        style={{ background: `radial-gradient(ellipse at top, hsla(${themeHue}, 70%, 65%, 0.03) 0%, transparent 70%)` }} />

      {/* HEADER SECTION (Spans full width, sits above panels) */}
      <div className="w-full max-w-[1200px] px-6 md:px-12 xl:px-0 mb-10 z-10 flex flex-col items-center md:items-start text-center md:text-left">
        <motion.span
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="font-sans text-[0.65rem] tracking-[0.2em] uppercase mb-2 block"
          style={{ color: `hsla(${themeHue}, 70%, 72%, 0.55)` }}
        >
          {t('skills.section_label')}
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 60, rotateX: -15 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.15 }}
          className="font-serif text-[2.2rem] md:text-[2.8rem] text-white font-normal tracking-wide whitespace-nowrap"
          style={{ textShadow: `0 0 20px hsla(${themeHue}, 70%, 65%, 0.28)`, perspective: "1000px" }}
        >
          <SplitHeading>{t('skills.title')}</SplitHeading>
        </motion.h3>
      </div>

      {/* PANELS WRAPPER */}
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between z-10">
        
        {/* LEFT PANEL: Orbital Component (Desktop) & Floating Orbs (Mobile) */}
        <div className="w-full md:w-[50%] relative flex flex-col items-center justify-center md:items-start md:pl-8 lg:pl-16">
          
          {/* MOBILE ONLY: Floating Orbs */}
          <div className="w-full flex md:hidden items-center justify-center">
            <FloatingSkillOrbs 
              skillsData={skillsData} 
              activeNodeId={activeNodeId} 
              setActiveNodeId={setActiveNodeId} 
              themeHue={themeHue} 
            />
          </div>

          {/* DESKTOP ONLY: Orbital container */}
          <div className="hidden md:flex relative w-full max-w-[450px] min-h-[450px] items-center justify-center">
          
          {/* Curved Visual Bridge Line — themeHue */}
          <div className="absolute top-1/2 left-[50%] w-[45vw] h-[300px] hidden md:block pointer-events-none z-0 -translate-y-[150px]">
            <svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="none" overflow="visible">
              <path
                d="M 0,150 C 200,150 200,300 400,300"
                fill="none"
                stroke={`hsla(${themeHue}, 60%, 65%, 0.15)`}
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              <motion.path
                d="M 0,150 C 200,150 200,300 400,300"
                fill="none"
                stroke={`hsl(${themeHue}, 75%, 72%)`}
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={energyPulse ? { pathLength: 1, opacity: [0, 1, 0] } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ filter: `drop-shadow(0 0 8px hsla(${themeHue}, 80%, 72%, 0.8))` }}
              />
            </svg>
          </div>

          {/* CPU Architecture Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.08] scale-[1.3] flex items-center justify-center">
            <CpuArchitecture />
          </div>

          <motion.div 
            className="absolute w-full h-full flex items-center justify-center"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 50, damping: 20, duration: 1.5 }}
          >
            <motion.div 
              className="absolute w-full h-full flex items-center justify-center"
              animate={orbitControls}
            >
              {/* Centered glowing node — themeHue */}
              <div className="absolute w-24 h-24 rounded-full blur-xl pointer-events-none z-0"
                style={{ background: `radial-gradient(circle, hsla(${themeHue}, 70%, 65%, 0.12), transparent)` }} />
              <div className="absolute w-16 h-16 rounded-full border border-white/10 bg-[#111317]/80 backdrop-blur-md flex items-center justify-center z-10"
                style={{ boxShadow: `0 0 30px hsla(${themeHue}, 70%, 65%, 0.15)`, color: `hsl(${themeHue}, 75%, 75%)` }}>
                <Network className="w-8 h-8 animate-pulse" />
              </div>

            {/* Orbit line ring path */}
            <div className="absolute w-[220px] h-[220px] md:w-[360px] md:h-[360px] rounded-full border border-white/[0.04] pointer-events-none z-0" />

            {/* Node items */}
            {skillsData.map((item, index) => {
              const position = calculateNodePosition(index, skillsData.length);
              const isActive = activeNodeId === item.id;
              const Icon = item.icon;

              const nodeStyle = {
                transform: `translate(${position.x}px, ${position.y}px)`,
              };

              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(item.id);
                  }}
                  className="absolute cursor-pointer flex flex-col items-center justify-center group transition-opacity duration-300"
                  style={nodeStyle}
                >
                  <motion.div
                    animate={nodeControls}
                  >
                    <div className="flex flex-col items-center justify-center">
                    {/* Node icon pill */}
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border ${
                          isActive ? 'scale-110' : 'bg-[#111317]/95 text-on-surface border-white/[0.1] hover:scale-105'
                        }`}
                        style={isActive ? {
                          background: `hsla(${themeHue}, 70%, 65%, 0.1)`,
                          color: `hsl(${themeHue}, 75%, 75%)`,
                          borderColor: `hsla(${themeHue}, 70%, 65%, 0.6)`,
                          boxShadow: `0 0 25px hsla(${themeHue}, 70%, 65%, 0.35)`,
                        } : { borderColor: 'rgba(255,255,255,0.1)' }}
                      >
                      <Icon size={24} />
                    </div>

                    {/* Node label */}
                      <div
                        className={`absolute top-16 whitespace-nowrap text-[13px] font-mono tracking-widest uppercase transition-colors duration-300 px-3 py-1.5 rounded bg-[#111317]/95 backdrop-blur-md border ${
                          isActive ? 'font-bold' : 'text-white/80 border-white/10 group-hover:text-white'
                        }`}
                        style={isActive ? {
                          color: `hsl(${themeHue}, 75%, 75%)`,
                          borderColor: `hsla(${themeHue}, 70%, 65%, 0.3)`,
                        } : {}}
                      >
                      {item.title}
                    </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL: Stacked Cards Component */}
      <motion.div 
        className="w-full md:w-[50%] min-h-[60vh] relative flex items-center justify-center z-10 px-6 md:px-0 md:pr-16 mt-16 md:mt-0"
        initial={{ opacity: 0, y: cardYDir, rotateX: cardYDir > 0 ? 15 : -15 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.2 }}
      >
        <div className="relative w-full max-w-[600px]">
          
          {/* Active Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNodeId}
              initial={{ y: cardYDir, opacity: 0, rotateX: cardYDir > 0 ? 15 : -15 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: -cardYDir, opacity: 0, rotateX: cardYDir > 0 ? -15 : 15 }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
              className="w-full relative z-10"
              style={{ perspective: 1000 }}
            >
              <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeaveCard}
                className="w-full rounded-2xl bg-[#050508]/80 backdrop-blur-3xl border p-10 md:p-14 flex flex-col relative overflow-hidden transition-colors duration-300"
                style={{ 
                  borderColor: "rgba(255,255,255,0.08)",
                  borderTopColor: "rgba(255,255,255,0.15)",
                  boxShadow: "0 0 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  rotateX,
                  rotateY,
                }}
              >
                {/* Energy Flash Overlay — themeHue */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: energyPulse ? 0.15 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 pointer-events-none mix-blend-screen z-20"
                  style={{ background: `linear-gradient(to top right, hsl(${themeHue}, 70%, 65%), transparent)` }}
                />

                {/* Top Accent — themeHue */}
                <div className="absolute top-0 left-8 w-16 h-1 opacity-60 rounded-b-md z-30"
                  style={{ background: `linear-gradient(to right, hsl(${themeHue}, 75%, 72%), transparent)` }} />
                
                <div className="flex items-center gap-5 mb-6 mt-2 relative z-30">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border"
                    style={{
                      background: `hsla(${themeHue}, 70%, 65%, 0.1)`,
                      color: `hsl(${themeHue}, 75%, 75%)`,
                      borderColor: `hsla(${themeHue}, 70%, 65%, 0.2)`,
                    }}>
                    <ActiveIcon size={24} />
                  </div>
                  <h4 className="text-3xl md:text-4xl font-serif text-white font-bold tracking-wide" style={{ fontFamily: "'EB Garamond', serif" }}>
                    {activeNode.title}
                  </h4>
                </div>
                
                <div className="w-full h-px mb-8 relative z-30"
                  style={{ background: `hsla(${themeHue}, 60%, 65%, 0.2)` }} />
                
                <div className="flex flex-wrap gap-3 relative z-30">
                  {activeNode.items.map((point, idx) => (
                    <div 
                      key={idx} 
                      className="px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center gap-3 transition-colors duration-300 hover:bg-white/[0.08] hover:border-white/[0.1] cursor-pointer group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 group-hover:scale-125"
                        style={{ background: `hsla(${themeHue}, 70%, 65%, 0.65)` }} />
                      <span className="text-sm font-mono tracking-wide text-white/70 transition-colors duration-300 group-hover:text-white">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Faint background symbol */}
                <div className="absolute -bottom-8 -right-8 opacity-[0.04] pointer-events-none transform -rotate-12 scale-150 z-0"
                  style={{ color: `hsl(${themeHue}, 60%, 65%)` }}>
                  <ActiveIcon size={160} />
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      </div>

    </div>
  );
}
