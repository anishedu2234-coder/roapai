import { motion } from 'framer-motion';
import { Brain, MapPin, CheckSquare, Leaf, ArrowLeft } from 'lucide-react';

const easeCurve = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: easeCurve
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { ease: easeCurve, duration: 0.8 } 
  }
};

export default function About({ onBack }) {
  return (
    <motion.div 
      className="about-page"
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.98 }}
      transition={{ ease: easeCurve, duration: 0.7 }}
      style={{ padding: "140px 0 80px", background: "var(--bg-base)" }}
    >
      <div className="container">
        {/* Back Link */}
        <motion.button 
          onClick={onBack}
          className="mono"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            background: "none", 
            border: "none", 
            color: "var(--text-secondary)", 
            cursor: "pointer",
            fontSize: "0.8rem",
            marginBottom: "40px",
            padding: "0"
          }}
          whileHover={{ x: -4, color: "var(--text-primary)" }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft size={14} /> BACK TO PRODUCT STORY
        </motion.button>

        {/* Hero Section */}
        <div style={{ maxWidth: "800px", marginBottom: "80px" }}>
          <span className="mono" style={{ fontSize: "0.8rem", color: "var(--color-ai)", letterSpacing: "0.1em", display: "block", marginBottom: "16px" }}>
            // THE MISSION
          </span>
          <h1 style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.1, marginBottom: "24px", letterSpacing: "-0.03em" }}>
            About RoadPulse AI
          </h1>
          <p style={{ fontSize: "1.5rem", color: "var(--text-secondary)", lineHeight: 1.4, fontWeight: 500 }}>
            Building safer roads through intelligent, predictive infrastructure.
          </p>
        </div>

        {/* Editorial Content Grid */}
        <motion.div 
          className="grid-2" 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ gap: "40px", marginBottom: "100px", alignItems: "start" }}
        >
          <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "var(--text-primary)" }}>
              RoadPulse AI is an AI-powered road intelligence platform designed to transform how cities detect, repair, and prevent potholes. Instead of relying on manual complaints and delayed inspections, the platform uses computer vision and predictive analytics to identify road damage early, prioritize repairs based on real-world impact, and help municipalities maintain safer, longer-lasting roads.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
              Our vision extends beyond pothole detection. We aim to create a transparent, accountable, and data-driven maintenance ecosystem where every repair is verified, every resource is optimized, and every kilometre of road contributes to a safer and more sustainable future.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "32px" }}>
              By leveraging existing smartphones, dashcams, and CCTV infrastructure, RoadPulse AI demonstrates how accessible technology can help cities reduce fuel wastage, lower carbon emissions, extend road lifespan, and improve the daily lives of millions of commuters.
            </p>
            
            {/* Decal Telemetry box */}
            <div className="card" style={{ padding: "24px", borderColor: "var(--border-color)", background: "#FFFFFF" }}>
              <span className="mono" style={{ fontSize: "0.7rem", color: "var(--text-secondary)", display: "block", marginBottom: "12px" }}>
                CORE ARCHITECTURE AUDIT //
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-primary)" }}>
                <div>&gt; CAMERA INGESTION STREAM: ACTIVE</div>
                <div>&gt; DECISION INDEX PRIORITY: ENABLED</div>
                <div>&gt; CONTRACT COMPLIANCE LOCK: SECURE</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Highlights Asymmetric Bento Grid */}
        <div style={{ marginBottom: "100px" }}>
          <span className="mono" style={{ fontSize: "0.8rem", color: "var(--color-ai)", letterSpacing: "0.1em", display: "block", marginBottom: "32px" }}>
            // KEY HIGHLIGHTS
          </span>

          <motion.div 
            className="bento-grid"
            style={{ gridTemplateColumns: "1fr", gap: "24px" }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Row 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="grid-md-2-1">
              {/* Highlight 1 (Wide 2-span equivalent) */}
              <motion.div 
                variants={itemVariants}
                className="card card-hover" 
                style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "220px" }}
              >
                <div style={{ color: "var(--color-ai)", marginBottom: "20px" }}><Brain size={24} /></div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "8px", fontWeight: 600 }}>AI-Powered Detection</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    Computer vision automatically identifies road damage in real time.
                  </p>
                </div>
              </motion.div>

              {/* Highlight 2 (Square) */}
              <motion.div 
                variants={itemVariants}
                className="card card-hover" 
                style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "220px" }}
              >
                <div style={{ color: "var(--color-warn)", marginBottom: "20px" }}><MapPin size={24} /></div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "8px", fontWeight: 600 }}>Smart Prioritization</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    Repairs are ranked based on severity, traffic density, and public safety.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Row 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="grid-md-1-2">
              {/* Highlight 3 (Square) */}
              <motion.div 
                variants={itemVariants}
                className="card card-hover" 
                style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "220px" }}
              >
                <div style={{ color: "var(--color-success)", marginBottom: "20px" }}><CheckSquare size={24} /></div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "8px", fontWeight: 600 }}>Quality Verification</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    AI validates completed repairs and promotes accountability.
                  </p>
                </div>
              </motion.div>

              {/* Highlight 4 (Wide 2-span equivalent) */}
              <motion.div 
                variants={itemVariants}
                className="card card-hover" 
                style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "220px" }}
              >
                <div style={{ color: "var(--color-env)", marginBottom: "20px" }}><Leaf size={24} /></div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "8px", fontWeight: 600 }}>Sustainable Infrastructure</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    Predictive maintenance minimizes material waste, fuel consumption, and unnecessary road reconstruction.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Closing Statement */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="card" 
          style={{ 
            padding: "60px 40px", 
            borderColor: "var(--color-ai)", 
            background: "#FFFFFF",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto 80px"
          }}
        >
          <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-ai)", display: "block", marginBottom: "16px" }}>
            // CONCLUSION
          </span>
          <p style={{ fontSize: "1.4rem", fontWeight: 500, lineHeight: 1.4, color: "var(--text-primary)", marginBottom: "32px" }}>
            "RoadPulse AI isn't just about fixing potholes—it's about reimagining how intelligent infrastructure can make every journey safer, more efficient, and more sustainable."
          </p>
          <motion.button
            onClick={onBack}
            className="btn btn-primary"
            style={{ padding: "12px 28px", fontSize: "0.9rem" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Interactive Story
          </motion.button>
        </motion.div>

      </div>
    </motion.div>
  );
}
