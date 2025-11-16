import React from 'react';
import { cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Dialog component
const Dialog = ({ open, handler, size = "md", children, className = "", ...props }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const sizes = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    xxl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={handler}
      />
      
      {/* Dialog */}
      <div
        className={cn(
          "relative w-full bg-white rounded-lg shadow-xl",
          "m-4",
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

// DialogHeader component
const DialogHeader = ({ children, className = "", ...props }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b border-blue-gray-50",
        className
      )}
      {...props}
    >
      <h5 className="text-xl font-medium text-blue-gray-900">
        {children}
      </h5>
    </div>
  );
};

// DialogBody component
const DialogBody = ({ divider = false, children, className = "", ...props }) => {
  return (
    <div
      className={cn(
        "p-4 text-blue-gray-500",
        divider && "border-t border-b border-blue-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// DialogFooter component
const DialogFooter = ({ children, className = "", ...props }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Dialog, DialogHeader, DialogBody, DialogFooter };
