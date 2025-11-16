import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Menu components matching Material Tailwind's Menu
const Menu = ({ 
  open, 
  handler, 
  placement = "bottom",
  children,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleOpen = () => {
    if (handler) {
      handler();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative inline-block" {...props}>
      {React.Children.map(children, (child) => {
        if (child.type === MenuHandler) {
          return React.cloneElement(child, { onClick: handleOpen });
        }
        if (child.type === MenuList) {
          return React.cloneElement(child, { 
            open: open !== undefined ? open : isOpen,
            placement
          });
        }
        return child;
      })}
    </div>
  );
};

const MenuHandler = ({ children, onClick, ...props }) => {
  return React.cloneElement(children, {
    onClick: (e) => {
      if (onClick) onClick(e);
      if (children.props.onClick) children.props.onClick(e);
    },
    ...props
  });
};

const MenuList = ({ 
  open = false, 
  placement = "bottom", 
  className = "",
  children, 
  ...props 
}) => {
  if (!open) return null;

  const placements = {
    top: "bottom-full mb-2",
    "top-start": "bottom-full mb-2 left-0",
    "top-end": "bottom-full mb-2 right-0",
    bottom: "top-full mt-2",
    "bottom-start": "top-full mt-2 left-0", 
    "bottom-end": "top-full mt-2 right-0",
    left: "right-full mr-2 top-0",
    "left-start": "right-full mr-2 top-0",
    "left-end": "right-full mr-2 bottom-0",
    right: "left-full ml-2 top-0",
    "right-start": "left-full ml-2 top-0",
    "right-end": "left-full ml-2 bottom-0"
  };

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[180px] overflow-hidden rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none",
        placements[placement],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const MenuItem = ({ 
  disabled = false,
  className = "",
  children,
  onClick,
  ...props 
}) => {
  return (
    <button
      className={cn(
        "flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900",
        disabled ? "pointer-events-none opacity-50" : "",
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export { Menu, MenuHandler, MenuList, MenuItem };