import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────
// CARD 1: Japan Tourism Demand Forecasting
// Animated SVG — Japan map outline + pulsing city nodes + draw-on lines
// ─────────────────────────────────────────────
const CITIES = [
  { id: 'sapporo',   x: 155, y: 52,  label: 'Sapporo' },
  { id: 'tokyo',     x: 148, y: 185, label: 'Tokyo' },
  { id: 'kyoto',     x: 118, y: 210, label: 'Kyoto' },
  { id: 'osaka',     x: 120, y: 225, label: 'Osaka' },
  { id: 'hiroshima', x: 96,  y: 228, label: 'Hiroshima' },
  { id: 'fukuoka',   x: 72,  y: 252, label: 'Fukuoka' },
];

const CONNECTIONS = [
  ['sapporo', 'tokyo'],
  ['tokyo', 'kyoto'],
  ['kyoto', 'osaka'],
  ['osaka', 'hiroshima'],
  ['hiroshima', 'fukuoka'],
  ['tokyo', 'osaka'],
];

const JAPAN_PATH =
  // Simplified stylised outline — Honshu + Hokkaido suggestion
  'M156 42 C158 40 163 38 165 40 C168 44 162 54 158 58 C155 62 152 72 153 78 C154 84 158 88 158 95 C158 105 154 112 153 120 C152 128 155 134 155 142 C155 150 152 160 150 168 C148 176 150 184 150 190 C150 196 148 200 147 206 C146 212 148 216 148 220 C148 224 146 226 144 228 C142 230 138 228 136 226 C133 222 132 218 130 214 C128 210 124 208 122 206 C120 204 118 206 116 208 C114 210 110 212 108 210 C106 208 104 204 102 200 C100 196 96 194 94 196 C92 198 92 204 90 208 C88 212 84 214 82 218 C80 222 78 226 76 228 C74 230 70 230 68 228 C66 226 66 222 67 218 C68 214 70 210 72 206 C74 202 76 196 78 190 C80 184 84 178 86 172 C88 166 88 160 90 154 C92 148 96 144 100 140 C104 136 108 132 112 128 C116 124 120 120 122 116 C124 112 124 108 126 104 C128 100 130 96 130 90 C130 84 128 78 128 72 C128 66 130 60 132 54 C134 48 138 44 140 40 C142 36 146 36 148 38 C150 40 154 42 156 42Z';

export function JapanMapVisual({ isHovered }) {
  const lineLength = 320; // approx stroke dash

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ background: 'rgb(10,12,18)' }}
    >
      <svg
        viewBox="0 0 240 310"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.9 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Japan outline */}
        <path
          d={JAPAN_PATH}
          fill="none"
          stroke="rgba(251,179,193,0.15)"
          strokeWidth="1.2"
        />

        {/* Connection lines with draw-on effect */}
        {CONNECTIONS.map(([fromId, toId], i) => {
          const from = CITIES.find(c => c.id === fromId);
          const to   = CITIES.find(c => c.id === toId);
          return (
            <motion.line
              key={`line-${i}`}
              x1={from.x} y1={from.y}
              x2={to.x}   y2={to.y}
              stroke="rgba(251,179,193,0.12)"
              strokeWidth="0.8"
              strokeDasharray={lineLength}
              initial={{ strokeDashoffset: lineLength }}
              animate={isHovered ? { strokeDashoffset: 0 } : { strokeDashoffset: lineLength }}
              transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: 'easeInOut' }}
            />
          );
        })}

        {/* City nodes */}
        {CITIES.map((city, i) => (
          <g key={city.id}>
            {/* Outer pulse ring */}
            <motion.circle
              cx={city.x} cy={city.y} r={6}
              fill="none"
              stroke="rgba(251,179,193,0.2)"
              strokeWidth="0.8"
              animate={isHovered ? { scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] } : { scale: 1, opacity: 0 }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
              style={{ transformOrigin: `${city.x}px ${city.y}px` }}
            />
            {/* Core dot */}
            <motion.circle
              cx={city.x} cy={city.y} r={3}
              fill="#fbb3c1"
              animate={isHovered ? { scale: [1, 1.3, 1], opacity: [0.9, 1, 0.9] } : { scale: 1, opacity: 0.5 }}
              transition={{ duration: 2 + i * 0.25, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
              style={{ transformOrigin: `${city.x}px ${city.y}px` }}
            />
            {/* Label */}
            <text
              x={city.x + 6} y={city.y + 4}
              fontSize="6"
              fill="rgba(251,179,193,0.5)"
              fontFamily="monospace"
            >
              {city.label}
            </text>
          </g>
        ))}

        {/* Corner HUD brackets */}
        <path d="M4 4 L4 12 M4 4 L12 4" stroke="rgba(251,179,193,0.2)" strokeWidth="1" fill="none"/>
        <path d="M236 4 L236 12 M236 4 L228 4" stroke="rgba(251,179,193,0.2)" strokeWidth="1" fill="none"/>
        <path d="M4 306 L4 298 M4 306 L12 306" stroke="rgba(251,179,193,0.2)" strokeWidth="1" fill="none"/>
        <path d="M236 306 L236 298 M236 306 L228 306" stroke="rgba(251,179,193,0.2)" strokeWidth="1" fill="none"/>
      </svg>

      {/* Subtle scanner sweep */}
      <motion.div
        className="absolute left-0 w-full pointer-events-none"
        style={{ height: '2px', background: 'linear-gradient(90deg, transparent, rgba(251,179,193,0.12), transparent)' }}
        animate={isHovered ? { top: ['0%', '100%', '0%'] } : { top: '0%' }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// CARD 2: Food Ordering App — Phone UI Demo
// ─────────────────────────────────────────────
export function PhoneAppVisual({ isHovered }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(251,179,193,0.04) 0%, rgb(10,12,18) 70%)' }}
    >
      {/* Phone frame */}
      <div
        className="relative"
        style={{
          width: 110,
          height: 200,
          borderRadius: 20,
          border: '1.5px solid rgba(251,179,193,0.25)',
          background: 'rgba(10,12,20,0.85)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 30px rgba(251,179,193,0.08), inset 0 0 20px rgba(251,179,193,0.03)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '14px 10px 10px',
        }}
      >
        {/* Notch */}
        <div style={{ width: 36, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', marginBottom: 10, flexShrink: 0 }} />

        {/* Scrolling menu rows */}
        <div style={{ width: '100%', flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div className="phone-menu-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 8, animationPlayState: isHovered ? 'running' : 'paused' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 28,
                  borderRadius: 6,
                  background: i % 3 === 0
                    ? 'rgba(251,179,193,0.08)'
                    : 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(251,179,193,0.1)',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Shimmer on every 3rd row */}
                {i % 3 === 0 && (
                  <div className="phone-shimmer-row" style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(251,179,193,0.18) 50%, transparent 100%)',
                    transform: 'translateX(-100%)',
                    animationPlayState: isHovered ? 'running' : 'paused'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav indicator */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ width: i === 1 ? 18 : 6, height: 4, borderRadius: 2, background: i === 1 ? 'rgba(251,179,193,0.6)' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
      </div>

      {/* Ambient glow behind phone */}
      <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(251,179,193,0.06)', filter: 'blur(40px)', zIndex: 0 }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// CARD 3: Ecommerce Platform — Product Grid with Scan Line
// ─────────────────────────────────────────────
export function EcommerceVisual({ isHovered }) {
  const [activeCell, setActiveCell] = useState(0);

  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setActiveCell(p => (p + 1) % 6);
    }, 700);
    return () => clearInterval(interval);
  }, [isHovered]);

  const SHAPES = [
    { w: '100%', h: 80 },
    { w: '100%', h: 65 },
    { w: '100%', h: 80 },
    { w: '100%', h: 72 },
    { w: '100%', h: 60 },
    { w: '100%', h: 80 },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ background: 'rgb(10,12,18)', padding: '20px 16px' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {SHAPES.map((s, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: activeCell === i ? 1 : 0.25,
              borderColor: activeCell === i ? 'rgba(251,179,193,0.4)' : 'rgba(251,179,193,0.06)',
              boxShadow: activeCell === i ? '0 0 10px rgba(251,179,193,0.1)' : '0 0 0px transparent',
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              height: s.h,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(251,179,193,0.06)',
            }}
          />
        ))}
      </div>

      {/* Scan line */}
      <motion.div
        className="absolute left-0 w-full pointer-events-none"
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(251,179,193,0.04), transparent)',
          zIndex: 10,
        }}
        animate={isHovered ? { top: ['0%', '100%'] } : { top: '0%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// CARD 4: GitHub Contribution Heatmap
// Seeded realistic-looking contribution data
// ─────────────────────────────────────────────
function seededRandom(seed) {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateHeatmapData(weeks = 26, days = 7) {
  const data = [];
  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < days; d++) {
      const raw = seededRandom(w * 7 + d);
      // Bias toward realistic contribution patterns — mostly empty, some bursts
      let level = 0;
      if (raw > 0.65) level = 1;
      if (raw > 0.80) level = 2;
      if (raw > 0.90) level = 3;
      if (raw > 0.96) level = 4;
      // Weekends less active
      if (d === 0 || d === 6) level = Math.max(0, level - 1);
      week.push(level);
    }
    data.push(week);
  }
  return data;
}

const INTENSITY = [
  'rgba(255,255,255,0.03)',       // 0 — empty
  'rgba(251,179,193,0.2)',        // 1 — low
  'rgba(251,179,193,0.4)',        // 2 — medium
  'rgba(251,179,193,0.65)',       // 3 — high
  'rgba(251,179,193,0.9)',        // 4 — peak
];

const heatmapData = generateHeatmapData(26, 7);

export function GitHubHeatmapVisual() {
  return (
    <div
      className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden gap-3 px-4"
      style={{ background: 'transparent' }}
    >
      {/* Grid */}
      <div style={{ display: 'flex', gap: 3 }}>
        {heatmapData.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {week.map((level, di) => (
              <motion.div
                key={di}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (wi * 7 + di) * 0.002, duration: 0.2 }}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: INTENSITY[level],
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
