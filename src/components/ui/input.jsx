import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type = "text", label, placeholder, labelProps, containerProps, ...props }, ref) => {
  return (
    <div className="relative w-full" {...containerProps}>
      <input
        type={type}
        className={cn(
          "w-full rounded-md border border-blue-gray-200 bg-white px-3 py-2 text-sm text-blue-gray-700 outline-none transition-all placeholder:text-blue-gray-400 focus:border-gray-900 focus:outline-none disabled:border-blue-gray-100 disabled:bg-blue-gray-50",
          className
        )}
        ref={ref}
        placeholder={placeholder || label}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";

export { Input };
