import { useState, useEffect } from 'react';

const RAY_CONFIGS = [
  { left: '10%', width: '50px', rotate: '32deg', duration: '10.5s', delay: '-1.5s' },
  { left: '28%', width: '70px', rotate: '35deg', duration: '13.5s', delay: '-4.2s' },
  { left: '52%', width: '40px', rotate: '38deg', duration: '9s', delay: '-2.8s' },
  { left: '74%', width: '60px', rotate: '34deg', duration: '12s', delay: '-5.7s' }
];

export function LightRays() {
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setShouldAnimate(!e.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  return (
    <>
      <style>{`
        @keyframes ray-pulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ray-shaft {
            animation: none !important;
            opacity: 0.2 !important;
          }
        }
      `}</style>
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none select-none" 
        style={{ zIndex: 2 }}
      >
        {RAY_CONFIGS.map((ray, index) => {
          const animationStyle = shouldAnimate 
            ? `ray-pulse ${ray.duration} ease-in-out ${ray.delay} infinite` 
            : 'none';
          
          return (
            <div
              key={index}
              className="absolute ray-shaft"
              style={{
                top: 0,
                bottom: 0,
                left: ray.left,
                width: ray.width,
                transform: `rotate(${ray.rotate})`,
                transformOrigin: 'top center',
                background: 'linear-gradient(to bottom, rgba(255, 220, 150, 0.015) 0%, rgba(255, 220, 150, 0.0025) 70%, transparent 100%)',
                animation: animationStyle,
                opacity: shouldAnimate ? undefined : 0.2,
                willChange: shouldAnimate ? 'opacity' : 'auto',
                mixBlendMode: 'screen',
              }}
            />
          );
        })}
      </div>
    </>
  );
}

export default LightRays;
