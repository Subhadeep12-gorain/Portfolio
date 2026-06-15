/* eslint-disable react-hooks/purity */
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

export function FloatingSkillOrbs({ skillsData, activeNodeId, setActiveNodeId, themeHue }) {
  const orbPaths = useMemo(() => {
    // Generate initial random positions and animation paths
    return skillsData.map((_, i) => {
      // Create random floating keyframes
      const xKeyframes = [
        Math.random() * 40 - 20, 
        Math.random() * 80 - 40, 
        Math.random() * 40 - 20,
        Math.random() * 80 - 40,
        Math.random() * 40 - 20
      ];
      const yKeyframes = [
        Math.random() * 40 - 20, 
        Math.random() * 80 - 40, 
        Math.random() * 40 - 20,
        Math.random() * 80 - 40,
        Math.random() * 40 - 20
      ];
      
      // Base positions scattered around the center
      const angle = (i / skillsData.length) * Math.PI * 2;
      const radius = 100 + Math.random() * 40;
      const baseX = Math.cos(angle) * radius;
      const baseY = Math.sin(angle) * radius;

      return { xKeyframes, yKeyframes, baseX, baseY, duration: 15 + Math.random() * 10 };
    });
  }, [skillsData]);

  if (orbPaths.length === 0) return null;

  return (
    <div className="relative w-full h-[350px] flex items-center justify-center overflow-hidden touch-none">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
        <div className="w-[200px] h-[200px] rounded-full blur-[80px]" style={{ background: `hsl(${themeHue}, 70%, 65%)` }} />
      </div>

      {skillsData.map((item, index) => {
        const isActive = activeNodeId === item.id;
        const Icon = item.icon;
        const path = orbPaths[index];

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            className="absolute z-10"
            style={{ 
              x: isActive ? 0 : path.baseX, 
              y: isActive ? 0 : path.baseY,
              zIndex: isActive ? 50 : 10
            }}
          >
            {/* The Floating Container */}
            <motion.div
              animate={
                isActive
                  ? { x: 0, y: 0 } // Stop floating when active
                  : { x: path.xKeyframes, y: path.yKeyframes } // Float randomly
              }
              transition={{
                duration: path.duration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveNodeId(item.id);
              }}
              className="relative cursor-pointer group flex flex-col items-center justify-center"
            >
              {/* Orb Glass Body */}
              <div
                className={`flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-500 ${
                  isActive 
                    ? "w-20 h-20 bg-[#111317]/90 scale-110 shadow-2xl" 
                    : "w-14 h-14 bg-[#111317]/60 hover:scale-105 border-white/10"
                }`}
                style={
                  isActive
                    ? {
                        border: `1px solid hsla(${themeHue}, 70%, 65%, 0.6)`,
                        boxShadow: `0 0 40px hsla(${themeHue}, 70%, 65%, 0.4), inset 0 0 20px hsla(${themeHue}, 70%, 65%, 0.2)`,
                      }
                    : {}
                }
              >
                <Icon
                  className={`transition-colors duration-500 ${isActive ? "w-8 h-8" : "w-6 h-6 text-on-surface/70"}`}
                  style={isActive ? { color: `hsl(${themeHue}, 75%, 75%)` } : {}}
                />
              </div>

              {/* Title Badge (Visible only on non-active to give context, or hidden?) */}
              {/* We hide the title on non-active to keep it clean, but show it on active since it snaps to center */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 15 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full whitespace-nowrap text-center"
                  >
                    <span 
                      className="font-label-sm tracking-[0.1em] px-3 py-1 rounded-full border border-white/5 bg-black/50 backdrop-blur-md"
                      style={{ color: `hsl(${themeHue}, 75%, 75%)` }}
                    >
                      {item.title}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
