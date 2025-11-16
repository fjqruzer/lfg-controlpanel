import React from "react";

const Button = ({ 
  children, 
  onClick, 
  variant = 'filled', 
  color = 'gray', 
  size = 'md', 
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  // Filter out Material Tailwind specific props that shouldn't go to DOM
  ripple,
  ...props 
}) => {
  const baseStyles = 'inline-flex font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    filled: {
      gray: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500',
      blue: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      green: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      red: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      white: 'bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-500 border border-gray-300',
      dark: 'bg-gray-900 text-white hover:bg-black focus:ring-gray-500',
      'blue-gray': 'bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-500',
    },
    gradient: {
      gray: 'bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-gray-900 focus:ring-gray-500',
      blue: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 focus:ring-blue-500',
      green: 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 focus:ring-green-500',
      red: 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 focus:ring-red-500',
      white: 'bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-50 hover:to-gray-200 focus:ring-gray-500',
      dark: 'bg-gradient-to-r from-gray-800 to-black text-white hover:from-gray-900 hover:to-gray-900 focus:ring-gray-500',
      'blue-gray': 'bg-gradient-to-r from-slate-500 to-slate-700 text-white hover:from-slate-600 hover:to-slate-800 focus:ring-slate-500',
    },
    outlined: {
      gray: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
      blue: 'bg-transparent text-blue-600 border border-blue-300 hover:bg-blue-50 focus:ring-blue-500',
      green: 'bg-transparent text-green-600 border border-green-300 hover:bg-green-50 focus:ring-green-500',
      red: 'bg-transparent text-red-600 border border-red-300 hover:bg-red-50 focus:ring-red-500',
      white: 'bg-transparent text-white border border-white hover:bg-white/10 focus:ring-white',
      dark: 'bg-transparent text-gray-900 border border-gray-800 hover:bg-gray-100 focus:ring-gray-500',
      'blue-gray': 'bg-transparent text-slate-600 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500',
    },
    text: {
      gray: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      blue: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      green: 'bg-transparent text-green-600 hover:bg-green-50 focus:ring-green-500',
      red: 'bg-transparent text-red-600 hover:bg-red-50 focus:ring-red-500',
      white: 'bg-transparent text-white hover:bg-white/10 focus:ring-white',
      dark: 'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
      'blue-gray': 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500',
    }
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  // Default alignment when no custom className is provided
  const defaultAlignment = className.includes('flex') || className.includes('justify-') || className.includes('items-') 
    ? '' 
    : 'items-center justify-center';

  const colorStyles = variants[variant]?.[color] || variants[variant]?.gray || variants.filled.gray;

  const fullWidthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${colorStyles} ${sizes[size]} ${fullWidthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;