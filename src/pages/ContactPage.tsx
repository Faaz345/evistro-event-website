import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { contactInfo } from '../data/eventTypes';

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Submit to Supabase messages table
      const { error: supabaseError } = await supabase
        .from('contacts')
        .insert({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          responded: false,
        });

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(
          supabaseError.message || 'Failed to send message. Please try again.'
        );
      }

      // Success
      setSuccess(true);
      reset();
      
      // Optional: Send notification email to admin (would require server-side code)
      
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-primary pt-20 pb-16">
        {/* Simple background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary to-primary/90 pointer-events-none"></div>
        
        <div className="container relative z-10">
          {/* Page Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Contact
              </span>{' '}
              <span className="text-white">Us</span>
            </motion.h1>
            <motion.p
              className="text-white/70 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Have questions or need to book an event? We're here to help you create unforgettable experiences.
            </motion.p>
          </div>

          {/* Contact Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-white">Get in Touch</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="bg-secondary/20 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Email Us</h3>
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=evistroevents@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-accent transition-colors"
                      >
                        evistroevents@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="bg-secondary/20 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Call Us</h3>
                      <p className="text-white/70">
                        <a href={`tel:${contactInfo.phone1}`} className="hover:text-accent transition-colors block">{contactInfo.phone1}</a>
                        <a href={`tel:${contactInfo.phone2}`} className="hover:text-accent transition-colors block mt-1">{contactInfo.phone2}</a>
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start">
                    <div className="bg-green-600/20 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">WhatsApp Us</h3>
                      <a 
                        href="https://wa.me/918850051841"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-white/70 hover:text-green-500 transition-colors"
                      >
                        +91 88500 51841
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start">
                    <div className="bg-secondary/20 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Service Area</h3>
                      <p className="text-white/70">
                        {contactInfo.serviceArea}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-medium mb-4 text-white">Connect With Us</h3>
                  <div className="flex flex-wrap gap-3">
                    {/* Social icons */}
                    {[
                      { name: 'Facebook', icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>, link: "#" },
                      { name: 'Twitter', icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>, link: "#" },
                      { name: 'Instagram', icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></>, link: "#" },
                      { name: 'LinkedIn', icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></>, link: "#" },
                      { name: 'WhatsApp', icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>, link: "https://wa.me/918850051841" }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors ${social.name === 'WhatsApp' ? 'bg-green-600/20 hover:bg-green-600/30' : ''}`}
                        aria-label={`Connect on ${social.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${social.name === 'WhatsApp' ? 'text-green-500' : 'text-accent'}`}>
                          {social.icon}
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 shadow-lg overflow-hidden h-[250px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1651982316319!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mumbai Map"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg">
              {success ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Message Sent Successfully!</h3>
                  <p className="text-white/70 mb-6">
                    Thank you for reaching out to us. Our team will get back to you shortly.
                  </p>
                  <button 
                    className="bg-accent hover:bg-accent/90 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    onClick={() => setSuccess(false)}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-6 text-white">Send a Message</h2>
                  
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 mb-6 text-sm text-white">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1 text-white">
                          Your Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                          placeholder="John Doe"
                          disabled={loading}
                          {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && (
                          <span className="text-xs text-red-400 mt-1 block">{errors.name.message}</span>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                          placeholder="your@email.com"
                          disabled={loading}
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                        />
                        {errors.email && (
                          <span className="text-xs text-red-400 mt-1 block">{errors.email.message}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1 text-white">
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                        placeholder="How can we help you?"
                        disabled={loading}
                        {...register('subject', { required: 'Subject is required' })}
                      />
                      {errors.subject && (
                        <span className="text-xs text-red-400 mt-1 block">{errors.subject.message}</span>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1 text-white">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-none"
                        placeholder="Tell us about your event or inquiry..."
                        disabled={loading}
                        {...register('message', { required: 'Message is required' })}
                      />
                      {errors.message && (
                        <span className="text-xs text-red-400 mt-1 block">{errors.message.message}</span>
                      )}
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        {loading ? <LoadingSpinner size="small" color="white" /> : 'Send Message'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage; 