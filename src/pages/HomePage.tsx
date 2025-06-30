import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import Layout from '../components/Layout';
import ParticleBg from '../components/ParticleBg';
import LoadingSpinner from '../components/LoadingSpinner';
import EventCard from '../components/EventCard';
import AlertMessage from '../components/AlertMessage';

import { useEvents } from '../hooks/useEvents';
import { contactInfo, eventTypes } from '../data/eventTypes';

const HomePage = () => {
  const { events, loading } = useEvents({ featured: true, limit: 3 });
  const location = useLocation();

  return (
    <Layout>
      {/* Show alert message if passed in location state */}
      {location.state?.message && (
        <AlertMessage 
          message={location.state.message} 
          type="success" 
        />
      )}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 pb-16">
        <ParticleBg />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary to-primary" />
        
        <div className="container relative z-10 text-center px-4 sm:px-6">
          <motion.h1 
            className="heading-xl mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block mb-2">EVISTRO</span>
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              {contactInfo.slogan}
            </span>
          </motion.h1>
          
          <motion.p 
            className="paragraph max-w-3xl mx-auto mb-8 text-white/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {contactInfo.tagline}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link to="/events" className="btn-primary">
              Explore Events
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact Us
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white/50" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </motion.div>
          <span className="text-xs text-white/50 mt-1">Scroll Down</span>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-12 sm:py-20 bg-primary relative">
        <div className="container">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">
              Explore Event <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto paragraph">
              From intimate gatherings to grand celebrations, we have the perfect solution for every occasion.
            </p>
          </div>

          <div className="grid-responsive">
            {eventTypes.slice(0, 5).map((category, index) => (
              <motion.div 
                key={category.id}
                className="card p-4 sm:p-6 text-center flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3">
                  <img src={category.image} alt={category.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="font-semibold text-white text-sm sm:text-base">{category.name}</h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/events" className="text-accent hover:text-white transition-colors inline-block py-2 px-4">
              View All Categories →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 bg-primary/90 relative">
        <div className="container">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">
              How It <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto paragraph">
              Planning your perfect event with EviStro is simple and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Browse Events",
                description: "Explore our wide range of event types and packages to find what suits your needs."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Book Your Date",
                description: "Select your preferred date and time, and customize your event details."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Enjoy Your Event",
                description: "Relax and enjoy while our team takes care of everything from setup to execution."
              }
            ].map((step, index) => (
              <motion.div 
                key={index} 
                className="card p-4 sm:p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-white/70 text-sm sm:text-base">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-12 sm:py-20 bg-primary relative">
        <div className="container">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">
              Featured <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Events</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto paragraph">
              Discover our most popular upcoming events and secure your spot before they're fully booked.
            </p>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner text="Loading events..." />
            </div>
          ) : (
            <div className="grid-responsive-md">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <Link to="/events" className="btn-outline">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 bg-primary/95 relative">
        <div className="container">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">
              Client <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Testimonials</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto paragraph">
              See what our clients have to say about their experience with EviStro
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                role: "Birthday Celebration",
                quote: "EviStro transformed my birthday into an unforgettable experience. The attention to detail and personalized service exceeded all my expectations!"
              },
              {
                name: "Raj Malhotra",
                role: "Corporate Event Manager",
                quote: "We've organized multiple corporate events with EviStro, and they consistently deliver excellence. Their team is professional, creative, and incredibly responsive."
              },
              {
                name: "Ananya Patel",
                role: "Wedding Client",
                quote: "Our wedding was absolutely magical thanks to EviStro. They handled everything perfectly, allowing us to enjoy our special day without any stress."
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="card p-4 sm:p-6 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-accent/20 absolute top-4 left-4" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="pt-6">
                  <p className="text-white/80 mb-4 text-sm sm:text-base">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-white/60 text-xs sm:text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="heading-lg mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Ready to <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Plan Your Event</span>?
            </motion.h2>
            <motion.p 
              className="text-white/70 mb-8 paragraph"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Let us help you create memories that last a lifetime. Contact us today to get started!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/contact" className="btn-primary">
                Contact Us
              </Link>
              <Link to="/events" className="btn-outline">
                Browse Events
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage; 