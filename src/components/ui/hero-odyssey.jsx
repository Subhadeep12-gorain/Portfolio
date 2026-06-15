import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SplitHeading } from './split-heading';

// ─────────────────────────────────────────────────────────────────────────────
// HeroTypewriter — unchanged
// ─────────────────────────────────────────────────────────────────────────────
const HeroTypewriter = ({ text, delay = 0.5, speed = 100, loop = false, textClassName = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const run = () => {
      if (!isDeleting) {
        if (displayText.length < text.length) {
          timer = setTimeout(() => setDisplayText(text.slice(0, displayText.length + 1)), speed);
        } else if (loop) {
          timer = setTimeout(() => setIsDeleting(true), 3000);
        }
      } else {
        if (displayText.length > 0) {
          timer = setTimeout(() => setDisplayText(text.slice(0, displayText.length - 1)), speed / 2);
        } else {
          timer = setTimeout(() => setIsDeleting(false), 1000);
        }
      }
    };
    if (displayText === '' && !isDeleting && delay > 0) {
      const t = setTimeout(run, delay * 1000);
      return () => clearTimeout(t);
    } else {
      run();
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text, speed, loop, delay]);

  const showCursor = !loop ? displayText.length < text.length : true;

  return (
    <span className="relative inline-block">
      <span className={textClassName}>{displayText}</span>
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'steps(2)' }}
          className="inline-block w-[3px] h-[0.8em] bg-[#fbb3c1] ml-1 align-middle"
        />
      )}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Lightning — WebGL canvas, fully unchanged
// ─────────────────────────────────────────────────────────────────────────────
const Lightning = ({ hue = 230, xOffset = 0, speed = 1, intensity = 1, size = 1 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeCanvas = () => { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vertSrc = `attribute vec2 aPosition; void main(){gl_Position=vec4(aPosition,0.0,1.0);}`;
    const fragSrc = `
      precision mediump float;
      uniform vec2 iResolution; uniform float iTime,uHue,uXOffset,uSpeed,uIntensity,uSize;
      #define N 10
      vec3 hsv2rgb(vec3 c){vec3 r=clamp(abs(mod(c.x*6.+vec3(0,4,2),6.)-3.)-1.,0.,1.);return c.z*mix(vec3(1),r,c.y);}
      float h11(float p){p=fract(p*.1031);p*=p+33.33;p*=p+p;return fract(p);}
      float h12(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
      mat2 r2d(float t){return mat2(cos(t),-sin(t),sin(t),cos(t));}
      float ns(vec2 p){vec2 i=floor(p),f=fract(p);float a=h12(i),b=h12(i+vec2(1,0)),c=h12(i+vec2(0,1)),d=h12(i+1.);vec2 t=smoothstep(0.,1.,f);return mix(mix(a,b,t.x),mix(c,d,t.x),t.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<N;++i){v+=a*ns(p);p*=r2d(.45);p*=2.;a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;uv=2.*uv-1.;
        float aspect = iResolution.x/iResolution.y;
        uv.x *= aspect; uv.x += uXOffset;
        
        // Anchor at the top: displacement becomes 0 at uv.y = 1.0
        float disp = 2.*fbm(uv*uSize+.8*iTime*uSpeed)-1.;
        // Scale displacement by aspect so it wanders proportionally to the screen width!
        float anchor = (1.0 - uv.y) * 0.35 * aspect;
        uv.x += disp * anchor;
        
        float d=abs(uv.x);
        vec3 base=hsv2rgb(vec3(uHue/360.,.7,.8));
        vec3 col=base*pow(mix(0.,.07,h11(iTime*uSpeed))/d,1.)*uIntensity;
        gl_FragColor=vec4(col,1.);
      }
    `;

    const compile = (src, type) => {
      const s = gl.createShader(type); if (!s) return null;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    };
    const vs = compile(vertSrc, gl.VERTEX_SHADER);
    const fs = compile(fragSrc, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;
    const prog = gl.createProgram(); if (!prog) return;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
    const uR=gl.getUniformLocation(prog,'iResolution'), uT=gl.getUniformLocation(prog,'iTime'),
      uH=gl.getUniformLocation(prog,'uHue'), uX=gl.getUniformLocation(prog,'uXOffset'),
      uSp=gl.getUniformLocation(prog,'uSpeed'), uIn=gl.getUniformLocation(prog,'uIntensity'),
      uSz=gl.getUniformLocation(prog,'uSize');
    const t0 = performance.now(); let raf;
    const render = () => {
      resizeCanvas(); gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform2f(uR,canvas.width,canvas.height); gl.uniform1f(uT,(performance.now()-t0)/1000);
      gl.uniform1f(uH,hue); gl.uniform1f(uX,xOffset); gl.uniform1f(uSp,speed);
      gl.uniform1f(uIn,intensity); gl.uniform1f(uSz,size);
      gl.drawArrays(gl.TRIANGLES,0,6); raf=requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => { window.removeEventListener('resize', resizeCanvas); cancelAnimationFrame(raf); };
  }, [hue, xOffset, speed, intensity, size]);

  return <canvas ref={canvasRef} className="w-full h-full relative" />;
};

// ─────────────────────────────────────────────────────────────────────────────
// BadgeContent — pure content, no positioning
// ─────────────────────────────────────────────────────────────────────────────
const BadgeContent = ({ name, value, floatDelay = 0 }) => (
  <motion.div 
    className="group" 
    style={{ cursor: 'pointer' }}
    animate={{ y: [0, -12, 0] }}
    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: floatDelay }}
  >
    <div className="flex items-center gap-2 relative">
      <div className="relative">
        <div className="w-2 h-2 bg-white rounded-full group-hover:animate-pulse" />
        <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="text-white relative flex flex-col items-start">
        <SplitHeading style={{ display: 'block', cursor: 'pointer' }} className="font-medium">{name}</SplitHeading>
        <SplitHeading style={{ display: 'block', cursor: 'pointer', marginTop: '2px' }} className="text-white/70 text-sm">{value}</SplitHeading>
        <div className="absolute -inset-2 bg-white/10 rounded-lg blur-md opacity-70 -z-10 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────
const leftBadgeVariants = {
  visible: { x: 0, opacity: 1, transition: { duration: 1.6, ease: [0.25, 1, 0.5, 1] } },
  hidden:  { x: '-130vw', opacity: 0, transition: { duration: 1.0, ease: [0.55, 0, 1, 0.45] } },
};

const rightBadgeVariants = {
  visible: { x: 0, opacity: 1, transition: { duration: 1.6, ease: [0.25, 1, 0.5, 1] } },
  hidden:  { x: '130vw', opacity: 0, transition: { duration: 1.0, ease: [0.55, 0, 1, 0.45] } },
};

const nameVariants = {
  visible: { scale: 1, y: 0, opacity: 1, transition: { duration: 2.0, ease: [0.25, 1, 0.5, 1] } },
  hidden:  { scale: 0.12, y: 200, opacity: 0, transition: { duration: 1.2, ease: [0.55, 0, 1, 0.45] } },
};

const labelVariants = {
  visible: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
  hidden:  { opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
};

// Entry-only (fires once on mount)
const entryVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection
// Self-contained: uses IntersectionObserver to detect hero visibility.
// When hero scrolls out of view (scrolling down) → triggers exit animation.
// When hero scrolls back into view (scrolling up) → triggers enter animation.
// ─────────────────────────────────────────────────────────────────────────────
export const HeroSection = ({ themeHue = 230, onExploreClick }) => {
  const heroRef = useRef(null);
  const { t } = useTranslation();

  const leftCtrl  = useAnimation();
  const rightCtrl = useAnimation();
  const nameCtrl  = useAnimation();
  const labelCtrl = useAnimation();

  // Separate tracking for badges and name to trigger them at different scroll points
  const badgesInView = useRef(true);
  const nameInView = useRef(true);

  useEffect(() => {
    // Fire entry animations on mount (once)
    leftCtrl.start('visible');
    rightCtrl.start('visible');
    nameCtrl.start('visible');
    labelCtrl.start('visible');
  }, [leftCtrl, rightCtrl, nameCtrl, labelCtrl]);

  useEffect(() => {
    const handleScroll = () => {
      // Badges hit the navbar quickly
      const triggerBadges = 90;
      // Name is lower down, hits the navbar later
      const triggerName = 250;

      // ── Badges trigger ──
      if (window.scrollY > triggerBadges && badgesInView.current) {
        badgesInView.current = false;
        leftCtrl.start('hidden');
        rightCtrl.start('hidden');
      } else if (window.scrollY <= triggerBadges && !badgesInView.current) {
        badgesInView.current = true;
        leftCtrl.start('visible');
        rightCtrl.start('visible');
      }

      // ── Name & Subtitle trigger ──
      if (window.scrollY > triggerName && nameInView.current) {
        nameInView.current = false;
        labelCtrl.start('hidden');
        nameCtrl.start('hidden');
      } else if (window.scrollY <= triggerName && !nameInView.current) {
        nameInView.current = true;
        nameCtrl.start('visible');
        labelCtrl.start('visible');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check in case of page reload halfway down
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [leftCtrl, rightCtrl, nameCtrl, labelCtrl]);

  return (
    // Transparent bg so global background (lightning + tree atmosphere) shows through
    <div ref={heroRef} className="relative w-full bg-transparent text-white min-h-screen" style={{ overflow: 'visible' }}>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-screen flex flex-col justify-center" style={{ overflow: 'visible' }}>

        {/* ── Floating Badges ─────────────────────────────────────────────────
            Pattern: outer motion.div = position:absolute (no transform)
                     inner motion.div = animation controller (no position)
            This avoids the CSS "transform creates containing block" bug.
        ──────────────────────────────────────────────────────────────────── */}

        {/* Top-left: Machine Learning / XGBoost */}
        <motion.div
          variants={entryVariants}
          initial="hidden"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute left-[5%] top-[32%] md:left-10 md:top-40 z-20 pointer-events-auto scale-[0.65] md:scale-100 origin-top-left"
          style={{ overflow: 'visible' }}
        >
          <motion.div animate={leftCtrl} variants={leftBadgeVariants} initial="visible">
            <BadgeContent name="Machine Learning" value="XGBoost" floatDelay={0} />
          </motion.div>
        </motion.div>

        {/* Inner-left: Python / Scikit-learn */}
        <motion.div
          variants={entryVariants}
          initial="hidden"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="absolute left-[18%] top-[18%] md:left-1/4 md:top-24 z-20 pointer-events-auto scale-[0.65] md:scale-100 origin-top-left"
          style={{ overflow: 'visible' }}
        >
          <motion.div animate={leftCtrl} variants={leftBadgeVariants} initial="visible">
            <BadgeContent name="Python" value="Scikit-learn" floatDelay={1.2} />
          </motion.div>
        </motion.div>

        {/* Top-right: Data Engineering / Pandas */}
        <motion.div
          variants={entryVariants}
          initial="hidden"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute right-[5%] top-[32%] md:right-10 md:top-40 z-20 pointer-events-auto scale-[0.65] md:scale-100 origin-top-right"
          style={{ overflow: 'visible' }}
        >
          <motion.div animate={rightCtrl} variants={rightBadgeVariants} initial="visible">
            <BadgeContent name="Data Engineering" value="Pandas" floatDelay={2.4} />
          </motion.div>
        </motion.div>

        {/* Inner-right: JLPT N4 / Japan */}
        <motion.div
          variants={entryVariants}
          initial="hidden"
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="absolute right-[18%] top-[18%] md:right-1/4 md:top-24 z-20 pointer-events-auto scale-[0.65] md:scale-100 origin-top-right"
          style={{ overflow: 'visible' }}
        >
          <motion.div animate={rightCtrl} variants={rightBadgeVariants} initial="visible">
            <BadgeContent name="JLPT N4" value="Japan" floatDelay={3.6} />
          </motion.div>
        </motion.div>

        {/* ── Main Hero Content ─────────────────────────────────────────────── */}
        <motion.div
          animate={nameCtrl}
          variants={nameVariants}
          initial="visible"
          style={{ transformOrigin: 'center bottom' }}
          className="relative z-30 flex flex-col items-center text-center max-w-4xl mx-auto mt-20"
        >
          {/* "Sakura Nocturne" label */}
          <motion.p
            animate={labelCtrl}
            variants={labelVariants}
            initial="visible"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="mt-8 text-xs md:text-base tracking-[0.3em] uppercase text-[#d6c2c4]/40 italic mb-2"
          >
            {t('hero.nocturne')}
          </motion.p>

          {/* Name — typewriter */}
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(16px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-8xl font-light mb-4 tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,192,203,0.3)]"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            <HeroTypewriter key={t('hero.name')} text={t('hero.name')} delay={0.5} speed={90} />
          </motion.h1>

          {/* Subtitle — looping typewriter */}
          <motion.h2
            initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1], delay: 0.55 }}
            className="text-xl md:text-4xl pb-3 font-light min-h-[2rem] md:min-h-[3rem]"
          >
            <HeroTypewriter
              key={t('hero.subtitle')}
              text={t('hero.subtitle')}
              delay={2.5}
              speed={120}
              loop={true}
              textClassName="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent"
            />
          </motion.h2>

          {/* Tagline */}
          <motion.p
            animate={labelCtrl}
            variants={labelVariants}
            initial="visible"
            className="text-gray-400 mb-9 max-w-2xl text-sm md:text-lg mt-4"
          >
            {t('hero.tagline')}
          </motion.p>

          {/* Explore button */}
          <motion.button
            onClick={onExploreClick}
            animate={labelCtrl}
            variants={labelVariants}
            initial="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/20 text-white font-medium cursor-pointer"
          >
            {t('hero.explore')}
          </motion.button>
        </motion.div>
      </div>

      {/* ── Background elements ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          {/* Transparent overlay — let GlobalWeatherManager show through */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-pink-500/8 to-purple-600/8 blur-3xl" />
        <div className="absolute top-0 w-[100%] left-1/2 transform -translate-x-1/2 h-full pointer-events-none">
          <Lightning hue={themeHue} xOffset={0} speed={1.2} intensity={0.5} size={1.5} />
        </div>
        
        {/* Planet/sphere orb + aura glow */}
        <div className="z-10 absolute top-[70%] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] backdrop-blur-3xl rounded-full bg-[radial-gradient(circle_at_50%_90%,_#2e0c1f_15%,_#000000de_70%,_#000000ed_100%)] overflow-hidden">
          <div
            className="soft-aura absolute inset-x-0 top-0 h-[150px] rounded-t-full pointer-events-none"
            style={{
              '--hue': themeHue,
              background: `radial-gradient(ellipse at top, hsl(var(--hue), 100%, 65%) 0%, hsl(var(--hue), 80%, 40%, 0.4) 40%, transparent 80%)`,
              filter: 'blur(10px)',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
