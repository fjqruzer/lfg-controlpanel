import React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          placeholder={label}
          className={cn(
            "w-full rounded-md border border-blue-gray-200 bg-white px-3 py-2 text-sm text-blue-gray-700 outline-none transition-all",
            "placeholder:text-blue-gray-400",
            "focus:border-gray-900 focus:outline-none",
            "disabled:border-blue-gray-100 disabled:bg-blue-gray-50",
            "min-h-[80px] resize-y",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
