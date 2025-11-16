import React from 'react';
import { cn } from '@/lib/utils';

// Tabs Context
const TabsContext = React.createContext({ value: '', onChange: () => {} });

// Tabs component
const Tabs = ({ value, onChange, children, className = "", ...props }) => {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsHeader component
const TabsHeader = ({ className = "", children, ...props }) => {
  const { value: activeValue } = React.useContext(TabsContext);
  const [indicatorStyle, setIndicatorStyle] = React.useState({});
  const tabsRef = React.useRef(null);

  React.useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.querySelector(`[data-value="${activeValue}"]`);
      if (activeTab) {
        const { offsetLeft, offsetWidth } = activeTab;
        setIndicatorStyle({
          left: offsetLeft,
          width: offsetWidth,
        });
      }
    }
  }, [activeValue]);

  return (
    <div
      ref={tabsRef}
      className={cn(
        "relative flex items-center gap-1 rounded-lg bg-gray-100 p-1",
        className
      )}
      {...props}
    >
      {/* Sliding indicator */}
      <div
        className="absolute bg-gray-900 rounded-md transition-all duration-300 ease-in-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          height: 'calc(100% - 8px)',
          top: '4px',
          zIndex: 0,
        }}
      />
      {children}
    </div>
  );
};

// Tab component
const Tab = ({ value, onClick, className = "", children, ...props }) => {
  const { value: activeValue } = React.useContext(TabsContext);
  const isActive = value === activeValue;

  return (
    <button
      type="button"
      data-value={value}
      onClick={onClick}
      className={cn(
        "relative z-10 flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 rounded-md",
        isActive
          ? "text-white"
          : "text-blue-gray-700 hover:text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// TabsBody component (optional, for tab panels)
const TabsBody = ({ className = "", children, ...props }) => {
  return (
    <div className={cn("py-4", className)} {...props}>
      {children}
    </div>
  );
};

// TabPanel component (optional)
const TabPanel = ({ value, className = "", children, ...props }) => {
  const { value: activeValue } = React.useContext(TabsContext);
  
  if (value !== activeValue) return null;

  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

export { Tabs, TabsHeader, Tab, TabsBody, TabPanel };
