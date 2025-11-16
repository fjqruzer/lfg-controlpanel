import React from "react";

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false, 
  color = 'gray',
  className = '',
  size = 'md',
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const colorStyles = {
    gray: checked ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-300 hover:border-gray-400',
    blue: checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 hover:border-blue-400',
    green: checked ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300 hover:border-green-400',
    red: checked ? 'bg-red-600 border-red-600' : 'bg-white border-gray-300 hover:border-red-400',
  };

  return (
    <label className={`inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div className={`
        ${sizeStyles[size]}
        border-2 rounded transition-all duration-200 flex items-center justify-center
        ${colorStyles[color]}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </label>
  );
};

export default Checkbox;