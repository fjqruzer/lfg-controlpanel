import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, Typography, Switch } from "@/components/ui";
import { useMaterialTailwindController, setOpenConfigurator, setSidenavColor, setSidenavType, setFixedNavbar } from "@/context";

// Removed number formatting and GitHub stars logic (not needed)

export function Configurator() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openConfigurator, sidenavColor, sidenavType, fixedNavbar } =
    controller;

  const sidenavColors = {
    white: "from-gray-100 to-gray-100 border-gray-200",
    dark: "from-black to-black border-gray-200",
  };

  return (
    <aside
      className="fixed top-0 right-0 z-50 h-screen w-96 bg-white shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto"
      style={{
        transform: openConfigurator ? 'translateX(0)' : 'translateX(100%)'
      }}
    >
      <div className="flex items-start justify-between px-6 pt-8 pb-6 border-b border-blue-gray-50">
        <div>
          <Typography variant="h5" color="blue-gray">
            Dashboard Configurator
          </Typography>
          <Typography className="font-normal text-blue-gray-600 text-sm">
            See our dashboard options.
          </Typography>
        </div>
        <button
          onClick={() => setOpenConfigurator(dispatch, false)}
          className="h-8 w-8 flex items-center justify-center text-blue-gray-500 hover:bg-blue-gray-50 rounded-lg transition-colors"
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5" />
        </button>
      </div>
      <div className="py-6 px-6">
        <div className="mb-8">
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Sidenav Colors
          </Typography>
          <div className="flex items-center gap-3">
            {Object.keys(sidenavColors).map((color) => (
              <span
                key={color}
                className={`h-8 w-8 cursor-pointer rounded-full border-2 bg-gradient-to-br transition-all hover:scale-110 ${
                  sidenavColors[color]
                } ${
                  sidenavColor === color ? "border-black scale-110" : "border-transparent"
                }`}
                onClick={() => setSidenavColor(dispatch, color)}
              />
            ))}
          </div>
        </div>
        <div className="mb-8">
          <Typography variant="h6" color="blue-gray" className="mb-1">
            Sidenav Types
          </Typography>
          <Typography variant="small" color="gray" className="mb-3">
            Choose between different sidenav types.
          </Typography>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSidenavType(dispatch, "dark")}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors border"
              style={{
                backgroundColor: sidenavType === "dark" ? "#2563eb" : "transparent",
                color: sidenavType === "dark" ? "white" : "#64748b",
                borderColor: sidenavType === "dark" ? "#2563eb" : "#cbd5e1"
              }}
            >
              Dark
            </button>
            <button
              onClick={() => setSidenavType(dispatch, "transparent")}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors border"
              style={{
                backgroundColor: sidenavType === "transparent" ? "#2563eb" : "transparent",
                color: sidenavType === "transparent" ? "white" : "#64748b",
                borderColor: sidenavType === "transparent" ? "#2563eb" : "#cbd5e1"
              }}
            >
              Transparent
            </button>
            <button
              onClick={() => setSidenavType(dispatch, "white")}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors border"
              style={{
                backgroundColor: sidenavType === "white" ? "#2563eb" : "transparent",
                color: sidenavType === "white" ? "white" : "#64748b",
                borderColor: sidenavType === "white" ? "#2563eb" : "#cbd5e1"
              }}
            >
              White
            </button>
          </div>
        </div>
        <div className="pt-4 border-t border-blue-gray-50">
          <div className="flex items-center justify-between py-3">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Navbar Fixed
              </Typography>
              <Typography variant="small" color="gray">
                Keep navbar at top when scrolling
              </Typography>
            </div>
            <Switch
              id="navbar-fixed"
              checked={fixedNavbar}
              onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Configurator;
