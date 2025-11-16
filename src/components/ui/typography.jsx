import React from 'react';
import { cn } from '@/lib/utils';

// Typography component matching Material Tailwind's Typography
const Typography = ({ 
  variant = "paragraph", 
  color = "inherit", 
  className = "", 
  as,
  children, 
  ...props 
}) => {
  const variants = {
    h1: "text-5xl font-semibold leading-tight tracking-normal",
    h2: "text-4xl font-semibold leading-[1.3] tracking-normal",  
    h3: "text-3xl font-semibold leading-snug tracking-normal",
    h4: "text-2xl font-semibold leading-snug tracking-normal",
    h5: "text-xl font-semibold leading-snug tracking-normal",
    h6: "text-base font-semibold leading-relaxed tracking-normal",
    lead: "text-xl font-normal leading-relaxed",
    paragraph: "text-base font-normal leading-relaxed",
    small: "text-sm font-normal leading-normal"
  };

  const colors = {
    inherit: "",
    current: "text-current",
    black: "text-black",
    white: "text-white",
    "blue-gray": "text-blue-gray-900",
    gray: "text-gray-700",
    brown: "text-brown-500",
    "deep-orange": "text-deep-orange-500",
    orange: "text-orange-500",
    amber: "text-amber-500",
    yellow: "text-yellow-500",
    lime: "text-lime-500",
    "light-green": "text-light-green-500",
    green: "text-green-500",
    teal: "text-teal-500",
    cyan: "text-cyan-500",
    "light-blue": "text-light-blue-500",
    blue: "text-blue-500",
    indigo: "text-indigo-500",
    "deep-purple": "text-deep-purple-500",
    purple: "text-purple-500",
    pink: "text-pink-500",
    red: "text-red-500"
  };

  const Component = as || (variant.startsWith('h') ? variant : 'p');

  return (
    <Component
      className={cn(
        variants[variant],
        colors[color],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;