import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { SakuraPetals } from '../ui/sakura-petals';
import { RainStreaks } from '../ui/rain-streaks';
import FogEllipses from '../ui/fog-ellipses';
import LightRays from '../ui/light-rays';

export function GlobalWeatherManager() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 100 });

  // Map scroll progress to opacity for different weather effects
  // Hero (0 - 0.2): Sakura + Lightning (Lightning not built here yet, keeping Sakura)
  // Tech Mastery (0.2 - 0.4): Rain
  // Bento (0.4 - 0.6): Fog
  // Skills (0.6 - 0.8): Light Rays
  // Experience/Contact (0.8 - 1.0): Deep Dark / Footer Video

  // Opacity capped low per vision: weather is mood overlay, not color change
  const sakuraOpacity = useTransform(smoothProgress, [0, 0.15, 0.22], [0.9, 0.9, 0]);
  const rainOpacity   = useTransform(smoothProgress, [0.15, 0.25, 0.38, 0.44], [0, 0.15, 0.15, 0]);
  const fogOpacity    = useTransform(smoothProgress, [0.38, 0.48, 0.58, 0.68], [0, 0.12, 0.12, 0]);
  const raysOpacity   = useTransform(smoothProgress, [0.58, 0.68, 0.82, 0.9],  [0, 0.10, 0.10, 0]);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, background: '#05050a' }}>
      {/* Base Background Color */}
      
      {/* 1. Sakura Petals (Hero) */}
      <motion.div style={{ opacity: sakuraOpacity }} className="absolute inset-0">
        <SakuraPetals />
      </motion.div>

      {/* 2. Rain Streaks (Technical Mastery) */}
      <motion.div style={{ opacity: rainOpacity }} className="absolute inset-0">
        <RainStreaks count={40} />
      </motion.div>

      {/* 3. Fog (Bento Projects) */}
      <motion.div style={{ opacity: fogOpacity }} className="absolute inset-0">
        <FogEllipses />
      </motion.div>

      {/* 4. Light Rays (Skills) */}
      <motion.div style={{ opacity: raysOpacity }} className="absolute inset-0">
        <LightRays />
      </motion.div>
      
      {/* The Footer Video will sit at z-[0] in the actual footer section, 
          so when we scroll past 0.9, the bg-[#111317] needs to fade out? 
          Actually, the footer video is inside the cinematic-footer component.
      */}
    </div>
  );
}
