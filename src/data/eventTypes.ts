interface EventType {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const eventTypes: EventType[] = [
  {
    id: 1,
    name: 'Wedding',
    description: 'Full wedding planning and coordination services',
    image: '/assets/images/event-wedding.svg'
  },
  {
    id: 2,
    name: 'Corporate Event',
    description: 'Business meetings, conferences, and team-building events',
    image: '/assets/images/event-corporate.svg'
  },
  {
    id: 3,
    name: 'Birthday Party',
    description: 'Birthday celebrations for all ages',
    image: '/assets/images/event-birthday.svg'
  },
  {
    id: 4,
    name: 'Anniversary',
    description: 'Anniversary celebrations and vow renewals',
    image: '/assets/images/event-anniversary.svg'
  },
  {
    id: 5,
    name: 'Graduation',
    description: 'Graduation ceremonies and celebrations',
    image: '/assets/images/event-graduation.svg'
  },
  {
    id: 6,
    name: 'Holiday Party',
    description: 'Seasonal and holiday-themed events',
    image: '/assets/images/event-holiday.svg'
  },
  {
    id: 7,
    name: 'Charity Gala',
    description: 'Fundraising events and charity galas',
    image: '/assets/images/event-charity.svg'
  },
  {
    id: 8,
    name: 'Concert',
    description: 'Live music performances and concerts',
    image: '/assets/images/event-concert.svg'
  },
  {
    id: 9,
    name: 'Festival',
    description: 'Multi-day festivals and cultural events',
    image: '/assets/images/event-festival.svg'
  },
  {
    id: 10,
    name: 'Workshop',
    description: 'Educational workshops and training sessions',
    image: '/assets/images/event-workshop.svg'
  },
  {
    id: 11,
    name: 'Product Launch',
    description: 'New product announcements and launches',
    image: '/assets/images/event-product.svg'
  },
  {
    id: 12,
    name: 'Private Party',
    description: 'Exclusive private gatherings and celebrations',
    image: '/assets/images/event-private.svg'
  }
];

export const contactInfo = {
  phone1: '8850051841',
  phone2: '9082914889',
  email: 'contact@evistro.com',
  slogan: 'You dream, we plan!',
  tagline: 'Big celebrations, small budgets! We make every event so beautiful and lively, it becomes a memory to cherish forever.',
  serviceArea: 'Orders accepted all over Mumbai!',
  address: 'Mumbai, Maharashtra, India',
  mapUrl: 'https://maps.google.com/?q=Mumbai,Maharashtra,India'
}; 