import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import Layout from '../components/Layout';
import ParticleBg from '../components/ParticleBg';
import LoadingSpinner from '../components/LoadingSpinner';
import EventCard from '../components/EventCard';

import { useEvents } from '../hooks/useEvents';
import { contactInfo, eventTypes } from '../data/eventTypes';

const HomePage = () => {
  const { events, loading } = useEvents({ featured: true, limit: 3 });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 pb-16">
        <ParticleBg />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary to-primary" />
        
        <div className="container relative z-10 text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6"
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
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {contactInfo.tagline}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link to="/events" className="btn-primary mr-4">
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
      <section className="py-20 bg-primary relative">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Event <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              From intimate gatherings to grand celebrations, we have the perfect solution for every occasion.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {eventTypes.slice(0, 5).map((category, index) => (
              <motion.div 
                key={category.id}
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-3">
                  <img src={category.image} alt={category.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="font-semibold text-white">{category.name}</h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/events" className="text-accent hover:text-white transition-colors">
              View All Categories →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-primary/90 relative">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Planning your perfect event with EviStro is simple and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Browse Events",
                description: "Explore our wide range of event types and packages to find what suits your needs."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Book Your Date",
                description: "Select your preferred date and time, and customize your event details."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Enjoy Your Event",
                description: "Relax and enjoy while our team takes care of everything from setup to execution."
              }
            ].map((step, index) => (
              <motion.div 
                key={index} 
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-primary relative">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Events</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Discover our most popular upcoming events and secure your spot before they're fully booked.
            </p>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner text="Loading events..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/events" className="btn-outline">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-primary/95 relative">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Client <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Testimonials</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              See what our clients have to say about their experience with EviStro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="card p-6 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="absolute top-4 left-4 text-4xl text-accent opacity-30 font-serif">
                  "
                </div>
                <div className="pt-6">
                  <p className="text-white/80 mb-6 italic">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-secondary to-accent p-0.5">
                      <div className="bg-primary rounded-full w-full h-full flex items-center justify-center text-accent font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-accent" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/contact" className="text-accent hover:text-white transition-colors">
              Share Your Experience →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 backdrop-blur-sm p-12 border border-white/10">
            <ParticleBg color="#FF0080" particleCount={100} particleSize={0.015} speed={0.0005} />
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Create Your Next Event?
              </h2>
              <p className="text-white/80 mb-8">
                Join EviStro today and transform your event planning experience. 
                Start creating memorable experiences with our powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/login" className="btn-primary">
                  Get Started
                </Link>
                <Link to="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage; 