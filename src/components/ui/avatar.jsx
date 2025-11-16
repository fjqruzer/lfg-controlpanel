import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserCircleIcon } from '@heroicons/react/24/outline';

// Avatar component matching Material Tailwind's Avatar
const Avatar = ({ 
  variant = "circular", 
  size = "md",
  className = "",
  src,
  alt,
  ...props 
}) => {
  const [imgError, setImgError] = useState(false);
  
  const variants = {
    circular: "rounded-full",
    rounded: "rounded-lg",
    square: "rounded-none"
  };

  const sizes = {
    xs: "h-6 w-6 text-xs",
    sm: "h-9 w-9 text-sm", 
    md: "h-10 w-10 text-base",
    lg: "h-11 w-11 text-lg",
    xl: "h-12 w-12 text-xl",
    xxl: "h-16 w-16 text-2xl"
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // If image fails to load, show fallback
  if (imgError || !src) {
    return (
      <div 
        className={cn(
          "relative inline-flex items-center justify-center bg-blue-gray-100 text-blue-gray-600 font-semibold",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <span className="text-xs">{getInitials(alt)}</span>
        ) : (
          <UserCircleIcon className={cn(sizes[size])} />
        )}
      </div>
    );
  }

  return (
    <img
      className={cn(
        "relative inline-block object-cover object-center",
        variants[variant],
        sizes[size],
        className
      )}
      src={src}
      alt={alt}
      onError={() => setImgError(true)}
      {...props}
    />
  );
};

export default Avatar;