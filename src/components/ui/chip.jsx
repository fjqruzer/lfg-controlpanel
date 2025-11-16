import React from 'react';
import { cn } from '@/lib/utils';

const Chip = ({
  variant = "filled",
  color = "gray",
  size = "md",
  value,
  className = "",
  onClick,
  ...props
}) => {
  const variants = {
    filled: {
      gray: "bg-gray-900 text-white",
      green: "bg-green-500 text-white",
      red: "bg-red-500 text-white",
      blue: "bg-blue-500 text-white",
      "blue-gray": "bg-blue-gray-500 text-white",
    },
    gradient: {
      gray: "bg-gradient-to-tr from-gray-900 to-gray-800 text-white",
      green: "bg-gradient-to-tr from-green-600 to-green-400 text-white",
      red: "bg-gradient-to-tr from-red-600 to-red-400 text-white",
      blue: "bg-gradient-to-tr from-blue-600 to-blue-400 text-white",
      "blue-gray": "bg-gradient-to-tr from-blue-gray-600 to-blue-gray-400 text-white",
    },
    outlined: {
      gray: "border border-gray-500 text-gray-700",
      green: "border border-green-500 text-green-700",
      red: "border border-red-500 text-red-700",
      blue: "border border-blue-500 text-blue-700",
      "blue-gray": "border border-blue-gray-500 text-blue-gray-700",
    },
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-md",
        "select-none whitespace-nowrap",
        variants[variant]?.[color] || variants.filled.gray,
        sizes[size],
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {value}
    </span>
  );
};

export { Chip };
