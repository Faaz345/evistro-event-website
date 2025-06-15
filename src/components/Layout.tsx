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

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

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
      {/* Custom cursor */}
      <SimpleCursor />
      
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/src/assets/images/bg-pattern.svg" alt="Background Pattern" className="w-full h-full object-cover opacity-50" />
      </div>
      {/* Navbar */}
      <header
        className={`fixed w-full z-30 transition-all duration-300 ${
          scrolled ? 'bg-primary/80 backdrop-blur shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="container py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/home" className="text-2xl font-bold text-white flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-10"
            >
              <img src="/src/assets/logo.svg" alt="EVISTRO Logo" className="h-full" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`hover:text-accent transition-colors ${
                  location.pathname === item.path ? 'text-accent' : 'text-white'
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
                className={`hover:text-accent transition-colors ${
                  location.pathname === item.path ? 'text-accent' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                    className={`hover:text-accent transition-colors ${
                      location.pathname === item.path ? 'text-accent' : 'text-white'
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
                    className={`hover:text-accent transition-colors ${
                      location.pathname === item.path ? 'text-accent' : 'text-white'
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
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="page-container"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-primary/80 backdrop-blur-sm py-10 mt-auto">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                      className="text-white/70 hover:text-accent transition-colors"
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
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mr-2 text-accent"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a href={`tel:${contactInfo.phone1}`} className="text-white/70 hover:text-accent transition-colors">
                    {contactInfo.phone1}
                  </a>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mr-2 text-accent"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a href={`tel:${contactInfo.phone2}`} className="text-white/70 hover:text-accent transition-colors">
                    {contactInfo.phone2}
                  </a>
                </div>
                <div className="text-white/70">
                  {contactInfo.serviceArea}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50">
            <p>© {new Date().getFullYear()} EviStro. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 