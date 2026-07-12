import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const navItems = [
  { name: 'Problem', id: 'problem' },
  { name: 'Workflow', id: 'workflow' },
  { name: 'Sustainability', id: 'sustainability' },
  { name: 'Innovation', id: 'innovation' },
  { name: 'Impact', id: 'impact' },
  { name: 'Roadmap', id: 'roadmap' },
  { name: 'About', id: 'about' },
];

export default function Navbar({ currentView, setCurrentView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const heroEl = document.getElementById('hero');
    if (heroEl) observer.observe(heroEl);
    
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);

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
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const displayActiveSection = currentView === 'about' ? 'about' : activeSection;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1], duration: 0.5 } },
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} className="logo">
            ROADPULSE AI
          </a>

          <div className="desktop-links">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`nav-link ${displayActiveSection === item.id ? 'active' : ''}`}
              >
                {item.name}
                {displayActiveSection === item.id && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="nav-link-underline"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
        
        {/* Scroll Progress Bar */}
        {currentView !== 'about' && (
          <div className="scroll-progress-container">
            <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
          </div>
        )}
      </nav>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="mobile-overlay-content"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {navItems.map((item) => (
                <motion.a
                  variants={itemVariants}
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`mobile-link ${displayActiveSection === item.id ? 'active' : ''}`}
                >
                  {item.name}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
