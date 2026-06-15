import { useRef, useEffect } from 'react';

export const FireflyOverlay = ({ targetRect, themeHue = 220 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set exact canvas dimensions based on container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle System
    const particles = [];
    const numParticles = 40;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        baseVx: (Math.random() - 0.5) * 0.5,
        baseVy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Calculate target center from the rect if available
      let targetX = null;
      let targetY = null;
      
      if (targetRect && canvas.parentElement) {
        const parentRect = canvas.parentElement.getBoundingClientRect();
        targetX = targetRect.left - parentRect.left + targetRect.width / 2;
        targetY = targetRect.top - parentRect.top + targetRect.height / 2;
      }

      particles.forEach(p => {
        // Wobble motion
        p.x += Math.sin(time + p.phase) * 0.5;
        p.y += Math.cos(time + p.phase) * 0.5;

        // Gravitational pull if there is a target
        if (targetX !== null && targetY !== null) {
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            // Force strength depends on distance (pulls them smoothly to the input)
            const force = Math.min(0.02, 50 / (distance + 50));
            p.vx += dx * force * 0.05;
            p.vy += dy * force * 0.05;
          }
          
          // Apply friction so they don't orbit wildly
          p.vx *= 0.95;
          p.vy *= 0.95;
        } else {
          // Slowly return to base velocities if no target
          p.vx += (p.baseVx - p.vx) * 0.05;
          p.vy += (p.baseVy - p.vy) * 0.05;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Glowing pulse
        const currentOpacity = p.opacity + Math.sin(time * 3 + p.phase) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${themeHue}, 90%, 75%, ${Math.max(0, currentOpacity)})`;
        ctx.fill();
        
        // Add a soft glow behind the particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${themeHue}, 90%, 65%, ${Math.max(0, currentOpacity * 0.3)})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetRect, themeHue]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
