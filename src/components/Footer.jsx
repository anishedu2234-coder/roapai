import './Footer.css';

export default function Footer({ currentView, setCurrentView }) {
  const handleNavClick = (e, id) => {
    e.preventDefault();

    if (id === 'about') {
      setCurrentView('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentView === 'about') {
      setCurrentView('home');
      sessionStorage.setItem('scrollTarget', id);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // height of sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: 'Problem', id: 'problem' },
    { name: 'Workflow', id: 'workflow' },
    { name: 'Sustainability', id: 'sustainability' },
    { name: 'Innovation', id: 'innovation' },
    { name: 'Impact', id: 'impact' },
    { name: 'Roadmap', id: 'roadmap' },
    { name: 'About', id: 'about' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>ROADPULSE AI</h2>
            <p className="footer-tagline">
              Autonomous road inspection. Resolving structural hazards before impact.
            </p>
          </div>

          <div className="footer-links-col">
            <span className="mono footer-col-title">// DIRECTORY</span>
            <div className="footer-links">
              {navItems.map((item) => (
                <a 
                  key={item.id} 
                  href={`#${item.id}`} 
                  onClick={(e) => handleNavClick(e, item.id)} 
                  className="footer-link underline-hover"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-cta-col">
            <span className="mono footer-col-title">// SYSTEM ACCESS</span>
            <div className="footer-cta">
              <a href="#workflow" onClick={(e) => handleNavClick(e, 'workflow')} className="btn btn-ghost" style={{ fontSize: "0.8rem", padding: "10px 20px" }}>
                Explore Pipeline
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RoadPulse AI. All telemetry feeds verified cryptographically.</p>
        </div>
      </div>
    </footer>
  );
}
