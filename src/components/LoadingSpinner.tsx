import { motion } from 'framer-motion';

type LoadingSpinnerProps = {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  text?: string;
};

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'accent', 
  text 
}: LoadingSpinnerProps) => {
  // Define sizes
  const sizes = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  // Define colors
  const colors = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
    white: 'border-white',
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`rounded-full border-t-2 ${colors[color]} ${sizes[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="mt-2 text-sm text-white/70">{text}</p>}
    </div>
  );
};

export default LoadingSpinner; 