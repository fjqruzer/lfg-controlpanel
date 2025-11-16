import React from 'react';
import { cn } from '@/lib/utils';

// Progress component matching Material Tailwind's Progress
const Progress = ({ 
  variant = "filled", 
  color = "blue", 
  size = "md",
  value = 0,
  className = "", 
  ...props 
}) => {
  const sizes = {
    sm: "h-1.5",
    md: "h-2.5", 
    lg: "h-3.5"
  };

  const colors = {
    "blue-gray": "bg-blue-gray-500",
    gray: "bg-gray-500",
    brown: "bg-brown-500",
    "deep-orange": "bg-deep-orange-500",
    orange: "bg-orange-500",
    amber: "bg-amber-500",
    yellow: "bg-yellow-500",
    lime: "bg-lime-500",
    "light-green": "bg-light-green-500",
    green: "bg-green-500",
    teal: "bg-teal-500",
    cyan: "bg-cyan-500",
    "light-blue": "bg-light-blue-500",
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    "deep-purple": "bg-deep-purple-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    red: "bg-red-500",
  };

  const gradientColors = {
    "blue-gray": "from-blue-gray-600 to-blue-gray-400",
    gray: "from-gray-600 to-gray-400",
    brown: "from-brown-600 to-brown-400",
    "deep-orange": "from-deep-orange-600 to-deep-orange-400",
    orange: "from-orange-600 to-orange-400",
    amber: "from-amber-600 to-amber-400",
    yellow: "from-yellow-600 to-yellow-400",
    lime: "from-lime-600 to-lime-400",
    "light-green": "from-light-green-600 to-light-green-400",
    green: "from-green-600 to-green-400",
    teal: "from-teal-600 to-teal-400",
    cyan: "from-cyan-600 to-cyan-400",
    "light-blue": "from-light-blue-600 to-light-blue-400",
    blue: "from-blue-600 to-blue-400",
    indigo: "from-indigo-600 to-indigo-400",
    "deep-purple": "from-deep-purple-600 to-deep-purple-400",
    purple: "from-purple-600 to-purple-400",
    pink: "from-pink-600 to-pink-400",
    red: "from-red-600 to-red-400",
  };

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden rounded-full bg-blue-gray-50 font-sans text-xs font-medium",
        sizes[size],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex h-full items-center justify-center overflow-hidden rounded-full text-white transition-all duration-300",
          variant === "gradient" ? `bg-gradient-to-tr ${gradientColors[color]}` : colors[color],
        )}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
};

export default Progress;