import * as React from "react";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef(({ className, id, value, checked: checkedProp, onChange, ...props }, ref) => {
  const [checked, setChecked] = React.useState(checkedProp ?? value ?? false);

  React.useEffect(() => {
    setChecked(checkedProp ?? value ?? false);
  }, [checkedProp, value]);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
        checked ? "bg-gray-900" : "bg-gray-200",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
});

Switch.displayName = "Switch";

export default Switch;
