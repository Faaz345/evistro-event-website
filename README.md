# EviStro Event Management Website

A modern, responsive event management website built with React, TypeScript, and Supabase.

## Features

- **Public Website**
  - Browse upcoming events
  - View event details
  - Contact form for inquiries
  - User registration and login

- **User Dashboard**
  - Book events
  - View booking history
  - Update profile information

- **Admin Dashboard**
  - Manage events (create, edit, delete)
  - Track bookings and update their status
  - View and respond to contact messages
  - Automatic event tracking for confirmed bookings

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/evistro-event-website.git
   cd evistro-event-website
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## Deployment

The site is set up to be deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the environment variables in the Vercel dashboard
3. Deploy

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/lib/` - Utilities and configuration
- `src/context/` - Context providers
- `src/hooks/` - Custom React hooks
- `src/assets/` - Static assets

## License

This project is licensed under the MIT License.
