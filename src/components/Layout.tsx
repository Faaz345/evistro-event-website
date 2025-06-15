import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleCursor from './SimpleCursor';
import { useAuth } from '../context/AuthContext';
import { contactInfo } from '../data/eventTypes';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Menu items
  const menuItems = [
    { label: 'Home', path: '/home' },
    { label: 'Events', path: '/events' },
    { label: 'Contact', path: '/contact' },
  ];

  // User menu items
  const userMenuItems = user
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Sign Out', path: '#', onClick: signOut },
      ]
    : [{ label: 'Login', path: '/login' }];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Custom cursor - only show on non-touch devices */}
      {!isTouchDevice && <SimpleCursor />}
      
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/assets/images/bg-pattern.svg" alt="Background Pattern" className="w-full h-full object-cover opacity-50" />
      </div>
      
      {/* Navbar */}
      <header
        className={`fixed w-full z-30 transition-all duration-300 safe-area-inset ${
          scrolled ? 'bg-primary/90 backdrop-blur-md shadow-lg' : 'bg-primary/10 backdrop-blur-sm'
        }`}
      >
        <div className="container py-2 sm:py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/home" className="text-xl sm:text-2xl font-bold text-white flex items-center" aria-label="EVISTRO Home">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-8 sm:h-10"
            >
              <img src="/assets/logo.svg" alt="EVISTRO Logo" className="h-full" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-l border-white/20 h-6 mx-2" />

            {/* User menu */}
            {userMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={item.onClick}
                className={`nav-link ${
                  location.pathname === item.path ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-primary/95 backdrop-blur-lg"
            >
              <div className="container py-4 flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-3 px-4 rounded-md active:bg-white/10 text-base font-medium hover:text-accent transition-colors ${
                      location.pathname === item.path ? 'nav-link-active bg-white/5' : 'nav-link-inactive'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-white/20 my-2" />
                {userMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      item.onClick?.();
                    }}
                    className={`py-3 px-4 rounded-md active:bg-white/10 text-base font-medium hover:text-accent transition-colors ${
                      location.pathname === item.path ? 'nav-link-active bg-white/5' : 'nav-link-inactive'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-grow pt-16 sm:pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="page-container momentum-scroll relative z-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-primary/80 backdrop-blur-sm py-8 sm:py-10 mt-auto safe-area-inset">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                EVISTRO
              </h3>
              <p className="text-white/70">
                {contactInfo.slogan} {contactInfo.tagline}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-white/70 hover:text-accent transition-colors py-2 block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="flex flex-col space-y-2">
                <a 
                  href={`tel:${contactInfo.phone1}`} 
                  className="text-white/70 hover:text-accent transition-colors flex items-center py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mr-2 text-accent flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{contactInfo.phone1}</span>
                </a>
                <a 
                  href={`mailto:${contactInfo.email}`} 
                  className="text-white/70 hover:text-accent transition-colors flex items-center py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mr-2 text-accent flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="break-all">{contactInfo.email}</span>
                </a>
                <a 
                  href={contactInfo.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-accent transition-colors flex items-center py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mr-2 text-accent flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{contactInfo.address}</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-white/50 text-sm">
            <p>© {new Date().getFullYear()} EviStro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 