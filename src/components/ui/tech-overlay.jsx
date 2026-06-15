
import { motion } from 'framer-motion';

export function TechOverlay() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen overflow-hidden rounded-lg">
      
      {/* 1. LiDAR Scanner Sweep */}
      <motion.div
        animate={{ y: ['-20%', '120%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent via-[rgba(251,179,193,0.2)] to-transparent opacity-80"
      >
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[rgba(251,179,193,0.8)] shadow-[0_0_8px_rgba(251,179,193,1)]" />
      </motion.div>

      {/* 2. HUD Grid Lines (Subtle) */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251,179,193,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251,179,193,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 3. Animated Circuit Traces (SVG) */}
      <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
        {/* Trace 1 */}
        <motion.path
          d="M 10 40 L 40 40 L 70 70 L 70 150"
          stroke="rgba(251,179,193,0.6)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="70" cy="150" r="3"
          fill="rgba(251,179,193,0.8)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Trace 2 */}
        <motion.path
          d="M 100 70 L 90 70 L 85 60 L 85 30"
          stroke="rgba(251,179,193,0.6)"
          strokeWidth="1"
          fill="none"
          style={{ vectorEffect: 'non-scaling-stroke' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </svg>
      
      {/* 4. Scanning Data Points / Reticles */}
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[rgba(251,179,193,0.5)]" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[rgba(251,179,193,0.5)]" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[rgba(251,179,193,0.5)]" />
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[rgba(251,179,193,0.5)]" />

      {/* Floating Data Numbers */}
      <motion.div 
        className="absolute top-[30%] left-[8%] text-[8px] font-mono text-[rgba(251,179,193,0.8)]"
        animate={{ opacity: [0.1, 0.6, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        SYS.REQ // 84.2X
      </motion.div>
      <motion.div 
        className="absolute bottom-[20%] right-[8%] text-[8px] font-mono text-[rgba(251,179,193,0.8)]"
        animate={{ opacity: [0.1, 0.6, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      >
        LAT: 12ms
      </motion.div>
    </div>
  );
}

export default TechOverlay;
