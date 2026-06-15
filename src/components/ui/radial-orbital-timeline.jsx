import { useState, useEffect, useRef } from "react";
import { Brain, Cpu, Database, Eye, MessageSquare, Network, ArrowRight, Zap } from "lucide-react";
import { CpuArchitecture } from "./cpu-architecture";

const defaultTimelineData = [
  {
    id: 1,
    title: "Deep Learning Architectures",
    date: "Core Skill",
    content: "Design and optimization of deep neural networks, custom layers, transformer models, and sequence transduction pipelines.",
    category: "Deep Learning",
    icon: Brain,
    relatedIds: [2, 4],
    status: "completed",
    energy: 95,
  },
  {
    id: 2,
    title: "Computer Vision Systems",
    date: "Specialization",
    content: "Semantic segmentation, real-time object detection (YOLO, DETR series), image classification, and robust OpenCV workflows.",
    category: "Computer Vision",
    icon: Eye,
    relatedIds: [1, 5],
    status: "completed",
    energy: 92,
  },
  {
    id: 3,
    title: "Data Engineering & Pipelines",
    date: "Core Infrastructure",
    content: "ETL pipelines, feature engineering, distributed training data setups, and real-time inference preprocessing optimization.",
    category: "Data Engineering",
    icon: Database,
    relatedIds: [1, 5],
    status: "completed",
    energy: 85,
  },
  {
    id: 4,
    title: "Large Language Models & NLP",
    date: "Active Development",
    content: "Retrieval-Augmented Generation (RAG), parameter-efficient fine-tuning (LoRA, QLoRA), embeddings, and semantic vector search engines.",
    category: "NLP / GenAI",
    icon: MessageSquare,
    relatedIds: [1, 3],
    status: "in-progress",
    energy: 82,
  },
  {
    id: 5,
    title: "Model Deployment & Ops",
    date: "Optimization",
    content: "Quantization, ONNX conversion, TensorRT runtime acceleration, Dockerized inference service hosting, and cloud-native API scaling.",
    category: "MLOps",
    icon: Cpu,
    relatedIds: [2, 3],
    status: "in-progress",
    energy: 78,
  },
];

export default function RadialOrbitalTimeline({ timelineData = defaultTimelineData }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState({});
  const [activeNodeId, setActiveNodeId] = useState(null);
  
  const containerRef = useRef(null);
  const orbitRef = useRef(null);
  const nodeRefs = useRef({});

  const handleContainerClick = (e) => {
    // If clicking on container or main orbit backdrop, collapse selected cards
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      const newState = {};
      
      // Close other cards to avoid overlay clashes
      newState[id] = !prev[id];

      if (newState[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        // Highlight connected nodes
        const currentItem = timelineData.find((item) => item.id === id);
        const relatedIds = currentItem ? currentItem.relatedIds : [];
        const newPulseEffect = {};
        relatedIds.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        // Center view on this node (adjust rotation to 270 degrees)
        const nodeIndex = timelineData.findIndex((item) => item.id === id);
        const totalNodes = timelineData.length;
        const targetAngle = (nodeIndex / totalNodes) * 360;
        setRotationAngle(270 - targetAngle);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer;
    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => (prev + 0.3) % 360);
      }, 50);
    }
    return () => {
      if (rotationTimer) clearInterval(rotationTimer);
    };
  }, [autoRotate]);

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 135; // Position nodes on the 270px diameter circle
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    // Calculate z-index & opacity for realistic 3D depth illusion
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

    return { x, y, angle, zIndex, opacity };
  };

  const isRelatedToActive = (id) => {
    if (!activeNodeId) return false;
    const currentItem = timelineData.find((item) => item.id === activeNodeId);
    return currentItem ? currentItem.relatedIds.includes(id) : false;
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="w-full min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden select-none"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-[radial-gradient(ellipse_at_top,_rgba(251,179,193,0.025)_0%,_transparent_70%)] pointer-events-none z-0" />

      {/* Outer section title */}
      <div className="text-center mb-10 z-10">
        <span className="font-label-sm text-[#d6c2c4]/40 tracking-[0.3em] uppercase mb-2 block">
          Tech Stack
        </span>
        <h3 className="font-headline-md text-headline-md text-primary tracking-wide">
          Radial Skills Odyssey
        </h3>
      </div>

      <div className="relative w-full max-w-2xl h-[450px] flex items-center justify-center z-10">
        {/* Layer 0: CPU Architecture Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] scale-[1.3] flex items-center justify-center">
          <CpuArchitecture />
        </div>

        {/* Orbit container */}
        <div
          ref={orbitRef}
          className="absolute w-full h-full flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          {/* Centered glowing node */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 via-[#fbb3c1]/15 to-transparent blur-lg pointer-events-none z-0" />
          <div className="absolute w-12 h-12 rounded-full border border-white/5 bg-[#111317]/60 backdrop-blur-md shadow-[0_0_20px_rgba(251,179,193,0.1)] flex items-center justify-center z-10">
            <Network className="w-5 h-5 text-primary/80 animate-pulse" />
          </div>

          {/* Orbit line ring path */}
          <div className="absolute w-[270px] h-[270px] rounded-full border border-white/[0.04] pointer-events-none z-0" />

          {/* Node items */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = !!expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = !!pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
                className="absolute transition-all duration-700 ease-out cursor-pointer flex flex-col items-center justify-center group"
                style={nodeStyle}
              >
                {/* Node outer pulsing glow aura */}
                <div
                  className={`absolute rounded-full -inset-2 transition-opacity duration-500 pointer-events-none ${
                    isPulsing ? "animate-pulse" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    background: "radial-gradient(circle, rgba(251,179,193,0.15) 0%, transparent 70%)",
                    width: `${item.energy * 0.4 + 40}px`,
                    height: `${item.energy * 0.4 + 40}px`,
                  }}
                />

                {/* Node icon pill */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${
                    isExpanded
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-125"
                      : isRelated
                      ? "bg-primary/20 text-[#ffdee3] border-primary/50"
                      : "bg-[#111317]/90 text-on-surface border-white/[0.08] hover:border-primary/40 hover:scale-105"
                  }`}
                >
                  <Icon size={16} />
                </div>

                {/* Node label */}
                <div
                  className={`absolute top-11 whitespace-nowrap text-[9px] font-mono tracking-widest uppercase transition-colors duration-500 ${
                    isExpanded ? "text-primary font-bold" : "text-on-surface-variant/40 group-hover:text-on-surface-variant/80"
                  }`}
                >
                  {item.category}
                </div>

                {/* Details layout card */}
                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-16 left-1/2 -translate-x-1/2 w-64 bg-[#14161d]/95 backdrop-blur-xl border border-[rgba(251,179,193,0.2)] rounded-xl p-5 shadow-2xl z-50 text-left pointer-events-auto"
                  >
                    {/* Small layout pointer line */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[rgba(251,179,193,0.3)]"></div>

                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase rounded bg-white/5 border border-white/10 text-primary">
                        {item.status === "completed" ? "Verified" : "Building"}
                      </span>
                      <span className="text-[9px] font-mono text-on-surface-variant/50">
                        {item.date}
                      </span>
                    </div>

                    <h4 className="text-xs font-serif text-white font-bold tracking-wide mb-2">
                      {item.title}
                    </h4>
                    
                    <p className="text-[10px] text-on-surface-variant/80 leading-relaxed font-body mb-4">
                      {item.content}
                    </p>

                    {/* Energy Bar indicator */}
                    <div className="pt-3 border-t border-white/5">
                      <div className="flex justify-between items-center text-[9px] font-mono mb-1.5 text-on-surface-variant/60">
                        <span className="flex items-center gap-1">
                          <Zap size={9} className="text-[#fbb3c1]" />
                          Expertise Level
                        </span>
                        <span>{item.energy}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary/40 to-primary"
                          style={{ width: `${item.energy}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Connected details */}
                    {item.relatedIds.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <h5 className="text-[8px] font-mono tracking-widest uppercase text-on-surface-variant/40 mb-2">
                          Corequisite Domains
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relatedId) => {
                            const relItem = timelineData.find((t) => t.id === relatedId);
                            if (!relItem) return null;
                            return (
                              <button
                                key={relatedId}
                                onClick={() => toggleItem(relatedId)}
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/5 hover:border-primary/30 bg-transparent text-[8px] text-on-surface-variant/70 hover:text-white transition-all font-mono"
                              >
                                {relItem.category}
                                <ArrowRight size={8} className="text-[#fbb3c1]" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
