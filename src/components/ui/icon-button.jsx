import React from 'react';
import { cn } from '@/lib/utils';

// IconButton component matching Material Tailwind's IconButton
const IconButton = ({ 
  variant = "filled", 
  size = "md",
  color = "blue",
  className = "",
  children,
  ...props 
}) => {
  const variants = {
    filled: "shadow-md hover:shadow-lg",
    gradient: "shadow-md hover:shadow-lg",
    outlined: "border bg-transparent hover:bg-opacity-10",
    text: "shadow-none hover:shadow-none bg-transparent"
  };

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm", 
    lg: "h-12 w-12 text-base"
  };

  const filledColors = {
    "blue-gray": "bg-blue-gray-500 text-white",
    gray: "bg-gray-500 text-white",
    black: "bg-gray-900 text-white",
    brown: "bg-brown-500 text-white",
    "deep-orange": "bg-deep-orange-500 text-white",
    orange: "bg-orange-500 text-white",
    amber: "bg-amber-500 text-white",
    yellow: "bg-yellow-500 text-white",
    lime: "bg-lime-500 text-white",
    "light-green": "bg-light-green-500 text-white",
    green: "bg-green-500 text-white",
    teal: "bg-teal-500 text-white",
    cyan: "bg-cyan-500 text-white",
    "light-blue": "bg-light-blue-500 text-white",
    blue: "bg-blue-500 text-white",
    indigo: "bg-indigo-500 text-white",
    "deep-purple": "bg-deep-purple-500 text-white",
    purple: "bg-purple-500 text-white",
    pink: "bg-pink-500 text-white",
    red: "bg-red-500 text-white",
    white: "bg-white text-blue-gray-900"
  };

  const gradientColors = {
    black: "bg-gradient-to-tr from-gray-900 to-gray-800 text-white",
    blue: "bg-gradient-to-tr from-blue-600 to-blue-400 text-white",
    gray: "bg-gradient-to-tr from-gray-600 to-gray-400 text-white",
  };

  const outlinedColors = {
    black: "border-gray-900 text-gray-900 hover:bg-gray-900",
    blue: "border-blue-500 text-blue-500 hover:bg-blue-500",
    gray: "border-gray-500 text-gray-500 hover:bg-gray-500",
  };

  const getColorClass = () => {
    if (variant === "gradient") return gradientColors[color] || gradientColors.black;
    if (variant === "outlined") return outlinedColors[color] || outlinedColors.black;
    if (variant === "text") return "";
    return filledColors[color] || filledColors.blue;
  };

  return (
    <button
      className={cn(
        "relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none rounded-lg",
        sizes[size],
        getColorClass(),
        variants[variant],
        className
      )}
      type="button"
      {...props}
    >
      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        {children}
      </span>
    </button>
  );
};

export default IconButton;