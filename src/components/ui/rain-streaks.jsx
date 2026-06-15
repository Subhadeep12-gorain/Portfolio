import { useEffect, useRef, useCallback } from 'react';

/**
 * RainStreaks — Canvas-based rain overlay for the Technical Mastery section.
 * Renders 50 subtle vertical rain streaks with a slight rightward wind angle (~12°).
 * Uses requestAnimationFrame for smooth animation, ResizeObserver for responsive sizing.
 * Respects prefers-reduced-motion by rendering a single static frame.
 *
 * @param {number} [count=50] - Number of rain streaks (40–60 recommended)
 */
export function RainStreaks({ count = 50 }) {
  const canvasRef = useRef(null);
  const parentRef = useRef(null);
  const animFrameRef = useRef(null);
  const streaksRef = useRef([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // Wind angle in radians (~12° rightward tilt)
  const ANGLE_RAD = (12 * Math.PI) / 180;
  const SIN_A = Math.sin(ANGLE_RAD);
  const COS_A = Math.cos(ANGLE_RAD);

  // Streak color — very subtle cool blue-white
  const STREAK_COLOR = 'rgba(180, 200, 255, 0.08)';

  /** Create a single streak with randomised properties */
  const createStreak = useCallback((canvasWidth, canvasHeight, startAtTop = false) => {
    const length = 15 + Math.random() * 25;  // 15–40px
    const speed = 2 + Math.random() * 3;     // 2–5px per frame
    return {
      x: Math.random() * (canvasWidth + 60) - 30,  // slight overflow for angled entry
      y: startAtTop
        ? -(Math.random() * canvasHeight * 0.3)     // stagger above viewport on init
        : -(Math.random() * 40),                     // just above top on reset
      length,
      speed,
      // Slight per-streak opacity variation (0.6–1.0 of base) for depth
      opacity: 0.6 + Math.random() * 0.4,
    };
  }, []);

  /** Initialise all streaks, scattered vertically for an immediate rainfall look */
  const initStreaks = useCallback((width, height) => {
    const streaks = [];
    for (let i = 0; i < count; i++) {
      const s = createStreak(width, height, false);
      // Scatter initial y positions across the full canvas height
      s.y = Math.random() * height;
      streaks.push(s);
    }
    return streaks;
  }, [count, createStreak]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    parentRef.current = parent;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /** Sync canvas size to parent container */
    const syncSize = () => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dimensionsRef.current = { width: w, height: h };
    };

    syncSize();
    streaksRef.current = initStreaks(
      dimensionsRef.current.width,
      dimensionsRef.current.height
    );

    /** Draw a single frame */
    const drawFrame = () => {
      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = STREAK_COLOR;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      for (let i = 0; i < streaksRef.current.length; i++) {
        const s = streaksRef.current[i];

        // Compute streak endpoints with wind angle
        const dx = s.length * SIN_A;
        const dy = s.length * COS_A;

        ctx.globalAlpha = s.opacity;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + dx, s.y + dy);
        ctx.stroke();

        // Advance position
        s.y += s.speed;
        s.x += s.speed * SIN_A * 0.3; // subtle horizontal drift matching angle

        // Reset when streak falls below canvas
        if (s.y > height + 10) {
          s.x = Math.random() * (width + 60) - 30;
          s.y = -(Math.random() * 40);
          s.length = 15 + Math.random() * 25;
          s.speed = 2 + Math.random() * 3;
          s.opacity = 0.6 + Math.random() * 0.4;
        }
      }

      ctx.globalAlpha = 1;
    };

    // Reduced motion: draw one static frame, then stop
    if (prefersReducedMotion) {
      drawFrame();
      return;
    }

    /** Animation loop */
    const loop = () => {
      drawFrame();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    // Resize observer for responsive canvas
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && parent) {
      resizeObserver = new ResizeObserver(() => {
        syncSize();
      });
      resizeObserver.observe(parent);
    } else {
      // Fallback to window resize
      window.addEventListener('resize', syncSize);
    }

    return () => {
      // Clean up animation frame
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      // Clean up resize listener
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', syncSize);
      }
    };
  }, [count, initStreaks, SIN_A, COS_A, STREAK_COLOR]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
      aria-hidden="true"
    />
  );
}
