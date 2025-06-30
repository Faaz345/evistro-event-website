import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Event } from '../lib/supabase';

type EventCardProps = {
  event: Event;
  index?: number;
};

const EventCard = ({ event, index = 0 }: EventCardProps) => {
  // Format date
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      className="card group h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/events/${event.id}`} className="flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-accent rounded-xl">
        <div className="relative h-40 sm:h-48 overflow-hidden rounded-t-xl">
          <img
            src={event.image_url || (index % 2 === 0 ? '/src/assets/images/event1.svg' : '/src/assets/images/event2.svg')}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {event.featured && (
            <div className="absolute top-2 right-2 bg-accent px-2 py-1 rounded-full text-xs font-medium text-white">
              Featured
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
            <span className="text-xs font-medium rounded-full bg-white/20 backdrop-blur-sm px-2 py-1">
              {event.category}
            </span>
          </div>
        </div>
        <div className="flex-1 p-3 sm:p-4 flex flex-col">
          <div className="mb-1 sm:mb-2 text-xs sm:text-sm text-white/70">{formattedDate}</div>
          <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/60 flex-grow line-clamp-2">
            {event.description}
          </p>
          <div className="mt-3 sm:mt-4 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-white/70 truncate max-w-[60%]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1"
                aria-hidden="true"
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
              <span className="truncate">{event.location}</span>
            </span>
            <motion.span
              className="text-accent flex items-center text-xs sm:text-sm font-medium"
              whileHover={{ x: 5 }}
            >
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard; 