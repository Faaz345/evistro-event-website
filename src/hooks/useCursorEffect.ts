import { useEffect } from 'react';

export const useCursorEffect = () => {
  useEffect(() => {
    try {
      // Create cursor elements
      const cursorDot = document.createElement('div');
      cursorDot.className = 'cursor-dot';
      document.body.appendChild(cursorDot);

      const cursorOutline = document.createElement('div');
      cursorOutline.className = 'cursor-outline';
      document.body.appendChild(cursorOutline);

      // Track cursor position
      let cursorPosition = { x: 0, y: 0 };
      let outlinePosition = { x: 0, y: 0 };
      let isHovering = false;

      // Update position function
      const updatePosition = (e: MouseEvent) => {
        cursorPosition.x = e.clientX;
        cursorPosition.y = e.clientY;
        
        // Check for hoverable elements
        const target = e.target as Element;
        isHovering = !!(target.closest('button') || target.closest('a') || target.closest('.card'));
      };

      // Animation function
      const animateCursor = () => {
        // Update dot position immediately
        cursorDot.style.left = `${cursorPosition.x}px`;
        cursorDot.style.top = `${cursorPosition.y}px`;
        
        // Smooth following for the outline
        outlinePosition.x += (cursorPosition.x - outlinePosition.x) * 0.15;
        outlinePosition.y += (cursorPosition.y - outlinePosition.y) * 0.15;
        
        cursorOutline.style.left = `${outlinePosition.x}px`;
        cursorOutline.style.top = `${outlinePosition.y}px`;

        // Add effects when hovering over interactive elements
        if (isHovering) {
          cursorOutline.style.width = '50px';
          cursorOutline.style.height = '50px';
          cursorOutline.style.opacity = '0.5';
          cursorDot.style.transform = 'scale(1.5)';
        } else {
          cursorOutline.style.width = '30px';
          cursorOutline.style.height = '30px';
          cursorOutline.style.opacity = '1';
          cursorDot.style.transform = 'scale(1)';
        }

        requestAnimationFrame(animateCursor);
      };

      // Add event listeners
      window.addEventListener('mousemove', updatePosition);
      
      // Start animation
      const animationFrame = requestAnimationFrame(animateCursor);

      // Hide default cursor
      document.documentElement.style.cursor = 'none';

      // Clean up
      return () => {
        window.removeEventListener('mousemove', updatePosition);
        document.body.removeChild(cursorDot);
        document.body.removeChild(cursorOutline);
        document.documentElement.style.cursor = 'auto';
        cancelAnimationFrame(animationFrame);
      };
    } catch (error) {
      console.error("Error initializing custom cursor:", error);
      // Ensure default cursor is visible if custom cursor fails
      document.documentElement.style.cursor = 'auto';
    }
  }, []);
}; 