import { useState, useEffect } from 'react';

type AlertMessageProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
};

const AlertMessage: React.FC<AlertMessageProps> = ({ 
  message, 
  type = 'success', 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible || !message) return null;

  const bgColor = type === 'success' 
    ? 'bg-green-500/20 border-green-500/40' 
    : type === 'error' 
    ? 'bg-red-500/20 border-red-500/40' 
    : 'bg-blue-500/20 border-blue-500/40';

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} border p-4 rounded-md shadow-lg max-w-md animate-fade-in`}>
      <div className="flex items-center">
        <p className="text-white">{message}</p>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white/70 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AlertMessage; 