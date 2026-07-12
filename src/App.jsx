import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import { 
  Smartphone, HardHat, 
  Navigation, Landmark, AlertTriangle, CheckCircle, 
  Truck, ArrowRight, CornerRightDown, Plus, Minus,
  Sparkles, Eye, Brain, Leaf, MapPin, Activity, CloudRain,
  Cloud, Video, Bus, Camera
} from 'lucide-react';

/* Global easing curves matching Apple Human Interface guidelines */
const easeCurve = [0.22, 1, 0.36, 1];

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { ease: easeCurve, duration: 1.5, delay: 0.2 }
  }
};

/* 1. Word-by-Word headline reveal for editorial design */
function WordReveal({ text, className = "", delay = 0 }) {
  const words = text.split(" ");
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.05, 
        delayChildren: delay 
      },
    },
  };
  
  const wordVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { ease: easeCurve, duration: 0.6 }
    }
  };

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      style={{ display: "inline-block" }}
    >
      {words.map((word, idx) => (
        <span key={idx} style={{ display: "inline-block", marginRight: "0.25em" }}>
          <motion.span variants={wordVariants} style={{ display: "inline-block" }}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* 2. Fade Up Wrapper for paragraphs and widgets */
function FadeUp({ children, delay = 0, className = "", style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ ease: easeCurve, duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}

/* 3. Magnetic Button using Framer Motion */
function MagneticButton({ children, className = "", href, onClick, ...props }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (clientX - centerX) * 0.18;
    const y = (clientY - centerY) * 0.18;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className="magnetic-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {href ? (
        <a href={href} className={className} onClick={onClick} {...props}>
          {children}
        </a>
      ) : (
        <button className={className} onClick={onClick} {...props}>
          {children}
        </button>
      )}
    </motion.div>
  );
}

/* 4. Live Telemetry Ticker */
function TelemetryTicker() {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    const sampleLogs = [
      "DEFECT RP-90812 | LAT 28.61 | CRITICAL",
      "INGEST: EDGE CAMERA #1409 FEED ACTIVE...",
      "DATA: SHA-256 SIGNATURE AUTHENTIC",
      "DEPTH: 14.6cm | LAYER STRESS LOGGED",
      "CONTRACT: GENERATING DISPATCH CODE...",
      "DISPATCH: WORK ORDER ROUTED TO DEPOT D-4",
      "SYSTEM: HEARTBEAT LOGGED - 4,821 ACTIVE",
      "ECO: CO2 SAVINGS COUNTER INCREMENTED",
      "VERIFY: POST-PATCH IMAGE AI APPROVED"
    ];

    let count = 0;
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const newLine = `[${time}] ${sampleLogs[count % sampleLogs.length]}`;
      setLogs((prev) => [newLine, ...prev.slice(0, 5)]);
      count++;
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="telemetry-panel" style={{ height: "170px", overflow: "hidden", borderColor: "var(--border-color)" }}>
      {logs.map((log, index) => (
        <motion.div 
          key={log} 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.4 }}
          style={{ 
            marginBottom: "6px", 
            color: index === 0 ? "var(--color-ai)" : "var(--text-secondary)",
            fontSize: "0.75rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {log}
        </motion.div>
      ))}
    </div>
  );
}

/* 5. Count-Up Stat */
function StatCounter({ value, suffix = "", duration = 1.2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [hasStarted, value, duration]);

  return <span ref={ref} className="mono">{count}{suffix}</span>;
}

/* 6. Interactive Delay Risk Calculator */
function DelayRiskCalculator() {
  const [delay, setDelay] = useState(30);

  const riskScore = Math.floor(delay * 3.3);
  const structuralDamage = Math.floor(delay * 12.5);

  return (
    <div className="card" style={{ borderColor: "var(--color-warn)", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="section-tag" style={{ color: "var(--color-warn)", marginBottom: 0 }}>// RISK CALCULATOR</span>
        <span className="mono" style={{ color: "var(--color-warn)" }}>STATIONARY DELAY ANALYSIS</span>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>
          <span>MUNICIPAL RESOLUTION TIMEFRAME:</span>
          <span style={{ fontWeight: 600, color: "var(--color-warn)" }}>{delay} DAYS</span>
        </div>
        <input 
          type="range" 
          min="3" 
          max="90" 
          value={delay} 
          onChange={(e) => setDelay(Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--color-warn)" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="card" style={{ padding: "16px", background: "var(--bg-base)", border: "1px solid var(--border-color)", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>FATALITY PROBABILITY</div>
          <div className="mono" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-warn)" }}>{riskScore}%</div>
        </div>
        <div className="card" style={{ padding: "16px", background: "var(--bg-base)", border: "1px solid var(--border-color)", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>SUB-BASE COMPACTION LOSS</div>
          <div className="mono" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{structuralDamage}mm</div>
        </div>
      </div>

      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0, fontFamily: "var(--font-mono)" }}>
        *RoadPulse AI automates field contractor dispatch, reducing municipal resolution wait time to under <strong>2 Days</strong>.
      </p>
    </div>
  );
}

/* 7. Interactive Before/After Road Patch Slider */
function CompareSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleTouchMove = (e) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="slider-container"
      style={{ cursor: "ew-resize" }}
    >
      {/* Target/Success image (After repair) */}
      <img 
        src="/assets/images/qa_comparison.png" 
        alt="After: Cleanly sealed roadway asphalt" 
        className="slider-img"
      />
      
      {/* Overlay/Severe image (Before repair) */}
      <div 
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
        }}
      >
        <img 
          src="/assets/images/problem_monsoon.png" 
          alt="Before: Cracked asphalt roadway" 
          className="slider-img"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : "100%", maxWidth: "none" }}
        />
      </div>

      {/* Slider Divider Line */}
      <div 
        style={{ 
          position: "absolute", 
          top: 0, 
          bottom: 0, 
          left: `${sliderPosition}%`, 
          width: "2px", 
          backgroundColor: "var(--color-success)",
          pointerEvents: "none",
          zIndex: 10
        }}
      >
        <div 
          style={{ 
            position: "absolute", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", 
            width: "36px", 
            height: "36px", 
            borderRadius: "50%", 
            backgroundColor: "#FFFFFF", 
            border: "1px solid var(--border-color)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
            color: "var(--color-success)"
          }}
        >
          &harr;
        </div>
      </div>
    </div>
  );
}

/* 8. Live Decarbonization Carbon Savings Counter */
function DecarbonizationCounter() {
  const [co2Saved, setCo2Saved] = useState(384.920);
  const [fuelSaved, setFuelSaved] = useState(128290);

  useEffect(() => {
    const interval = setInterval(() => {
      setCo2Saved((prev) => prev + 0.0004);
      setFuelSaved((prev) => prev + 1);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" style={{ borderColor: "var(--color-env)", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="section-tag" style={{ color: "var(--color-env)", marginBottom: 0 }}>// ECOLOGICAL METRICS</span>
        <span className="mono" style={{ color: "var(--color-env)" }}>REAL-TIME CO2 SAVED</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="card" style={{ padding: "20px", background: "var(--bg-base)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>CO2 EMISSIONS RECOVERED</span>
          <span className="mono" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-env)" }}>
            {co2Saved.toFixed(4)} <span style={{ fontSize: "1rem" }}>TONS</span>
          </span>
        </div>

        <div className="card" style={{ padding: "20px", background: "var(--bg-base)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>ESTIMATED TRAVEL FUEL CONSERVED</span>
          <span className="mono" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {fuelSaved.toLocaleString()} <span style={{ fontSize: "1rem" }}>LITERS</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* 9. Live 3D Depth coordinate visualizer sandbox */
function DepthCoordinateSandbox() {
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5, depth: 8.5 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const xRaw = (e.clientX - rect.left) / rect.width;
    const yRaw = (e.clientY - rect.top) / rect.height;
    
    // Simulate depth using a mathematical wave function
    const x = Math.max(0, Math.min(1, xRaw));
    const y = Math.max(0, Math.min(1, yRaw));
    const d = (Math.sin(x * Math.PI) * Math.cos(y * Math.PI) * 14.5 + 2.0).toFixed(1);
    
    setCoords({ x: x.toFixed(2), y: y.toFixed(2), depth: d });
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="section-tag" style={{ color: "var(--color-ai)", marginBottom: 0 }}>// COORDINATE SANDBOX</span>
        <span className="mono">HOVER TO SAMPLE PROFILE</span>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="card coord-grid"
        style={{ 
          height: "260px", 
          cursor: "crosshair", 
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAFBFD",
          borderStyle: "dashed"
        }}
      >
        {/* Visualized coordinates crosshairs */}
        <div style={{ position: "absolute", top: `${coords.y * 100}%`, left: 0, right: 0, height: "1px", backgroundColor: "rgba(37, 99, 235, 0.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: `${coords.x * 100}%`, top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(37, 99, 235, 0.15)", pointerEvents: "none" }} />

        {/* Pulsing focal point */}
        <div 
          style={{ 
            position: "absolute", 
            top: `${coords.y * 100}%`, 
            left: `${coords.x * 100}%`, 
            transform: "translate(-50%, -50%)", 
            width: "8px", 
            height: "8px", 
            borderRadius: "50%", 
            backgroundColor: "var(--color-ai)"
          }}
        />

        <div style={{ position: "relative", zIndex: 5, textAlign: "center", fontFamily: "var(--font-mono)", background: "#FFFFFF", padding: "16px 24px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: "4px" }}>REAL-TIME LASER PROFILE</div>
          <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-ai)" }}>
            X: {coords.x} | Y: {coords.y}
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, marginTop: "4px" }}>
            DEPTH: {coords.depth}cm
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeStep, setActiveStep] = useState(0);
  const [activeStakeholder, setActiveStakeholder] = useState(0);
  const [expandedRoadmapMilestone, setExpandedRoadmapMilestone] = useState(0);

  useEffect(() => {
    if (currentView === 'home') {
      const target = sessionStorage.getItem('scrollTarget');
      if (target) {
        sessionStorage.removeItem('scrollTarget');
        setTimeout(() => {
          const element = document.getElementById(target);
          if (element) {
            const yOffset = -80;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [currentView]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  /* Solution Architecture steps */
  const workflowSteps = [
    {
      title: "Edge Ingestion",
      tag: "CAMERA CAPTURE",
      desc: "Vibration sensors and standard visual cameras on municipal buses, postal trucks, and delivery fleets stream raw road data passively during routine operations.",
      tech: "Low-overhead visual feed compression, cryptographic metadata signing"
    },
    {
      title: "Neural Diagnostic",
      tag: "AI DETECTION",
      desc: "Our localized computer-vision model processes frames instantly. It identifies cracks, maps their boundary lines, and performs single-camera 3D depth profiling.",
      tech: "Monocular depth mapping, semantic segmentation neural nets"
    },
    {
      title: "Priority Routing",
      tag: "DECISION MATRIX",
      desc: "The central server correlates defect severity, size, and depth alongside street traffic density metrics to compute a priority index score.",
      tech: "Priority Ranking Vector algorithm, traffic telemetry overlay"
    },
    {
      title: "Smart Dispatch",
      tag: "CONTRACT TRIGGER",
      desc: "A validated critical priority rating triggers a smart-contract request, automatically routing work orders directly to assigned regional maintenance crews.",
      tech: "No-code contractor pipeline, automated work-ticket dispatching"
    },
    {
      title: "Visual Audit",
      tag: "VERIFICATION LOOP",
      desc: "Once repaired, contractors submit a photographic seal stamp. RoadPulse's AI validates the level smooth profile to certify the repair before authorizing release of funds.",
      tech: "EXIF verification, post-patch volume compliance model"
    },
    {
      title: "Subsurface Model",
      tag: "PREDICTIVE DECAY",
      desc: "Thermal telemetry, localized weather conditions, and patch age variables are run to forecast structural asphalt decay before surface splitting occurs.",
      tech: "Time-series predictive regression, thermal stress forecaster"
    }
  ];

  /* Stakeholders information */
  const stakeholders = [
    {
      title: "Daily Commuters",
      icon: <Smartphone size={20} strokeWidth={2} />,
      desc: "Drastic reduction in structural wheel damages, lower insurance claims, and a safer commute on municipal arteries and highways.",
      metric: "42% Crash Rate Reduction"
    },
    {
      title: "Maintenance Teams",
      icon: <HardHat size={20} strokeWidth={2} />,
      desc: "Clear, ordered checklists with precise coordinates and material needs, eliminating manual search drives.",
      metric: "88% Operational Dispatch Efficiency"
    },
    {
      title: "Municipalities (PWD)",
      icon: <Landmark size={20} strokeWidth={2} />,
      desc: "Real-time visibility into public roadway networks, eliminating fraud and tracking contractor resolution performance.",
      metric: "100% Budget Audit Accountability"
    },
    {
      title: "Highways & Tolls (NHAI)",
      icon: <Navigation size={20} strokeWidth={2} />,
      desc: "Continuous roadway auditing at high speeds to comply with contractual road safety quality guidelines.",
      metric: "10 min Audit Resolution"
    },
    {
      title: "Logistics & Cargo Fleets",
      icon: <Truck size={20} strokeWidth={2} />,
      desc: "Minimized shock stress to transport trailers, protected cargo, and faster parcel shipping times across regions.",
      metric: "15% Fuel & Fleet Maintenance Savings"
    }
  ];

  /* Roadmap data */
  const roadmapMilestones = [
    {
      quarter: "Q3 - Q4 2026",
      title: "Phase 01: Real-World Ingest",
      points: [
        "Equip regional transit routes with AI edge capability",
        "Refine detection accuracy in challenging weather, like heavy monsoon rains",
        "Launch simple, visual maps for maintenance teams to track hotspots"
      ]
    },
    {
      quarter: "Q1 - Q2 2027",
      title: "Phase 02: Seamless Coordination",
      points: [
        "Connect RoadPulse alerts with municipal repair ticketing networks",
        "Introduce digital image verification for field workers",
        "Streamline material coordination to prevent repair delays"
      ]
    },
    {
      quarter: "Q3 - Q4 2027",
      title: "Phase 03: Connected Cities",
      points: [
        "Integrate camera analysis across interstate highways and tolls",
        "Provide route optimization telemetry to local logistics and delivery fleets",
        "Formulate national safety compliance scoreboards for public road audits"
      ]
    }
  ];

  return (
    <div style={{ position: "relative" }}>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
            transition={{ ease: easeCurve, duration: 0.6 }}
          >

      {/* 1. HERO SECTION */}
      <section id="hero" className="hero-wrapper">
        <div className="blueprint-grid" />
        <div className="glow-headline" />
        <div className="glow-illustration" />
        
        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <div className="hero-layout">
            
            {/* Left Column (40% width on desktop) */}
            <div>
              {/* Announcement Badge */}
              <motion.div 
                className="pill-badge"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ease: easeCurve, duration: 0.6 }}
              >
                <Sparkles size={14} style={{ color: "var(--color-ai)" }} />
                <span>RoadPulse AI • Environmental Sustainability</span>
                <span className="pulse-dot" />
              </motion.div>
              
              {/* Large Headline */}
              <h1 className="hero-headline" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ overflow: "hidden", display: "block" }}>
                  <WordReveal text="Invisible Intelligence." className="editorial-heading" />
                </div>
                <div style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                  <motion.span
                    className="gradient-text-blue"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ease: easeCurve, duration: 0.6, delay: 0.2 }}
                    style={{ display: "inline-block" }}
                  >
                    Protecting Lives
                  </motion.span>
                  <WordReveal text="Before The Impact." className="editorial-heading" delay={0.4} />
                </div>
              </h1>

              {/* Supporting Paragraph */}
              <FadeUp delay={0.5}>
                <p className="hero-paragraph">
                  RoadPulse AI transforms smartphones, dashcams, municipal buses and CCTV cameras into an intelligent road inspection network that detects potholes before they become deadly accidents.
                </p>

                {/* Action Buttons */}
                <div className="hero-buttons">
                  <MagneticButton 
                    href="#workflow" 
                    onClick={(e) => handleNavClick(e, 'workflow')} 
                    className="btn btn-blue"
                  >
                    Explore Workflow →
                  </MagneticButton>
                  <MagneticButton 
                    href="#innovation" 
                    onClick={(e) => handleNavClick(e, 'innovation')} 
                    className="btn btn-glass"
                  >
                    Watch Prototype
                  </MagneticButton>
                </div>
              </FadeUp>
            </div>

            {/* Right Column (60% width) - The Living City Showcase */}
            <div className="showcase-container">
              
              {/* Floating Data Ingestion Nodes */}
              {/* Smartphone */}
              <motion.div 
                className="story-card"
                style={{ left: "4%", top: "24%", width: "120px" }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="story-card-header" style={{ marginBottom: 0 }}>
                  <Smartphone className="story-card-icon" size={12} />
                  <span>Smartphone</span>
                </div>
              </motion.div>

              {/* Bus */}
              <motion.div 
                className="story-card"
                style={{ left: "14%", top: "4%", width: "110px" }}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <div className="story-card-header" style={{ marginBottom: 0 }}>
                  <Bus className="story-card-icon" size={12} />
                  <span>Transit Bus</span>
                </div>
              </motion.div>

              {/* CCTV */}
              <motion.div 
                className="story-card"
                style={{ left: "22%", top: "36%", width: "110px" }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              >
                <div className="story-card-header" style={{ marginBottom: 0 }}>
                  <Video className="story-card-icon" size={12} />
                  <span>CCTV Cam</span>
                </div>
              </motion.div>

              {/* Dashcam */}
              <motion.div 
                className="story-card"
                style={{ right: "26%", top: "4%", width: "110px" }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <div className="story-card-header" style={{ marginBottom: 0 }}>
                  <Camera className="story-card-icon" size={12} />
                  <span>Dashcam</span>
                </div>
              </motion.div>

              {/* Story Narrative Pop-up Cards */}
              {/* Card 1: Intelligent Prioritization */}
              <motion.div 
                className="story-card" 
                style={{ left: "6%", top: "54%", width: "155px" }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                <div className="story-card-header">
                  <Activity className="story-card-icon" size={12} />
                  <span>Pothole Detected</span>
                </div>
                <div className="story-card-body">
                  Severity: <strong>Critical</strong><br />
                  Traffic Density: <strong>9.4/10</strong><br />
                  Road Importance: <strong>Artery</strong>
                  <div className="priority-score-bar">
                    <div className="priority-score-bar-fill" />
                  </div>
                </div>
                <div className="story-card-tag tag-red">PRIORITY: HIGH</div>
              </motion.div>

              {/* Card 2: SMS Work Order Dispatch */}
              <motion.div 
                className="story-card sms-card" 
                style={{ right: "12%", top: "28%", width: "165px" }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="story-card-header">
                  <Truck className="story-card-icon" size={12} />
                  <span>Repair Assigned</span>
                  <span className="sms-time">Now</span>
                </div>
                <div className="story-card-body">
                  Ward 14 Dispatch Boxed<br />
                  GPS node locked.<br />
                  <strong>ETA: 18 Min</strong>
                </div>
              </motion.div>

              {/* Card 3: AI Verification */}
              <motion.div 
                className="story-card" 
                style={{ right: "2%", top: "56%", width: "150px" }}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="story-card-header">
                  <CheckCircle className="story-card-icon" size={12} style={{ color: 'var(--color-success)' }} />
                  <span>Verified</span>
                </div>
                <div className="story-card-body">
                  <div className="verify-item">
                    <span style={{ color: 'var(--color-success)' }}>✓</span>
                    <span>Surface Level Smooth</span>
                  </div>
                  <div className="verify-item">
                    <span style={{ color: 'var(--color-success)' }}>✓</span>
                    <span>Material Quality OK</span>
                  </div>
                  <div className="verify-item">
                    <span style={{ color: 'var(--color-success)' }}>✓</span>
                    <span>Geometric Audit Pass</span>
                  </div>
                </div>
                <div className="story-card-tag tag-green">AI APPROVED</div>
              </motion.div>

              {/* Card 4: Predictive Maintenance & Weather */}
              <motion.div 
                className="story-card" 
                style={{ right: "4%", top: "2%", width: "160px" }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              >
                <div className="story-card-header">
                  <CloudRain className="story-card-icon" size={12} style={{ color: 'var(--color-warn)' }} />
                  <span>Future Risk</span>
                </div>
                <div className="story-card-body">
                  Monsoon water pooling risk detected in Ward 14 segment.<br />
                  Historical decay: <strong>84%</strong>
                  <div className="weather-badge">WEATHER STRESS</div>
                </div>
              </motion.div>

              {/* "The Living City" Interactive SVG Illustration */}
              <svg viewBox="0 0 1000 800" className="connection-svg">
                <defs>
                  {/* Glowing linear gradient for moving particles */}
                  <linearGradient id="glowing-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(37, 99, 235, 0)" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  
                  {/* Volumetric Scan Beam gradient */}
                  <linearGradient id="scan-beam-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
                  </linearGradient>

                  {/* Drop shadow for buildings */}
                  <filter id="building-shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="4" dy="8" stdDeviation="6" floodColor="rgba(15, 23, 42, 0.06)" />
                  </filter>
                </defs>

                {/* SVG Background details */}
                <circle cx="500" cy="380" r="320" fill="rgba(37, 99, 235, 0.01)" />
                <circle cx="500" cy="380" r="220" fill="rgba(6, 182, 212, 0.01)" />

                {/* Clean Isometric Street Grid */}
                {/* Under-road shadow path */}
                <path d="M 100,580 L 900,180" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="48" strokeLinecap="round" />
                <path d="M 150,220 L 850,570" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="48" strokeLinecap="round" />

                {/* Asphalt Roadbeds */}
                {/* Road 1 (Left-Bottom to Right-Top) */}
                <path d="M 100,580 L 900,180" stroke="#F1F5F9" strokeWidth="44" strokeLinecap="round" />
                <path d="M 100,580 L 900,180" stroke="#475569" strokeWidth="40" strokeLinecap="round" />
                <path d="M 100,580 L 900,180" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10 12" opacity="0.6" />

                {/* Road 2 (Left-Top to Right-Bottom) */}
                <path d="M 150,220 L 850,570" stroke="#F1F5F9" strokeWidth="44" strokeLinecap="round" />
                <path d="M 150,220 L 850,570" stroke="#475569" strokeWidth="40" strokeLinecap="round" />
                <path d="M 150,220 L 850,570" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10 12" opacity="0.6" />

                {/* Repaired road segment (Smooth Blue Asphalt) on Road 1 */}
                <path d="M 600,330 L 720,270" stroke="#3B82F6" strokeWidth="40" strokeLinecap="round" />
                <path d="M 600,330 L 720,270" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.8" />

                {/* Connecting lines from float cards to cloud */}
                {/* Smartphone to Cloud */}
                <path d="M 160,230 C 240,230, 400,140, 500,140" className="connecting-line" />
                <path d="M 160,230 C 240,230, 400,140, 500,140" className="flow-line" />
                {/* Bus to Cloud */}
                <path d="M 220,90 C 280,90, 420,140, 500,140" className="connecting-line" />
                <path d="M 220,90 C 280,90, 420,140, 500,140" className="flow-line" />
                {/* CCTV to Cloud */}
                <path d="M 300,340 C 360,340, 440,140, 500,140" className="connecting-line" />
                <path d="M 300,340 C 360,340, 440,140, 500,140" className="flow-line" />
                {/* Dashcam to Cloud */}
                <path d="M 640,90 C 600,90, 550,140, 500,140" className="connecting-line" />
                <path d="M 640,90 C 600,90, 550,140, 500,140" className="flow-line" />

                {/* AI cloud connection line to repair truck (Smart Dispatch) */}
                <path d="M 500,140 C 580,140, 600,280, 660,280" className="pulse-line" strokeWidth="2.5" />

                {/* Connecting paths from popup cards to road segments */}
                {/* Prioritization popup to Pothole */}
                <path d="M 160,480 C 240,480, 260,470, 320,470" className="connecting-line" style={{ strokeDasharray: "4 4" }} />
                {/* Verification popup to repaired road */}
                <path d="M 820,480 C 760,480, 720,480, 660,300" className="connecting-line" style={{ strokeDasharray: "4 4" }} />

                {/* Active Vehicles Moving along Roads */}
                {/* Car 1: Diagonal Road 1 (Left-Bottom to Right-Top) */}
                <motion.g
                  animate={{ x: [100, 800], y: [580, 230] }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                >
                  <g transform="rotate(-26.5)">
                    <rect x="-8" y="-4" width="16" height="8" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
                    <rect x="-2" y="-2" width="6" height="4" fill="#3B82F6" opacity="0.6" />
                  </g>
                </motion.g>

                {/* Car 2: Diagonal Road 2 (Left-Top to Right-Bottom) */}
                <motion.g
                  animate={{ x: [180, 800], y: [235, 545] }}
                  transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 2 }}
                >
                  <g transform="rotate(26.5)">
                    <rect x="-8" y="-4" width="16" height="8" rx="2" fill="#3B82F6" />
                    <rect x="-4" y="-3" width="6" height="6" fill="#FFFFFF" opacity="0.8" />
                  </g>
                </motion.g>

                {/* Bus: Diagonal Road 1 in Opposite direction */}
                <motion.g
                  animate={{ x: [800, 100], y: [230, 580] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  <g transform="rotate(-26.5)">
                    <rect x="-14" y="-5" width="28" height="10" rx="2" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                    <rect x="-10" y="-3" width="20" height="6" fill="#38BDF8" opacity="0.5" />
                  </g>
                </motion.g>

                {/* Minimalist 3D Buildings */}
                {/* Building 1 (Top Center) */}
                <g filter="url(#building-shadow)">
                  {/* Roof */}
                  <polygon points="500,180 540,200 500,220 460,200" fill="#F8FAFC" />
                  {/* Left wall */}
                  <polygon points="460,200 500,220 500,290 460,270" fill="#E2E8F0" />
                  {/* Right wall */}
                  <polygon points="500,220 540,200 540,270 500,290" fill="#CBD5E1" />
                  {/* Windows indicators */}
                  <line x1="512" y1="230" x2="512" y2="280" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
                  <line x1="524" y1="222" x2="524" y2="272" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
                </g>

                {/* Building 2 (Left Center) */}
                <g filter="url(#building-shadow)">
                  {/* Roof */}
                  <polygon points="250,380 285,397.5 250,415 215,397.5" fill="#F8FAFC" />
                  {/* Left wall */}
                  <polygon points="215,397.5 250,415 250,470 215,452.5" fill="#E2E8F0" />
                  {/* Right wall */}
                  <polygon points="250,415 285,397.5 285,452.5 250,470" fill="#CBD5E1" />
                </g>

                {/* Building 3 (Right Center) */}
                <g filter="url(#building-shadow)">
                  {/* Roof */}
                  <polygon points="720,380 755,397.5 720,415 685,397.5" fill="#FFFFFF" />
                  {/* Left wall */}
                  <polygon points="685,397.5 720,415 720,500 685,482.5" fill="#E2E8F0" />
                  {/* Right wall */}
                  <polygon points="720,415 755,397.5 755,482.5 720,500" fill="#CBD5E1" />
                </g>

                {/* Streetlights and Trees */}
                {/* Tree 1 */}
                <line x1="300" y1="520" x2="300" y2="510" stroke="#475569" strokeWidth="2" />
                <circle cx="300" cy="505" r="8" fill="#10B981" opacity="0.8" />
                {/* Tree 2 */}
                <line x1="340" y1="500" x2="340" y2="490" stroke="#475569" strokeWidth="2" />
                <circle cx="340" cy="485" r="7" fill="#10B981" opacity="0.8" />
                {/* Tree 3 */}
                <line x1="600" y1="370" x2="600" y2="360" stroke="#475569" strokeWidth="2" />
                <circle cx="600" cy="355" r="8" fill="#10B981" opacity="0.8" />
                {/* Tree 4 */}
                <line x1="640" y1="350" x2="640" y2="340" stroke="#475569" strokeWidth="2" />
                <circle cx="640" cy="335" r="7" fill="#10B981" opacity="0.8" />

                {/* Pothole Detection Node Visuals */}
                <ellipse cx="320" cy="470" rx="10" ry="5" fill="rgba(239, 68, 68, 0.1)" stroke="#EF4444" strokeWidth="1.5" />
                <polygon points="308,465 332,465 332,475 308,475" fill="none" stroke="rgba(37,99,235,0.4)" strokeWidth="1" strokeDasharray="2 2" />
                
                {/* Expanding Scan Rings */}
                <motion.ellipse
                  cx="320"
                  cy="470"
                  rx={10}
                  ry={5}
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                  fill="none"
                  animate={{ rx: [10, 45], ry: [5, 22.5], opacity: [1, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.ellipse
                  cx="320"
                  cy="470"
                  rx={10}
                  ry={5}
                  stroke="#06B6D4"
                  strokeWidth="1.5"
                  fill="none"
                  animate={{ rx: [10, 45], ry: [5, 22.5], opacity: [1, 0] }}
                  transition={{ duration: 2.8, delay: 0.9, repeat: Infinity, ease: "easeOut" }}
                />

                {/* AI Scan Beam from Cloud to Pothole */}
                <motion.polygon
                  points="490,140 510,140 335,470 305,470"
                  fill="url(#scan-beam-grad)"
                  style={{ mixBlendMode: 'screen' }}
                  animate={{ opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Core Laser Detection Line */}
                <motion.line
                  x1="500"
                  y1="140"
                  x2="320"
                  y2="470"
                  stroke="#06B6D4"
                  strokeWidth="2.0"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Repaired Crew Municipal Vehicle (Static) */}
                <g transform="translate(660, 290)">
                  <rect x="-12" y="-6" width="24" height="12" rx="2" fill="#F97316" stroke="#FFFFFF" strokeWidth="1" />
                  <rect x="2" y="-4" width="8" height="8" fill="#E2E8F0" />
                  <circle cx="-6" cy="6" r="2" fill="#0F172A" />
                  <circle cx="6" cy="6" r="2" fill="#0F172A" />
                </g>

                {/* Workers (clean circles and lines representing hard hats and vests) */}
                <g transform="translate(640, 310)">
                  {/* Worker 1 */}
                  <circle cx="0" cy="0" r="2.5" fill="#F97316" />
                  <line x1="0" y1="2.5" x2="0" y2="8" stroke="#1E293B" strokeWidth="1.5" />
                  {/* Worker 2 */}
                  <circle cx="8" cy="-2" r="2.5" fill="#F97316" />
                  <line x1="8" y1="0.5" x2="8" y2="6.5" stroke="#1E293B" strokeWidth="1.5" />
                </g>

                {/* Subtle AI network nodes along the road segments */}
                <circle cx="200" cy="530" r="3.5" fill="#3B82F6" opacity="0.8" />
                <circle cx="200" cy="530" r="8" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />

                <circle cx="450" cy="405" r="3.5" fill="#3B82F6" opacity="0.8" />
                <circle cx="450" cy="405" r="8" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />

                <circle cx="300" cy="295" r="3.5" fill="#3B82F6" opacity="0.8" />
                <circle cx="300" cy="295" r="8" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />

                <circle cx="700" cy="495" r="3.5" fill="#3B82F6" opacity="0.8" />
                <circle cx="700" cy="495" r="8" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />

                {/* Central Floating AI Cloud Capsule */}
                <g transform="translate(0, -10)">
                  <circle cx="500" cy="140" r="40" fill="rgba(37, 99, 235, 0.15)" filter="blur(8px)" />

                  <motion.g
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <rect x="465" y="105" width="70" height="70" rx="20" fill="rgba(255, 255, 255, 0.85)" stroke="rgba(37, 99, 235, 0.25)" strokeWidth="1.5" style={{ backdropFilter: 'blur(10px)' }} />
                    <Brain size={28} style={{ color: '#2563EB' }} x="486" y="126" />
                  </motion.g>
                </g>

                {/* Future weak road section indicators (Predictive overlay) */}
                <polygon points="760,240 780,230 810,245 790,255" fill="none" stroke="#F97316" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="770" y1="210" x2="785" y2="235" stroke="#F97316" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="815" y="240" fill="#F97316" fontFamily="var(--font-mono)" fontSize="8" fontWeight="600">Risk Detected</text>
              </svg>

            </div>

          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM */}
      <section id="problem" style={{ borderBottom: "1px solid var(--border-color)", position: "relative" }}>
        <div style={{ position: "absolute", right: "3%", top: "80px", opacity: 0.05, fontFamily: "var(--font-mono)", fontSize: "0.75rem", pointerEvents: "none", userSelect: "none", writingMode: "vertical-rl", letterSpacing: "0.1em" }}>
          SYS.MODEL_DECAY // RECP_FEED // STRESS_CONF_99.2%
        </div>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// 01. THE PROBLEM</span>
            <h2>A minor fracture is a fatal delay.</h2>
          </div>

          <div className="grid-2" style={{ alignItems: "center" }}>
            <FadeUp>
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
                <p style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "1.1rem" }}>
                  A standard road crack seems harmless, but underneath, moisture seepage, structural vibration, and cargo weight combine to wash out the road base.
                </p>
                <p style={{ fontSize: "0.95rem" }}>
                  By the time a pothole breaks through the surface, it is already too late. Standard municipal inspection models rely on manual citizen reporting. The result: resolution times often average 45 days, causing severe vehicular accidents and road fatalities.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
                  <div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-warn)", fontFamily: "var(--font-mono)" }}>
                      <StatCounter value="6" suffix="+" />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>DAILY FATALITIES (MoRTH)</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                      <StatCounter value="45" suffix=" Days" />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>AVG RESOLVE TIME</div>
                  </div>
                </div>
              </div>

              {/* Minimalist monoline vector SVG explaining road fracture layers */}
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <span className="mono" style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>CORRIDOR STRUCTURAL DECAY LAYERS</span>
                <svg viewBox="0 0 400 160" className="illustration-svg" style={{ strokeWidth: 1.2 }}>
                  {/* Asphalt Surface */}
                  <motion.line x1="20" y1="30" x2="380" y2="30" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                  <motion.path d="M 200,30 L 204,40 L 200,55 L 208,70 L 202,90 L 210,110" className="accent-warn" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                  
                  {/* Base Layer */}
                  <motion.line x1="20" y1="70" x2="380" y2="70" style={{ strokeDasharray: "4 4" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                  
                  {/* Sub-Base Layer */}
                  <motion.line x1="20" y1="110" x2="380" y2="110" style={{ strokeDasharray: "8 4" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />

                  {/* Ground Base */}
                  <motion.line x1="20" y1="140" x2="380" y2="140" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />

                  {/* Water flow indicator */}
                  <motion.path d="M 180,30 Q 190,50 185,75 T 195,110" className="accent-ai" style={{ strokeDasharray: "2 2" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                  
                  <text x="30" y="24" className="mono" style={{ fontSize: "8px", fill: "var(--text-secondary)", stroke: "none" }}>ASPHALT SURFACE</text>
                  <text x="30" y="64" className="mono" style={{ fontSize: "8px", fill: "var(--text-secondary)", stroke: "none" }}>BASE COMPACTION</text>
                  <text x="30" y="104" className="mono" style={{ fontSize: "8px", fill: "var(--text-secondary)", stroke: "none" }}>SUB-BASE GRAVEL</text>
                  <text x="220" y="65" className="mono" style={{ fontSize: "8px", fill: "var(--color-warn)", stroke: "none" }}>FRACTURE SHEAR</text>
                  <text x="210" y="125" className="mono" style={{ fontSize: "8px", fill: "var(--color-ai)", stroke: "none" }}>WATER SEEPAGE</text>
                </svg>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <DelayRiskCalculator />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 3. CURRENT SYSTEM COMPARISON */}
      <section id="workflow" style={{ borderBottom: "1px solid var(--border-color)" }}>
        <div className="container">
          <div className="section-header text-center" style={{ margin: "0 auto 80px" }}>
            <span className="section-tag">// 02. SYSTEM COMPARISON</span>
            <h2>Reactive decay vs. predictive maintenance.</h2>
          </div>

          <div className="grid-2">
            <FadeUp className="card" style={{ borderTop: "4px solid var(--color-warn)", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <span className="tag" style={{ color: "var(--color-warn)", borderColor: "rgba(249, 115, 22, 0.2)" }}>TRADITIONAL WORKFLOW</span>
                <h3 style={{ marginTop: "16px", marginBottom: "8px" }}>Reactive & Manual</h3>
                <p style={{ fontSize: "0.95rem" }}>Slow physical feedback loops and municipal backlogs.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <AlertTriangle size={18} style={{ color: "var(--color-warn)", flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem", display: "block" }}>Manual Inspection Crews</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Requires manual drives to physically spot and scale road failures.</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <AlertTriangle size={18} style={{ color: "var(--color-warn)", flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem", display: "block" }}>Paper Bidding Allocation</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Lengthy work dispatch validation delays repair actions.</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <AlertTriangle size={18} style={{ color: "var(--color-warn)", flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem", display: "block" }}>Unprioritized Scheduling</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>PWD teams repair potholes in random sequence, regardless of roadway speed.</span>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.2} className="card" style={{ borderTop: "4px solid var(--color-success)", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <span className="tag" style={{ color: "var(--color-success)", borderColor: "rgba(16, 185, 129, 0.2)" }}>ROADPULSE AI PIPELINE</span>
                <h3 style={{ marginTop: "16px", marginBottom: "8px" }}>Predictive & Automated</h3>
                <p style={{ fontSize: "0.95rem" }}>Continuous passive scanning with automated payment dispatch.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <CheckCircle size={18} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem", display: "block" }}>Passive Crowdsourced Audits</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Standard video footage scans urban grids multiple times a day.</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <CheckCircle size={18} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem", display: "block" }}>Cryptographic Work Orders</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>AI certifies defect depth and triggers automated repair contracts.</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <CheckCircle size={18} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem", display: "block" }}>Neural QA Seal Stamp</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Algorithm cross-verifies contractor patch profile to authorize payment.</span>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 4. THE SOLUTION: ANIMATED ARCHITECTURE FLOW */}
      <section id="solution" style={{ borderBottom: "1px solid var(--border-color)", background: "#FAFAF8" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// 03. SOLUTION ARCHITECTURE</span>
            <h2>The Telemetry Loop.</h2>
          </div>

          <div className="grid-2" style={{ alignItems: "start" }}>
            
            {/* Step list navigation */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {workflowSteps.map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`card card-hover`}
                  style={{ 
                    cursor: "pointer",
                    padding: "20px 24px",
                    borderLeft: activeStep === idx ? "4px solid var(--color-ai)" : "1px solid var(--border-color)",
                    backgroundColor: activeStep === idx ? "#FAFBFD" : "var(--bg-card)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>0{idx + 1}. {step.tag}</span>
                    {activeStep === idx && <span style={{ color: "var(--color-ai)", fontSize: "0.8rem", fontWeight: 700 }}>ACTIVE</span>}
                  </div>
                  <h4 style={{ fontSize: "1.1rem", marginTop: "8px", fontWeight: 600 }}>{step.title}</h4>
                </div>
              ))}
            </div>

            {/* Displaying details of active step */}
            <div className="card" style={{ minHeight: "440px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderColor: "var(--color-ai)" }}>
              <div>
                <span className="tag" style={{ color: "var(--color-ai)", borderColor: "rgba(37, 99, 235, 0.2)", marginBottom: "20px" }}>
                  PHASE 0{activeStep + 1} LOGISTICS
                </span>
                
                <h3 style={{ fontSize: "1.8rem", marginBottom: "16px" }}>{workflowSteps[activeStep].title}</h3>
                
                <p style={{ fontSize: "0.95rem", marginBottom: "32px" }}>
                  {workflowSteps[activeStep].desc}
                </p>

                {activeStep === 4 && (
                  <div style={{ marginBottom: "32px" }}>
                    <span className="mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "12px" }}>
                      DRAG TO COMPARE DEFECT VS AI LEVEL SEAL COMPLETED:
                    </span>
                    <CompareSlider />
                  </div>
                )}
              </div>

              {/* Technical indicators inside display box */}
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
                <span className="mono" style={{ fontSize: "0.7rem", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                  ACTIVE COMPUTATIONAL PARADIGM:
                </span>
                <span className="mono" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-ai)" }}>
                  {workflowSteps[activeStep].tech}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS: TIMELINE */}
      <section id="how-it-works" style={{ borderBottom: "1px solid var(--border-color)", position: "relative" }}>
        <div style={{ position: "absolute", left: "3%", top: "80px", opacity: 0.05, fontFamily: "var(--font-mono)", fontSize: "0.75rem", pointerEvents: "none", userSelect: "none", writingMode: "vertical-rl", letterSpacing: "0.1em" }}>
          SYS.OPER_INGEST // PILOT_STAGE_01 // FEED_ACTIVE_PROBES
        </div>
        <div className="container">
          <div className="section-header text-center" style={{ margin: "0 auto 80px" }}>
            <span className="section-tag">// 04. OPERATIONS FLOW</span>
            <h2>Three operational phases.</h2>
          </div>

          <div className="grid-3">
            {/* Phase 1 */}
            <FadeUp className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>PHASE 01 // SILENT OBSERVATION</div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Silent Observation</h4>
              <p style={{ fontSize: "0.85rem" }}>
                We don't buy new equipment or build expensive sensors. RoadPulse works quietly behind the scenes, using existing dashcams and daily transit vehicles to map road quality as they drive their normal routes.
              </p>
              
              {/* Custom monoline SVG illustrating scanning vehicle */}
              <svg viewBox="0 0 200 100" className="illustration-svg">
                {/* Minimalist Car layout */}
                <motion.rect x="30" y="45" width="100" height="30" rx="4" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.path d="M 50,45 L 70,25 L 110,25 L 120,45" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.circle cx="55" cy="75" r="10" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.circle cx="105" cy="75" r="10" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                {/* Camera probe FOV */}
                <motion.path d="M 125,35 L 175,10 M 125,35 L 175,60" style={{ strokeDasharray: "2 2" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.path d="M 175,10 A 30 30 0 0 1 175,60" className="accent-ai" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <text x="135" y="80" className="mono" style={{ fontSize: "6px", fill: "var(--text-secondary)", stroke: "none" }}>DASH CAMERA</text>
              </svg>
            </FadeUp>

            {/* Phase 2 */}
            <FadeUp delay={0.1} className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>PHASE 02 // INTELLIGENT INSIGHT</div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Intelligent Insight</h4>
              <p style={{ fontSize: "0.85rem" }}>
                Our AI translates simple raw video feeds into a live, three-dimensional depth profile of every defect. It ranks each hazard by its urgency, identifying which repairs will protect the most drivers.
              </p>

              {/* Custom monoline SVG illustrating coordinate wave analysis */}
              <svg viewBox="0 0 200 100" className="illustration-svg">
                {/* Coordinate Grid axes */}
                <motion.line x1="20" y1="80" x2="180" y2="80" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.line x1="20" y1="10" x2="20" y2="80" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                {/* Wave profile */}
                <motion.path d="M 20,40 Q 60,10 90,50 T 150,20 Q 165,80 180,80" className="accent-ai" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.line x1="90" y1="50" x2="90" y2="80" style={{ strokeDasharray: "2 2" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.circle cx="90" cy="50" r="4" className="accent-warn" style={{ fill: "none" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <text x="100" y="55" className="mono" style={{ fontSize: "6px", fill: "var(--color-warn)", stroke: "none" }}>DEFECT STRESS</text>
              </svg>
            </FadeUp>

            {/* Phase 3 */}
            <FadeUp delay={0.2} className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>PHASE 03 // SWIFT RESOLUTION</div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Swift Resolution</h4>
              <p style={{ fontSize: "0.85rem" }}>
                Maintenance teams are notified automatically with exact location details. Once the repair is complete, the AI performs a final visual audit to certify the quality before releasing contractor payouts.
              </p>

              {/* Custom monoline SVG illustrating smart contract verified stamp */}
              <svg viewBox="0 0 200 100" className="illustration-svg">
                {/* Document layout */}
                <motion.rect x="40" y="15" width="120" height="70" rx="3" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.line x1="55" y1="30" x2="145" y2="30" style={{ strokeDasharray: "3 3" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.line x1="55" y1="45" x2="145" y2="45" style={{ strokeDasharray: "3 3" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.line x1="55" y1="60" x2="105" y2="60" style={{ strokeDasharray: "3 3" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                {/* Stamp */}
                <motion.circle cx="130" cy="65" r="14" className="accent-success" style={{ fill: "none", strokeWidth: 1.5 }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <motion.path d="M 124,65 L 128,69 L 137,60" className="accent-success" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                <text x="114" y="93" className="mono" style={{ fontSize: "6px", fill: "var(--color-success)", stroke: "none" }}>AI CERTIFIED</text>
              </svg>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 6. SUSTAINABILITY */}
      <section id="sustainability" style={{ borderBottom: "1px solid var(--border-color)", background: "#FAFAF8", position: "relative" }}>
        <div style={{ position: "absolute", right: "3%", top: "80px", opacity: 0.05, fontFamily: "var(--font-mono)", fontSize: "0.75rem", pointerEvents: "none", userSelect: "none", writingMode: "vertical-rl", letterSpacing: "0.1em" }}>
          SYS.ECO_SAVINGS // CARBON_OFFSET // COMPACTION_GAIN
        </div>
        <div className="container">
          <div className="section-header">
            <span className="section-tag" style={{ color: "var(--color-env)" }}>// 05. SUSTAINABILITY</span>
            <h2>Eco Infrastructure.</h2>
          </div>

          <div className="grid-2" style={{ alignItems: "center" }}>
            <FadeUp>
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
                <p style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "1.1rem" }}>
                  Fixing road damage in hours instead of months keeps commercial logistics flows moving at maximum fuel efficiency.
                </p>
                <p style={{ fontSize: "0.95rem" }}>
                  Furthermore, localized micro-patching avoids heavy repaving operations, reducing asphalt compound demands, machinery operation hours, and freight truck detour emissions.
                </p>
              </div>

              {/* Environmental monoline SVG diagram */}
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <span className="mono" style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>COMMERCIAL CARBON LOOP RECOVERY</span>
                <svg viewBox="0 0 400 160" className="illustration-svg" style={{ strokeWidth: 1.2 }}>
                  {/* Tree structure fused with road line */}
                  <motion.path d="M 50,130 L 350,130" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                  {/* Abstract leaves */}
                  <motion.path d="M 200,130 L 200,60" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                  <motion.path d="M 200,90 Q 240,70 200,60" className="accent-env" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                  <motion.path d="M 200,105 Q 160,85 200,75" className="accent-env" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                  {/* Carbon flow nodes */}
                  <motion.circle cx="110" cy="100" r="18" style={{ strokeDasharray: "2 2" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                  <motion.circle cx="290" cy="100" r="18" style={{ strokeDasharray: "2 2" }} variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} />
                  
                  <text x="82" y="103" className="mono" style={{ fontSize: "7px", fill: "var(--text-secondary)", stroke: "none" }}>SMOOTH RUN</text>
                  <text x="264" y="103" className="mono" style={{ fontSize: "7px", fill: "var(--text-secondary)", stroke: "none" }}>LESS IDLING</text>
                  <text x="212" y="70" className="mono" style={{ fontSize: "7px", fill: "var(--color-env)", stroke: "none" }}>CO2 RECOVERY</text>
                </svg>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <DecarbonizationCounter />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 7. INNOVATION */}
      <section id="innovation" style={{ borderBottom: "1px solid var(--border-color)" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag" style={{ color: "var(--color-ai)" }}>// 06. INNOVATION ENGINE</span>
            <h2>Edge Tech & Laser Profiling.</h2>
          </div>

          <div className="bento-grid" style={{ alignItems: "stretch" }}>
            <FadeUp delay={0.2} style={{ display: "flex" }}>
              <div style={{ width: "100%", display: "flex" }}>
                <DepthCoordinateSandbox />
              </div>
            </FadeUp>

            <FadeUp style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="card card-hover" style={{ flex: 1, padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-ai)", display: "block" }}>// MONOCULAR RECONSTRUCTION</span>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "12px", marginBottom: "8px" }}>Monocular 3D Reconstruction</h4>
                  <p style={{ fontSize: "0.85rem" }}>
                    Calculates high-accuracy 3D depth parameters from simple 2D dashcam visual feeds, eliminating the need for expensive lidar setups.
                  </p>
                </div>
              </div>

              <div className="card card-hover" style={{ flex: 1, padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-ai)", display: "block" }}>// PREDICTIVE ROT FORECASTER</span>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "12px", marginBottom: "8px" }}>Predictive Stress Decay Forecaster</h4>
                  <p style={{ fontSize: "0.85rem" }}>
                    Analyzes thermal trends, regional moisture maps, and historical road data to flag sub-surface asphalt rot before cracks open.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 8. TARGET USERS / IMPACT */}
      <section id="impact" style={{ borderBottom: "1px solid var(--border-color)", background: "#FAFAF8" }}>
        <div className="container">
          <div className="section-header text-center" style={{ margin: "0 auto 80px" }}>
            <span className="section-tag">// 07. TARGET USERS</span>
            <h2>Designed for the entire ecosystem.</h2>
          </div>

          <div className="grid-2" style={{ alignItems: "center" }}>
            
            {/* Stakeholder cards list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {stakeholders.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveStakeholder(idx)}
                  className="card card-hover"
                  style={{
                    cursor: "pointer",
                    padding: "16px 20px",
                    borderLeft: activeStakeholder === idx ? "4px solid var(--color-success)" : "1px solid var(--border-color)",
                    backgroundColor: activeStakeholder === idx ? "#F9FDFB" : "var(--bg-card)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ color: activeStakeholder === idx ? "var(--color-success)" : "var(--text-secondary)" }}>
                      {s.icon}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{s.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stakeholder details panel */}
            <div className="card" style={{ minHeight: "360px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderColor: "var(--color-success)" }}>
              <div>
                <span className="tag" style={{ color: "var(--color-success)", borderColor: "rgba(16, 185, 129, 0.2)", marginBottom: "20px" }}>
                  STAKEHOLDER BENEFITS & TELEMETRY
                </span>
                
                <h3 style={{ fontSize: "1.6rem", marginBottom: "16px" }}>{stakeholders[activeStakeholder].title}</h3>
                
                <p style={{ fontSize: "0.95rem", marginBottom: "32px" }}>
                  {stakeholders[activeStakeholder].desc}
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
                <span className="mono" style={{ fontSize: "0.7rem", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                  ESTIMATED SYSTEM ADVANTAGE:
                </span>
                <span className="mono" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-success)" }}>
                  {stakeholders[activeStakeholder].metric}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. ROADMAP */}
      <section id="roadmap" style={{ borderBottom: "1px solid var(--border-color)" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag" style={{ color: "var(--color-ai)" }}>// 08. DEVELOPMENT ROADMAP</span>
            <h2>The roadmap to zero-fatalities.</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {roadmapMilestones.map((milestone, idx) => (
              <div 
                key={idx}
                className="card"
                style={{ 
                  borderColor: expandedRoadmapMilestone === idx ? "var(--color-ai)" : "var(--border-color)",
                  cursor: "pointer"
                }}
                onClick={() => setExpandedRoadmapMilestone(expandedRoadmapMilestone === idx ? -1 : idx)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span className="mono" style={{ color: "var(--color-ai)", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>
                      {milestone.quarter}
                    </span>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: 600 }}>{milestone.title}</h4>
                  </div>
                  
                  <div>
                    {expandedRoadmapMilestone === idx ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedRoadmapMilestone === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ ease: easeCurve, duration: 0.4 }}
                      style={{ overflow: "hidden", borderTop: "1px solid var(--border-color)" }}
                    >
                      <div style={{ paddingTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {milestone.points.map((p, pIdx) => (
                          <div key={pIdx} style={{ display: "flex", gap: "12px", alignItems: "start" }}>
                            <CornerRightDown size={14} style={{ color: "var(--color-ai)", marginTop: "4px", flexShrink: 0 }} />
                            <p style={{ fontSize: "0.9rem", margin: 0 }}>{p}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. VISION SECTION */}
      <section id="vision" style={{ borderBottom: "1px solid var(--border-color)", background: "#FAFAF8" }}>
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <span className="section-tag" style={{ color: "var(--color-ai)" }}>// 09. CORE STATEMENT</span>
            
            <blockquote style={{ 
              fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", 
              fontFamily: "var(--font-heading)", 
              fontWeight: 800, 
              color: "var(--text-primary)",
              lineHeight: 1.3,
              marginTop: "24px",
              marginBottom: "32px"
            }}>
              "To eliminate road fatalities by catching the defect before it causes the accident."
            </blockquote>
            
            <span className="mono" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              ROADPULSE AI &bull; PLATFORM VISION
            </span>
          </div>
        </div>
      </section>

          </motion.div>
        ) : (
          <About onBack={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        )}
      </AnimatePresence>

      <Footer currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}
