import { useState, useEffect } from 'react';

const FOG_CONFIGS = [
  { width: '450px', height: '120px', top: '10%', left: '5%', opacity: 0.10, duration: '28s', delay: '-3s', anim: 'drift' },
  { width: '350px', height: '90px', top: '22%', left: '45%', opacity: 0.08, duration: '22s', delay: '-7s', anim: 'drift-reverse' },
  { width: '500px', height: '140px', top: '35%', left: '-10%', opacity: 0.12, duration: '32s', delay: '-12s', anim: 'drift' },
  { width: '400px', height: '110px', top: '48%', left: '60%', opacity: 0.10, duration: '25s', delay: '-5s', anim: 'drift-reverse' },
  { width: '300px', height: '80px', top: '58%', left: '20%', opacity: 0.08, duration: '20s', delay: '-15s', anim: 'drift' },
  { width: '480px', height: '130px', top: '70%', left: '-5%', opacity: 0.12, duration: '35s', delay: '-18s', anim: 'drift-reverse' },
  { width: '380px', height: '100px', top: '82%', left: '50%', opacity: 0.10, duration: '26s', delay: '-9s', anim: 'drift' },
  { width: '420px', height: '115px', top: '15%', left: '70%', opacity: 0.10, duration: '30s', delay: '-22s', anim: 'drift-reverse' },
  { width: '320px', height: '85px', top: '65%', left: '75%', opacity: 0.08, duration: '24s', delay: '-1s', anim: 'drift' },
  { width: '460px', height: '125px', top: '40%', left: '30%', opacity: 0.14, duration: '33s', delay: '-25s', anim: 'drift-reverse' },
  { width: '370px', height: '95px', top: '5%', left: '40%', opacity: 0.08, duration: '21s', delay: '-10s', anim: 'drift' },
  { width: '490px', height: '135px', top: '88%', left: '10%', opacity: 0.12, duration: '34s', delay: '-4s', anim: 'drift-reverse' }
];

export function FogEllipses() {
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
        @keyframes drift {
          0% { transform: translateX(-80px); }
          100% { transform: translateX(80px); }
        }
        @keyframes drift-reverse {
          0% { transform: translateX(80px); }
          100% { transform: translateX(-80px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fog-ellipse-animated {
            animation: none !important;
          }
        }
      `}</style>
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden select-none" 
        style={{ zIndex: 2 }}
      >
        {FOG_CONFIGS.map((config, index) => {
          const animationStyle = shouldAnimate 
            ? `${config.anim} ${config.duration} ease-in-out ${config.delay} infinite alternate` 
            : 'none';

          return (
            <div
              key={index}
              className="absolute fog-ellipse-animated"
              style={{
                width: config.width,
                height: config.height,
                top: config.top,
                left: config.left,
                opacity: config.opacity,
                backgroundColor: 'rgba(210, 200, 230, 1)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: animationStyle,
                willChange: shouldAnimate ? 'transform' : 'auto',
              }}
            />
          );
        })}
      </div>
    </>
  );
}

export default FogEllipses;
