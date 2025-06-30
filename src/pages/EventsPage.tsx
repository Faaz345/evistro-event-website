import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

import Layout from '../components/Layout';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEvents } from '../hooks/useEvents';
import { eventTypes, contactInfo } from '../data/eventTypes';

const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { events, loading } = useEvents({ category: selectedCategory || undefined });
  const [categories, setCategories] = useState<string[]>([]);
  
  // Extract unique categories from events
  useEffect(() => {
    if (events.length > 0) {
      const uniqueCategories = [...new Set(events.map(event => event.category))];
      setCategories(uniqueCategories);
    }
  }, [events]);

  // GSAP animations
  useEffect(() => {
    gsap.from('.events-title', { 
      opacity: 0, 
      y: 30, 
      duration: 0.8,
      ease: 'power3.out' 
    });
    
    gsap.from('.filter-container', { 
      opacity: 0, 
      y: 20, 
      duration: 0.6,
      delay: 0.3,
      ease: 'power3.out' 
    });
  }, []);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="relative py-24 md:py-32 bg-gradient-to-b from-secondary/20 to-primary">
        <div className="container text-center">
          <motion.h1
            className="events-title text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Explore
            </span>{' '}
            Events
          </motion.h1>
          <motion.p
            className="text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {contactInfo.slogan} {contactInfo.tagline}
          </motion.p>
        </div>
      </div>

      {/* Event Types Section */}
      <div className="bg-primary py-12 md:py-16">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {eventTypes.map((eventType) => (
              <motion.div
                key={eventType.id}
                className="card p-6 text-center hover:scale-105 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="w-32 h-32 mx-auto mb-4">
                  <img src={eventType.image} alt={eventType.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-accent">{eventType.name}</h3>
                <p className="text-white/70 text-sm">{eventType.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Contact Info */}
          <div className="card p-8 text-center mb-16">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Contact Us
            </h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${contactInfo.phone1}`} className="text-white hover:text-accent transition-colors">
                  {contactInfo.phone1}
                </a>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${contactInfo.phone2}`} className="text-white hover:text-accent transition-colors">
                  {contactInfo.phone2}
                </a>
              </div>
            </div>
            <p className="mt-4 text-white/70">{contactInfo.serviceArea}</p>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Upcoming Events
            </span>
          </h2>

          {/* Category Filter */}
          <div className="filter-container mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === null
                    ? 'bg-accent text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white/70'
                }`}
                onClick={() => handleCategoryChange(null)}
              >
                All Events
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-accent text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white/70'
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner text="Loading events..." />
            </div>
          ) : events.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory || 'all'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {events.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="text-white/50 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">No Events Found</h3>
              <p className="text-white/70">
                No events found matching the selected category. Please try another category.
              </p>
              <button
                className="mt-4 btn-outline"
                onClick={() => handleCategoryChange(null)}
              >
                Show All Events
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EventsPage; 