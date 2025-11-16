import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Tooltip component matching Material Tailwind's Tooltip
const Tooltip = ({ 
  content,
  placement = "top",
  className = "",
  children,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const placements = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1",
    "top-start": "bottom-full left-0 mb-1",
    "top-end": "bottom-full right-0 mb-1",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1",
    "bottom-start": "top-full left-0 mt-1",
    "bottom-end": "top-full right-0 mt-1",
    left: "right-full top-1/2 -translate-y-1/2 mr-1",
    right: "left-full top-1/2 -translate-y-1/2 ml-1"
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 whitespace-normal break-words rounded-lg bg-black py-1.5 px-3 font-sans text-sm font-normal text-white focus:outline-none",
            placements[placement],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;