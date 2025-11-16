import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Select component
const Select = ({ label, value, onChange, children, className = "", ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get selected option label
  const selectedChild = React.Children.toArray(children).find(
    (child) => child.props?.value === value
  );
  const selectedLabel = selectedChild?.props?.children || '';

  return (
    <div ref={selectRef} className={cn("relative w-full", className)} {...props}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full rounded-md border border-blue-gray-200 bg-white px-3 py-2.5 text-left text-sm text-blue-gray-700 outline-none transition-all",
          "focus:border-gray-900",
          "flex items-center justify-between"
        )}
      >
        <span className={cn(!value && "text-blue-gray-400")}>
          {value ? selectedLabel : label}
        </span>
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 transition-transform text-blue-gray-400",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-blue-gray-50 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            {React.Children.map(children, (child) =>
              React.cloneElement(child, {
                onClick: () => {
                  onChange?.(child.props.value);
                  setIsOpen(false);
                },
                isSelected: child.props.value === value,
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Option component
const Option = ({ value, children, onClick, isSelected, className = "", ...props }) => {
  // Filter out non-DOM props
  const { ...domProps } = props;
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer px-3 py-2 text-sm text-blue-gray-700 transition-colors hover:bg-blue-gray-50",
        isSelected && "bg-blue-gray-50 font-medium",
        className
      )}
      {...domProps}
    >
      {children}
    </div>
  );
};

export { Select, Option };
