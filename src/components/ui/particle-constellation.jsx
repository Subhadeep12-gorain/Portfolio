/**
 * ParticleConstellation
 *
 * 50 dots drifting slowly. Dots connect with thin lines when within range.
 * Dot opacity: 0.08   Line opacity: 0.03
 * Color: themeHue tinted
 * Fullscreen, fixed, pointer-events none, z-index 0.
 */
import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 50;
const CONNECT_DIST   = 140; // px — max dist to draw connection line
const DRIFT_SPEED    = 0.28;

export function ParticleConstellation({ themeHue = 220 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let raf;
    let particles = [];

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * DRIFT_SPEED,
      vy: (Math.random() - 0.5) * DRIFT_SPEED,
      r:  1 + Math.random() * 1.5,
    }));

    const dotColor  = `hsla(${themeHue}, 70%, 72%, 0.08)`;
    const lineBase  = `hsla(${themeHue}, 60%, 65%,`;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + wrap
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0)             p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0)             p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = 0.03 * (1 - dist / CONNECT_DIST);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${lineBase}${alpha})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      ctx.fillStyle = dotColor;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [themeHue]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'block',
      }}
    />
  );
}
