import React from 'react';
import { cn } from '@/lib/utils';

const Alert = ({ 
  variant = "filled", 
  color = "blue",
  icon,
  className = "",
  children,
  ...props 
}) => {
  const variants = {
    filled: {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      red: "bg-red-500 text-white",
      amber: "bg-amber-500 text-white",
      gray: "bg-gray-500 text-white",
    },
    gradient: {
      blue: "bg-gradient-to-tr from-blue-600 to-blue-400 text-white",
      green: "bg-gradient-to-tr from-green-600 to-green-400 text-white",
      red: "bg-gradient-to-tr from-red-600 to-red-400 text-white",
      amber: "bg-gradient-to-tr from-amber-600 to-amber-400 text-white",
      gray: "bg-gradient-to-tr from-gray-600 to-gray-400 text-white",
    }
  };

  const colorClasses = variants[variant]?.[color] || variants.filled.blue;

  return (
    <div
      className={cn(
        "relative flex w-full px-4 py-4 text-base font-regular rounded-lg",
        colorClasses,
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mr-3 mt-0.5 flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default Alert;
export { Alert };