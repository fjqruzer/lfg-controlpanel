import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { Alert, IconButton } from "@/components/ui";
import { XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

const NotificationsContext = createContext({ notify: () => {} });

export function NotificationsProvider({ children, position = "top-right" }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback(
    (
      message,
      {
        color = "green",
        timeout = 3000,
        icon = null, // true to use default info icon, or pass a React node
        variant = "filled", // 'filled' | 'gradient' per template options
      } = {}
    ) => {
      const id = Date.now() + Math.random();
      setToasts((arr) => [
        ...arr,
        {
          id,
          message,
          color,
          icon,
          variant,
        },
      ]);
      if (timeout > 0) {
        setTimeout(() => {
          setToasts((arr) => arr.filter((t) => t.id !== id));
        }, timeout);
      }
    },
    []
  );

  const close = useCallback((id) => setToasts((arr) => arr.filter((t) => t.id !== id)), []);

  const value = useMemo(() => ({ notify }), [notify]);

  const positionClasses = useMemo(() => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-right":
      default:
        return "top-4 right-4";
    }
  }, [position]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <div className={`pointer-events-none fixed z-[9999] ${positionClasses} flex w-full max-w-sm flex-col gap-2`}>
        {toasts.map((t) => (
          <Alert
            key={t.id}
            color={t.color}
            variant={t.variant}
            className="pointer-events-auto rounded-lg shadow-md p-3 flex items-center justify-between gap-3"
            icon={t.icon === true ? <InformationCircleIcon className="h-5 w-5" /> : t.icon || undefined}
            action={
              <IconButton
                variant="text"
                color="white"
                size="sm"
                className="ml-2"
                onClick={() => close(t.id)}
              >
                <XMarkIcon className="h-5 w-5" />
              </IconButton>
            }
          >
            <div className="text-sm leading-5 pr-1 flex-1">{t.message}</div>
          </Alert>
        ))}
      </div>
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}

export default NotificationsProvider;
