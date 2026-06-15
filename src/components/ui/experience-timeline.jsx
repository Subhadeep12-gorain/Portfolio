import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslation } from 'react-i18next';

// ═══════════════════════════════════════════════════════════════
// Journey Data — ordered most recent (bottom of curve) → oldest
// ═══════════════════════════════════════════════════════════════
// journeyItems removed from here, defined inside ExperienceTimeline instead
// ═══════════════════════════════════════════════════════════════
// Pin Config — Desktop  (viewBox 1000 × 700)
// ═══════════════════════════════════════════════════════════════
const VB = { w: 1000, h: 700 };

// PINS are computed at runtime from themeHue — see ExperienceTimeline component

// S-curve winding from bottom-left → top-right
const ROAD = [
  "M 150 700",
  "C 150 660 210 605 250 580",
  "C 330 535 440 488 540 460",
  "C 625 436 460 368 340 340",
  "C 230 316 510 264 690 248",
  "C 808 238 570 182 440 162",
  "C 335 147 640 102 790 88",
  "C 870 80 945 72 985 68",
].join(" ");

// ═══════════════════════════════════════════════════════════════
// Pin shape generator — teardrop with point at (0, 0) rising up
// ═══════════════════════════════════════════════════════════════
function pinPath(r) {
  const h  = r * 1.55;      // circle-centre distance from point
  const k  = r * 0.552;     // bezier magic number for circle
  const nk = r * 0.35;      // narrow-waist control

  return [
    "M 0 0",
    `C ${nk} ${-r * 0.38} ${r} ${-h + k} ${r} ${-h}`,
    `C ${r} ${-h - k} ${k} ${-h - r} 0 ${-h - r}`,
    `C ${-k} ${-h - r} ${-r} ${-h - k} ${-r} ${-h}`,
    `C ${-r} ${-h + k} ${-nk} ${-r * 0.38} 0 0`,
    "Z",
  ].join(" ");
}

// ═══════════════════════════════════════════════════════════════
// Heading — per-character reveal (kept from original)
// ═══════════════════════════════════════════════════════════════
function TimelineHeading({ show, themeHue = 220, t }) {
  const TITLE_CHARS = t('experience.section_label').split("");
  const SUB_CHARS   = t('experience.title').split("");
  return (
    <div className="flex flex-col items-center mb-16">
      {/* Tracking label */}
      <div className="flex justify-center gap-[2px] mb-1">
        {TITLE_CHARS.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 16, rotateX: 90 }}
            animate={show ? { opacity: 1, y: 0, rotateX: 0 }
                         : { opacity: 0, y: 16, rotateX: 90 }}
            transition={{ duration: 0.4, delay: i * 0.04, type: "spring" }}
            className="inline-block font-sans text-[0.65rem] tracking-[0.2em] uppercase"
            style={{ color: `hsla(${themeHue}, 70%, 72%, 0.55)` }}
          >
            {ch}
          </motion.span>
        ))}
      </div>

      {/* Main heading */}
      <div className="flex justify-center gap-[3px]">
        {SUB_CHARS.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "blur(10px)", scale: 1.4 }}
            animate={show ? { opacity: 1, filter: "blur(0px)", scale: 1 }
                         : { opacity: 0, filter: "blur(10px)", scale: 1.4 }}
            transition={{ duration: 0.5, delay: i * 0.06 + 0.2 }}
            className="inline-block font-serif text-[2.2rem] md:text-[3.5rem] text-white font-normal tracking-wide"
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Desktop — horizontal S-curve with pins + labels
// ═══════════════════════════════════════════════════════════════
function DesktopTimeline({ show, fast, pins, themeHue = 220, items }) {
  const dur  = fast ? 0 : 1.8;
  const base = fast ? 0 : 0.35;
  const step = fast ? 0 : 0.25;
  const lbl  = fast ? 0 : 0.15;

  return (
    <div
      className="hidden md:block relative mx-auto"
      style={{ maxWidth: 1100, aspectRatio: `${VB.w} / ${VB.h}` }}
    >
      {/* ── SVG canvas ── */}
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <defs>
          {/* blurred shadow behind the road */}
          <filter id="roadBlur" x="-10%" y="-10%" width="120%" height="130%">
            <feGaussianBlur stdDeviation="5" />
          </filter>

          {/* drop-shadow on pins */}
          <filter id="pinDrop" x="-50%" y="-30%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3"
              floodColor="rgba(0,0,0,0.35)" />
          </filter>

          {/* glow on the "current" pin — themeHue */}
          <filter id="curGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="b" />
            <feFlood floodColor={`hsl(${themeHue}, 75%, 72%)`} floodOpacity="0.45" result="c" />
            <feComposite in="c" in2="b" operator="in" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* highlight gradient for pins */}
          <linearGradient id="pinHL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(255,255,255,0.35)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* ── Road shadow ── */}
        <g transform="translate(3 5)">
          <motion.path
            d={ROAD}
            stroke="rgba(0,0,0,0.10)"
            strokeWidth={24}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#roadBlur)"
            initial={{ pathLength: 0 }}
            animate={show ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: dur, ease: "easeInOut" }}
          />
        </g>

        {/* ── Road main — silver per vision doc ── */}
        <motion.path
          d={ROAD}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={20}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={show ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: dur, ease: "easeInOut" }}
        />

        {/* ── Road center highlight ── */}
        <motion.path
          d={ROAD}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={show ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: dur, ease: "easeInOut", delay: 0.15 }}
        />

        {/* ── Looping moving dot on the timeline ── */}
        {show && (
          <circle r="6" fill={`hsl(${themeHue}, 80%, 75%)`} filter="url(#curGlow)">
            <animateMotion 
              dur="12s" 
              repeatCount="indefinite" 
              path={ROAD} 
            />
          </circle>
        )}

        {/* ── Pin markers ── */}
        {pins.map((pin, i) => {
          const item  = items[i];
          const delay = base + i * step;

          return (
            <g key={i} transform={`translate(${pin.x} ${pin.y})`}>
              {/* shadow ellipse at base */}
              <motion.ellipse
                cx={0} cy={4}
                rx={pin.r * 0.4} ry={3}
                fill="rgba(0,0,0,0.22)"
                initial={{ opacity: 0 }}
                animate={show ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay }}
              />

              <motion.g
                style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                initial={{ scale: 0, opacity: 0 }}
                animate={show
                  ? { scale: [0, 1.18, 0.95, 1], opacity: 1 }
                  : { scale: 0, opacity: 0 }}
                transition={{
                  duration: fast ? 0 : 0.65,
                  delay,
                  times: [0, 0.45, 0.72, 1],
                  ease: "easeOut",
                }}
                filter={item.isCurrent ? "url(#curGlow)" : "url(#pinDrop)"}
              >
                {/* pin body */}
                <path d={pinPath(pin.r)} fill={pin.color} />

                {/* highlight overlay */}
                <path d={pinPath(pin.r)} fill="url(#pinHL)" opacity={0.45} />

                {/* year label */}
                <text
                  x={0}
                  y={-pin.r * 1.55}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={pin.r * 0.52}
                  fontWeight="700"
                  style={{ fontFamily: "'Geist', 'Manrope', sans-serif" }}
                >
                  {item.year}
                </text>
              </motion.g>
            </g>
          );
        })}
      </svg>

      {/* ── HTML label overlays ── */}
      {pins.map((pin, i) => {
        const item   = items[i];
        const delay  = base + i * step + lbl;
        const isLeft = pin.side === "left";

        const topPct = ((pin.y - pin.r * 2.8) / VB.h) * 100;

        const posStyle = isLeft
          ? { right: `${((VB.w - pin.x + pin.r * 1.4) / VB.w) * 100}%`,
              textAlign: "right" }
          : { left:  `${((pin.x + pin.r * 1.4) / VB.w) * 100}%`,
              textAlign: "left" };

        return (
          <motion.div
            key={`lbl-${i}`}
            className="absolute pointer-events-none select-none"
            style={{ top: `${topPct}%`, ...posStyle, maxWidth: "20%" }}
            initial={{ opacity: 0, x: isLeft ? 14 : -14 }}
            animate={show
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: isLeft ? 14 : -14 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
          >
            {/* Tag pill */}
            <span
              className="inline-block px-2 py-0.5 mb-1 rounded-md
                         text-[9px] font-mono tracking-wider uppercase border"
              style={{
                color: pin.color,
                borderColor: `${pin.color}33`,
                backgroundColor: `${pin.color}0D`,
              }}
            >
              {item.tag}
            </span>

            {/* Title */}
            <h4
              className="text-white font-serif tracking-wide leading-tight"
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "clamp(0.82rem, 1.15vw, 1.05rem)",
              }}
            >
              {item.title}
            </h4>

            {/* Description */}
            <p
              className="text-white/50 leading-snug mt-0.5"
              style={{ fontSize: "clamp(0.58rem, 0.8vw, 0.72rem)" }}
            >
              {item.desc}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Mobile — vertical winding path
// ═══════════════════════════════════════════════════════════════
const MOB_PATH =
  "M 50 0 C 15 60 85 100 50 150 C 15 200 85 260 50 310 " +
  "C 15 360 85 420 50 470 C 15 520 85 570 50 620 " +
  "C 15 670 85 720 50 770 C 30 810 60 830 50 860";

function MobileTimeline({ show, fast, pins, themeHue = 220, items }) {
  const base = fast ? 0 : 0.2;
  const step = fast ? 0 : 0.18;

  return (
    <div className="md:hidden relative max-w-sm mx-auto px-2">
      {/* Winding vertical path background */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 top-0 h-full"
        viewBox="0 0 100 860"
        preserveAspectRatio="none"
        fill="none"
        style={{ width: "75%" }}
      >
        <motion.path
          d={MOB_PATH}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={show ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: fast ? 0 : 1.2, ease: "easeInOut" }}
        />

        {/* ── Looping moving dot on the timeline ── */}
        {show && (
          <circle r="4" fill="white" style={{ filter: `drop-shadow(0 0 6px hsl(${themeHue}, 80%, 75%))` }}>
            <animateMotion 
              dur="8s" 
              repeatCount="indefinite" 
              path={MOB_PATH} 
            />
          </circle>
        )}
      </svg>

      {/* Cards */}
      <div className="relative z-10 space-y-7 py-4">
        {items.map((item, i) => {
          const pin    = pins[i];
          const isLeft = i % 2 === 0;
          const delay  = base + i * step;

          return (
            <motion.div
              key={i}
              className={`flex items-start gap-3
                ${isLeft ? "flex-row" : "flex-row-reverse"}`}
              initial={{ opacity: 0, y: 18 }}
              animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.5, delay }}
            >
              {/* Pin marker */}
              <motion.div
                className="flex-shrink-0 mt-1"
                initial={{ scale: 0 }}
                animate={show
                  ? { scale: [0, 1.2, 0.95, 1] }
                  : { scale: 0 }}
                transition={{
                  duration: fast ? 0 : 0.55,
                  delay,
                  times: [0, 0.45, 0.72, 1],
                }}
              >
                <svg width="38" height="54" viewBox="-19 -48 38 54">
                  <defs>
                    <linearGradient id={`mHL${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="rgba(255,255,255,0.3)" />
                      <stop offset="55%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>
                  <ellipse cx={0} cy={3} rx={6} ry={2.5}
                    fill="rgba(0,0,0,0.2)" />
                  <path d={pinPath(16)} fill={pin.color} />
                  <path d={pinPath(16)} fill={`url(#mHL${i})`} opacity={0.4} />
                  <text
                    x={0} y={-24.8}
                    textAnchor="middle" dominantBaseline="central"
                    fill="white" fontSize="8.5" fontWeight="700"
                    style={{ fontFamily: "'Geist', sans-serif" }}
                  >
                    {item.year}
                  </text>
                </svg>
              </motion.div>

              {/* Content */}
              <div className={`flex-1 min-w-0
                ${isLeft ? "text-left" : "text-right"}`}>
                {/* Tag */}
                <span
                  className="inline-block px-1.5 py-0.5 mb-1 rounded
                             text-[8px] font-mono tracking-wider uppercase border"
                  style={{
                    color: pin.color,
                    borderColor: `${pin.color}33`,
                    backgroundColor: `${pin.color}0D`,
                  }}
                >
                  {item.tag}
                </span>

                <h4
                  className="text-white font-serif text-[0.95rem] tracking-wide
                             leading-snug"
                  style={{ fontFamily: "'EB Garamond', serif" }}
                >
                  {item.title}
                </h4>

                <span
                  className="text-[#d6c2c4]/40 text-[10px] font-mono
                             tracking-wider"
                >
                  {item.org}
                </span>

                <p className="text-white/40 text-xs leading-snug mt-0.5">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Export
// ═══════════════════════════════════════════════════════════════
export default function ExperienceTimeline({ themeHue = 220 }) {
  const ref  = useRef(null);
  const show = useInView(ref, { once: false, margin: "-12%" });
  const fast = useReducedMotion();
  const { t } = useTranslation();

  const journeyItems = [
    {
      year: t('experience.year_26'),
      title: t('experience.mentor_title'),
      org: t('experience.mentor_org'),
      desc: t('experience.mentor_desc'),
      tag: t('experience.tag_leadership'),
    },
    {
      year: t('experience.year_25'),
      title: t('experience.jlpt_title'),
      org: t('experience.jlpt_org'),
      desc: t('experience.jlpt_desc'),
      tag: t('experience.tag_languages'),
    },
    {
      year: t('experience.year_25'),
      title: t('experience.research_title'),
      org: t('experience.research_org'),
      desc: t('experience.research_desc'),
      tag: t('experience.tag_research'),
    },
    {
      year: t('experience.year_25'),
      title: t('experience.intern_title'),
      org: t('experience.intern_org'),
      desc: t('experience.intern_desc'),
      tag: t('experience.tag_engineering'),
    },
    {
      year: t('experience.year_24'),
      title: t('experience.sih_title'),
      org: t('experience.sih_org'),
      desc: t('experience.sih_desc'),
      tag: t('experience.tag_competition'),
    },
    {
      year: t('experience.year_22'),
      title: t('experience.edu_title'),
      org: t('experience.edu_org'),
      desc: t('experience.edu_desc'),
      tag: t('experience.tag_education'),
    },
  ];

  // Compute pin colors from themeHue — gradient from bright → dark across 6 steps
  const pins = [
    { x: 250, y: 580, r: 42, color: `hsl(${themeHue}, 75%, 72%)`,  side: "left"  },
    { x: 540, y: 460, r: 36, color: `hsl(${themeHue}, 68%, 64%)`,  side: "right" },
    { x: 340, y: 340, r: 31, color: `hsl(${themeHue}, 62%, 56%)`,  side: "left"  },
    { x: 690, y: 248, r: 27, color: `hsl(${themeHue}, 55%, 48%)`,  side: "right" },
    { x: 440, y: 162, r: 24, color: `hsl(${themeHue}, 50%, 40%)`,  side: "left"  },
    { x: 790, y: 88,  r: 21, color: `hsl(${themeHue}, 45%, 33%)`,  side: "right" },
  ];

  return (
    <div ref={ref} className="w-full py-4">
      <TimelineHeading show={show} themeHue={themeHue} t={t} key={t('experience.title')} />
      <DesktopTimeline show={show} fast={fast} pins={pins} themeHue={themeHue} items={journeyItems} />
      <MobileTimeline  show={show} fast={fast} pins={pins} themeHue={themeHue} items={journeyItems} />
    </div>
  );
}
