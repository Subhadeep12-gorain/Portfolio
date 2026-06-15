import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MagneticButton = ({ 
  children, 
  href, 
  className = "", 
  themeHue = 220,
  icon: Icon
}) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Move the button slightly towards the cursor
    x.set(distanceX * 0.2);
    y.set(distanceY * 0.2);

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
      className={`relative flex items-center gap-3 px-6 py-4 rounded-full backdrop-blur-md cursor-pointer transition-colors duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div 
        className="absolute inset-0 rounded-full z-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: isHovered ? `hsla(${themeHue}, 70%, 65%, 0.15)` : `hsla(${themeHue}, 70%, 65%, 0.05)`,
          border: `1px solid hsla(${themeHue}, 70%, 65%, ${isHovered ? 0.4 : 0.15})`,
          boxShadow: isHovered ? `0 0 20px hsla(${themeHue}, 70%, 65%, 0.2)` : 'none'
        }}
      />
      <div className="relative z-10 flex items-center gap-3">
        {Icon && <Icon size={18} style={{ color: isHovered ? `hsl(${themeHue}, 80%, 75%)` : '#a1a1aa' }} className="transition-colors duration-300" />}
        <span 
          className="font-label-sm text-xs tracking-[0.2em] uppercase transition-colors duration-300"
          style={{ color: isHovered ? 'white' : '#a1a1aa' }}
        >
          {children}
        </span>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block w-fit">
        {content}
      </a>
    );
  }

  return <div className="w-fit">{content}</div>;
};
