import { useState, useEffect } from 'react';

const SimpleCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over interactive elements
      const target = e.target as Element;
      setIsHovering(
        !!target.closest('button') || 
        !!target.closest('a') || 
        !!target.closest('.card')
      );
    };

    // Hide default cursor
    document.documentElement.style.cursor = 'none';
    
    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <div 
        className="cursor-dot" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})` 
        }}
      />
      <div 
        className="cursor-outline" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          width: isHovering ? '50px' : '30px',
          height: isHovering ? '50px' : '30px',
          opacity: isHovering ? 0.5 : 1,
          transform: 'translate(-50%, -50%)'
        }}
      />
    </>
  );
};

export default SimpleCursor; 