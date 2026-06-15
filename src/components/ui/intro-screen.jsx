import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// IntroScreen
// ─────────────────────────────────────────────────────────────────────────────

// Strip count is dynamically calculated per viewport

const blindContainerVariants = {
  visible: {},
  exit: {
    transition: { staggerChildren: 0.07, staggerDirection: 1 },
  },
};

const makeStripVariant = (index) => ({
  visible: { x: '0vw', skewX: 0 },
  exit: {
    x: index % 2 === 0 ? '102vw' : '-102vw',
    skewX: index % 2 === 0 ? 2 : -2,
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TreeCanvas
// ─────────────────────────────────────────────────────────────────────────────
const TreeCanvas = ({ themeHue = 220 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, preserveDrawingBuffer: true }) ||
               canvas.getContext('experimental-webgl', { antialias: true, alpha: true, preserveDrawingBuffer: true });
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (vsSource, fsSource) => {
      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog));
        return null;
      }
      return prog;
    };

    const branchVs = `
      attribute vec2 a_position;
      uniform vec2 u_resolution;
      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        gl_Position = vec4((zeroToTwo - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
      }
    `;
    const branchFs = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `;

    const leafVs = `
      attribute vec2 a_position;
      attribute vec4 a_color;
      attribute float a_size;
      attribute float a_rotation;
      uniform vec2 u_resolution;
      varying vec4 v_color;
      varying float v_rotation;
      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        gl_Position = vec4((zeroToTwo - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
        gl_PointSize = a_size;
        v_color = a_color;
        v_rotation = a_rotation;
      }
    `;
    const leafFs = `
      precision mediump float;
      varying vec4 v_color;
      varying float v_rotation;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        
        float s = sin(v_rotation);
        float c = cos(v_rotation);
        mat2 rot = mat2(c, -s, s, c);
        vec2 rotatedCoord = rot * coord;
        
        float roundDist = length(coord) * 2.0;
        if (roundDist > 1.0) discard;
        
        vec2 ellipseCoord = rotatedCoord * vec2(1.0, 2.5);
        float petalDist = length(ellipseCoord) * 2.0;
        
        float core = smoothstep(0.4, 0.35, petalDist);
        float glow = smoothstep(1.0, 0.2, roundDist) * 0.4;
        
        vec4 color = v_color;
        float alpha = core + glow;
        vec3 finalColor = mix(color.rgb, vec3(1.0), core * 0.5);
        
        color.a *= alpha;
        color.a = clamp(color.a, 0.0, 1.0);
        finalColor *= color.a; // Pre-multiply alpha for additive blending
        
        gl_FragColor = vec4(finalColor, color.a);
      }
    `;

    const branchProg = createProgram(branchVs, branchFs);
    const leafProg = createProgram(leafVs, leafFs);

    const bPosLoc = gl.getAttribLocation(branchProg, 'a_position');
    const bResLoc = gl.getUniformLocation(branchProg, 'u_resolution');
    const bColLoc = gl.getUniformLocation(branchProg, 'u_color');

    const lPosLoc = gl.getAttribLocation(leafProg, 'a_position');
    const lColLoc = gl.getAttribLocation(leafProg, 'a_color');
    const lSizeLoc = gl.getAttribLocation(leafProg, 'a_size');
    const lRotLoc = gl.getAttribLocation(leafProg, 'a_rotation');
    const lResLoc = gl.getUniformLocation(leafProg, 'u_resolution');

    const branchPosBuffer = gl.createBuffer();
    const branchIdxBuffer = gl.createBuffer();
    const leafBuffer = gl.createBuffer();

    const MAX_BRANCHES = 2000;
    const MAX_LEAVES = 2000;

    const branchPositions = new Float32Array(MAX_BRANCHES * 8);
    const branchIndices = new Uint16Array(MAX_BRANCHES * 6);
    for (let i = 0; i < MAX_BRANCHES; i++) {
      const idx = i * 4;
      const iIdx = i * 6;
      branchIndices[iIdx+0] = idx + 0;
      branchIndices[iIdx+1] = idx + 1;
      branchIndices[iIdx+2] = idx + 2;
      branchIndices[iIdx+3] = idx + 1;
      branchIndices[iIdx+4] = idx + 3;
      branchIndices[iIdx+5] = idx + 2;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, branchIdxBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, branchIndices, gl.STATIC_DRAW);

    // Leaf data: x, y, r, g, b, a, size, rotation (8 floats)
    const leafData = new Float32Array(MAX_LEAVES * 8);

    let width = 0;
    let height = 0;
    let animationFrameId;
    const DURATION = 3200;
    const DEPTH = 5;

    let branches = [];
    let leaves = [];
    let started = false;
    let startTime = null;

    // Generate dynamic colors based on themeHue
    const hsv2rgb = (h, s, v) => {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: return [v, t, p];
        case 1: return [q, v, p];
        case 2: return [p, v, t];
        case 3: return [p, q, v];
        case 4: return [t, p, v];
        case 5: return [v, p, q];
      }
    };
    
    const getModH = (hueOff) => ((themeHue + hueOff) % 360 + 360) % 360 / 360;
    const leafColors = [
      hsv2rgb(getModH(0), 0.6, 1.0),
      hsv2rgb(getModH(15), 0.5, 0.9),
      hsv2rgb(getModH(-15), 0.7, 1.0)
    ];

    class Branch {
      constructor(sx, sy, len, angle, width, depth, offset) {
        this.sx = sx; this.sy = sy;
        this.len = len; this.angle = angle;
        this.width = width; this.depth = depth;
        this.offset = offset;
        this.ex = sx + len * Math.cos(angle);
        this.ey = sy + len * Math.sin(angle);
        this.finished = false;
        this.childrenCreated = false;
        this.currentLen = 0;
        this.duration = 0.12;
      }
      update(gProgress) {
        if (this.finished) return;
        const local = Math.max(0, Math.min(1, (gProgress - this.offset) / this.duration));
        this.currentLen = this.len * local;
        if (local >= 0.99) this.finished = true;
      }
      checkChildren(gProgress) {
        if (this.finished && !this.childrenCreated) {
          if (this.depth > 0) {
            const num = Math.random() > 0.35 ? 2 : 3;
            const spread = 0.22 + Math.random() * 0.28;
            const angles = num === 2
              ? [this.angle - spread, this.angle + spread]
              : [this.angle - spread * 1.3, this.angle + (Math.random() - 0.5) * 0.15, this.angle + spread * 1.3];
            for (const a of angles) {
              if (branches.length < MAX_BRANCHES) {
                branches.push(new Branch(
                  this.ex, this.ey,
                  this.len * (0.58 + Math.random() * 0.2),
                  a, this.width * 0.65, this.depth - 1,
                  gProgress
                ));
              }
            }
          } else {
            if (Math.random() > 0.1 && leaves.length < MAX_LEAVES) {
              leaves.push(new Leaf(this.ex, this.ey, gProgress));
            }
          }
          this.childrenCreated = true;
        }
      }
    }

    class Leaf {
      constructor(x, y, offset) {
        this.x = x; this.y = y;
        this.offset = offset;
        this.targetA = 0.45 + Math.random() * 0.55;
        this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
        this.size = (15 + Math.random() * 25) * (window.devicePixelRatio || 1); 
        this.rot = Math.random() * Math.PI * 2;
        this.a = 0;
      }
      draw(gProgress) {
        const local = Math.max(0, Math.min(1, (gProgress - this.offset) / 0.2));
        this.a = this.targetA * local;
      }
    }

    function initTree() {
      branches = [];
      leaves = [];
      const sx = width / 2;
      const sy = height * 0.88;
      const trunkLen = height * 0.24;
      const baseWidth = width < 600 ? 3 : 7;
      branches.push(new Branch(sx, sy, trunkLen, -Math.PI / 2, baseWidth, DEPTH, 0));
      startTime = null;
      started = true;
    }

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      if (width !== rect.width || height !== rect.height) {
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
        return true;
      }
      return false;
    }

    function animate(now) {
      if (!started) {
        if (!resizeCanvas()) {
          animationFrameId = requestAnimationFrame(animate);
          return;
        }
        initTree();
      }

      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / DURATION, 1);
      const progress = raw * raw * (3 - 2 * raw);

      for (let i = 0, len = branches.length; i < len; i++) {
        branches[i].update(progress);
        branches[i].checkChildren(progress);
        len = branches.length;
      }
      for (let i = 0; i < leaves.length; i++) {
        leaves[i].draw(progress);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const dpr = window.devicePixelRatio || 1;

      gl.enable(gl.BLEND);
      
      // Draw Branches
      gl.useProgram(branchProg);
      gl.uniform2f(bResLoc, canvas.width, canvas.height);
      gl.uniform4f(bColLoc, 74/255, 64/255, 64/255, 1.0); // #4a4040
      
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      let bCount = 0;
      for (let i = 0; i < branches.length; i++) {
        const b = branches[i];
        if (b.currentLen <= 0) continue;
        
        const cx = b.sx + b.currentLen * Math.cos(b.angle);
        const cy = b.sy + b.currentLen * Math.sin(b.angle);
        
        const dx = cx - b.sx;
        const dy = cy - b.sy;
        const len = Math.max(0.0001, Math.sqrt(dx*dx + dy*dy));
        const hw = (Math.max(0.5, b.width) * dpr) / 2.0;
        const nx = -dy / len * hw;
        const ny = dx / len * hw;
        
        const idx = bCount * 8;
        branchPositions[idx+0] = (b.sx + nx) * dpr;
        branchPositions[idx+1] = (b.sy + ny) * dpr;
        branchPositions[idx+2] = (b.sx - nx) * dpr;
        branchPositions[idx+3] = (b.sy - ny) * dpr;
        branchPositions[idx+4] = (cx + nx) * dpr;
        branchPositions[idx+5] = (cy + ny) * dpr;
        branchPositions[idx+6] = (cx - nx) * dpr;
        branchPositions[idx+7] = (cy - ny) * dpr;
        
        bCount++;
      }

      if (bCount > 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, branchPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, branchPositions, gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(bPosLoc);
        gl.vertexAttribPointer(bPosLoc, 2, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, branchIdxBuffer);
        gl.drawElements(gl.TRIANGLES, bCount * 6, gl.UNSIGNED_SHORT, 0);
      }

      // Draw Leaves
      gl.useProgram(leafProg);
      gl.uniform2f(lResLoc, canvas.width, canvas.height);
      
      // Additive blending
      gl.blendFunc(gl.ONE, gl.ONE);

      let lCount = 0;
      for (let i = 0; i < leaves.length; i++) {
        const l = leaves[i];
        if (l.a <= 0.01) continue;
        
        const idx = lCount * 8;
        leafData[idx+0] = l.x * dpr;
        leafData[idx+1] = l.y * dpr;
        leafData[idx+2] = l.color[0];
        leafData[idx+3] = l.color[1];
        leafData[idx+4] = l.color[2];
        leafData[idx+5] = l.a;
        leafData[idx+6] = l.size;
        leafData[idx+7] = l.rot;
        lCount++;
      }

      if (lCount > 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, leafBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, leafData, gl.DYNAMIC_DRAW);
        
        gl.enableVertexAttribArray(lPosLoc);
        gl.enableVertexAttribArray(lColLoc);
        gl.enableVertexAttribArray(lSizeLoc);
        gl.enableVertexAttribArray(lRotLoc);
        
        // Stride is 8 * 4 bytes = 32
        gl.vertexAttribPointer(lPosLoc, 2, gl.FLOAT, false, 32, 0);
        gl.vertexAttribPointer(lColLoc, 4, gl.FLOAT, false, 32, 8);
        gl.vertexAttribPointer(lSizeLoc, 1, gl.FLOAT, false, 32, 24);
        gl.vertexAttribPointer(lRotLoc, 1, gl.FLOAT, false, 32, 28);
        
        gl.drawArrays(gl.POINTS, 0, lCount);
      }

      if (raw < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    animationFrameId = requestAnimationFrame(animate);

    const onResize = () => {
      if (resizeCanvas()) initTree();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      if (gl) {
        gl.deleteProgram(branchProg);
        gl.deleteProgram(leafProg);
        gl.deleteBuffer(branchPosBuffer);
        gl.deleteBuffer(branchIdxBuffer);
        gl.deleteBuffer(leafBuffer);
      }
    };
  }, [themeHue]);

  return (
    <canvas
      id="tree-canvas"
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// IntroScreen
// ─────────────────────────────────────────────────────────────────────────────
const IntroScreen = forwardRef(({ onComplete, themeHue = 220 }, ref) => {
  const [stripCount] = useState(() => {
    if (typeof window === 'undefined') return 10;
    return window.innerWidth < 768 ? 7 : 10;
  });
  const [phase, setPhase] = useState('tree'); // tree | strips | open | done
  const [snapshot, setSnapshot] = useState(null);
  const [treeGlow, setTreeGlow] = useState(false);
  const [showText, setShowText] = useState(false); // 夜桜 appears below tree at ~2.8s

  const petalColor = `hsla(${themeHue}, 90%, 72%, 0.55)`;
  const textColor  = `hsla(${themeHue}, 70%, 80%, 0.92)`;

  const [petals] = useState(() => {
    if (typeof window === 'undefined') return [];
    const count = window.innerWidth < 768 ? 7 : 14;
    return Array.from({ length: count }).map(() => ({
      startX: `${Math.random() * 100}vw`,
      endX: `calc(${Math.random() * 100}vw + ${(Math.random() - 0.5) * 80}px)`,
      duration: 5 + Math.random() * 6,
      delay: 0.3 + Math.random() * 4,
      rotate: Math.random() * 60 - 30,
    }));
  });

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true),    2800); // 夜桜 rises below tree
    const t2 = setTimeout(() => setTreeGlow(true),    3400); // tree glow
    const t3 = setTimeout(() => {
      const canvas = document.getElementById('tree-canvas');
      if (canvas) setSnapshot(canvas.toDataURL('image/png'));
      setPhase('strips');
    }, 4800); // Wait for perfect bloom, then freeze and convert to strips
    const t4 = setTimeout(() => setPhase('open'),     4900); // Reveal Hero section
    const t5 = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 6200);
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
  }, [onComplete]);

  const isTreePhase   = phase === 'tree';
  const isStripsPhase = phase === 'strips' || phase === 'open';

  return (
    <motion.div
      ref={ref}
      className="fixed inset-0 z-50 overflow-hidden pointer-events-auto"
      style={{ background: phase === 'open' ? 'transparent' : '#05050a' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >

      {/* ── PHASE A: Tree + petals + 夜桜 (same screen) ─────────────────── */}
      <AnimatePresence>
        {isTreePhase && (
          <motion.div
            key="tree-world"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="absolute inset-0 flex flex-col"
          >
            {/* Falling petals */}
            {petals.map((p, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: p.startX, opacity: 0, rotate: p.rotate }}
                animate={{ y: '110vh', x: p.endX, opacity: [0, 0.8, 0.8, 0], rotate: p.rotate + 120 }}
                transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
                style={{
                  width: 5, height: 9,
                  borderRadius: '50% 50% 50% 0',
                  backgroundColor: petalColor,
                  position: 'absolute',
                  pointerEvents: 'none', zIndex: 2,
                }}
              />
            ))}

            {/* Tree canvas — responsive size */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="absolute z-[3] left-1/2 -translate-x-1/2 top-[45%] -translate-y-1/2 w-[min(80vw,350px)] h-[min(80vw,350px)] md:left-0 md:translate-x-0 md:top-0 md:translate-y-0 md:w-full md:h-[74%]"
              style={{
                filter: treeGlow
                  ? `drop-shadow(0 0 22px hsla(${themeHue}, 100%, 72%, 0.55))`
                  : 'none',
                transition: 'filter 1.8s ease-in-out',
              }}
            >
              <TreeCanvas themeHue={themeHue} />
            </motion.div>

            {/* 夜桜 text — fades in below tree at 2.8s */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  key="yozakura-text"
                  initial={{ opacity: 0, y: 18, x: '-50%', filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, x: '-50%', filter: 'blur(0px)' }}
                  transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute z-10 text-center pointer-events-none left-1/2 top-[calc(45%+min(40vw,175px)+20px)] md:top-auto md:bottom-[4%]"
                >
                  <div style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                    fontWeight: 700,
                    color: textColor,
                    letterSpacing: '0.12em',
                    lineHeight: 1,
                    textShadow: `0 0 50px hsla(${themeHue}, 100%, 72%, 0.35)`,
                  }}>
                    夜桜
                  </div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.68rem',
                    color: `hsla(${themeHue}, 55%, 72%, 0.4)`,
                    letterSpacing: '0.44em',
                    marginTop: '0.9rem',
                    textTransform: 'uppercase',
                  }}>
                    Sakura Nocturne
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE B: Sliced Canvas — Tree splits into strips ──────── */}
      <AnimatePresence>
        {isStripsPhase && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
            className="absolute inset-0 z-10"
          >
            <motion.div
              className="absolute inset-0"
              variants={blindContainerVariants}
              initial="visible"
              animate={phase === 'open' ? 'exit' : 'visible'}
              style={{ zIndex: 10 }}
            >
              {Array.from({ length: stripCount }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={makeStripVariant(i)}
                  style={{
                    position: 'absolute', top: 0,
                    left: `calc(100vw / ${stripCount} * ${i})`,
                    width: `calc(100vw / ${stripCount} + 2px)`,
                    height: '100vh',
                    backgroundColor: '#05050a',
                    overflow: 'hidden',
                    willChange: 'transform',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: `calc(-100vw / ${stripCount} * ${i})`,
                    width: '100vw',
                    height: '100vh',
                  }}>
                    {/* Render the exact same visual inside the moving strip */}
                    {snapshot && (
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 top-[45%] -translate-y-1/2 w-[min(80vw,350px)] h-[min(80vw,350px)] md:left-0 md:translate-x-0 md:top-0 md:translate-y-0 md:w-full md:h-[74%]"
                        style={{
                        filter: treeGlow ? `drop-shadow(0 0 22px hsla(${themeHue}, 100%, 72%, 0.55))` : 'none',
                      }}>
                         <img src={snapshot} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Tree Snapshot" />
                      </div>
                    )}
                    {showText && (
                      <div
                        className="absolute text-center left-1/2 -translate-x-1/2 top-[calc(45%+min(40vw,175px)+20px)] md:top-auto md:bottom-[4%]"
                      >
                        <div style={{
                          fontFamily: "'Shippori Mincho', serif",
                          fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                          fontWeight: 700,
                          color: textColor,
                          letterSpacing: '0.12em',
                          lineHeight: 1,
                          textShadow: `0 0 50px hsla(${themeHue}, 100%, 72%, 0.35)`,
                        }}>
                          夜桜
                        </div>
                        <div style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '0.68rem',
                          color: `hsla(${themeHue}, 55%, 72%, 0.4)`,
                          letterSpacing: '0.44em',
                          marginTop: '0.9rem',
                          textTransform: 'uppercase',
                        }}>
                          Sakura Nocturne
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

IntroScreen.displayName = 'IntroScreen';
export default IntroScreen;
