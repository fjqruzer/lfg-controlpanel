import React from 'react';
import { cn } from '@/lib/utils';

// Card component matching Material Tailwind's Card
const Card = ({ 
  variant = "filled", 
  shadow = false,
  className = "",
  children,
  ...props 
}) => {
  const variants = {
    filled: "bg-white",
    gradient: "bg-gradient-to-tr from-gray-900 to-gray-800 text-white"
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl bg-clip-border text-gray-700",
        variants[variant],
        shadow ? "shadow-sm" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// CardHeader component
const CardHeader = ({ 
  variant = "filled", 
  color = "white",
  shadow = true,
  floated = true,
  className = "",
  children,
  ...restProps 
}) => {
  // Explicitly filter out any component-specific props that might sneak through
  const { 
    variant: _v, 
    color: _c, 
    shadow: _s, 
    floated: _f, 
    ...domProps 
  } = restProps;
  const variants = {
    filled: "bg-white",
    gradient: "bg-gradient-to-tr text-white"
  };

  const colors = {
    transparent: "bg-transparent",
    white: "from-white to-gray-50",
    "blue-gray": "from-blue-gray-100 to-blue-gray-50",
    gray: "from-gray-100 to-gray-50",
    brown: "from-brown-100 to-brown-50",
    "deep-orange": "from-orange-100 to-orange-50",
    orange: "from-orange-100 to-orange-50",
    amber: "from-amber-100 to-amber-50",
    yellow: "from-yellow-100 to-yellow-50",
    lime: "from-lime-100 to-lime-50",
    "light-green": "from-green-100 to-green-50",
    green: "from-green-100 to-green-50",
    teal: "from-teal-100 to-teal-50",
    cyan: "from-cyan-100 to-cyan-50",
    "light-blue": "from-blue-100 to-blue-50",
    blue: "from-blue-100 to-blue-50",
    indigo: "from-indigo-100 to-indigo-50",
    "deep-purple": "from-purple-100 to-purple-50",
    purple: "from-purple-100 to-purple-50",
    pink: "from-pink-100 to-pink-50",
    red: "from-red-100 to-red-50",
  };

  return (
    <div
      className={cn(
        "relative mx-4 rounded-xl overflow-hidden bg-clip-border shadow-lg",
        variant === "gradient" && color === "white" ? "bg-white text-blue-gray-900" : 
        variant === "gradient" ? `bg-gradient-to-tr ${colors[color]} text-blue-gray-900` : 
        variants[variant],
        shadow ? "shadow-lg" : "",
        floated ? "-mt-6" : "mt-0",
        className
      )}
      {...domProps}
    >
      {children}
    </div>
  );
};

// CardBody component  
const CardBody = ({ 
  className = "",
  children,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "relative p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// CardFooter component
const CardFooter = ({ 
  divider = false,
  className = "",
  children,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "relative p-6 pt-0",
        divider ? "border-t border-t-blue-gray-100" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
export { Card, CardHeader, CardBody, CardFooter };