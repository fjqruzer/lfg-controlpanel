import React from "react";

export const MaterialTailwind = React.createContext(null);

export function reducer(state, action) {
  switch (action.type) {
    case "OPEN_SIDENAV": {
      return { ...state, openSidenav: action.value };
    }
    case "SIDENAV_TYPE": {
      return { ...state, sidenavType: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "MINI_SIDENAV": {
      return { ...state, miniSidenav: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function MaterialTailwindControllerProvider({ children }) {
  // Default state with miniSidenav collapsed
  const initialState = {
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
    miniSidenav: true, // Default to collapsed
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);
  const [isHydrated, setIsHydrated] = React.useState(false);
  
  // Load saved state from localStorage after hydration
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-settings');
      if (saved) {
        try {
          const savedState = JSON.parse(saved);
          // Apply saved state
          Object.keys(savedState).forEach(key => {
            if (savedState[key] !== initialState[key]) {
              switch (key) {
                case 'openSidenav':
                  setOpenSidenav(dispatch, savedState[key]);
                  break;
                case 'sidenavColor':
                  setSidenavColor(dispatch, savedState[key]);
                  break;
                case 'sidenavType':
                  setSidenavType(dispatch, savedState[key]);
                  break;
                case 'transparentNavbar':
                  setTransparentNavbar(dispatch, savedState[key]);
                  break;
                case 'fixedNavbar':
                  setFixedNavbar(dispatch, savedState[key]);
                  break;
                case 'openConfigurator':
                  setOpenConfigurator(dispatch, savedState[key]);
                  break;
                case 'miniSidenav':
                  setMiniSidenav(dispatch, savedState[key]);
                  break;
              }
            }
          });
        } catch (e) {
          console.error('Failed to parse saved settings:', e);
        }
      }
      setIsHydrated(true);
    }
  }, []);
  
  // Save state to localStorage whenever it changes (only after hydration)
  React.useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('dashboard-settings', JSON.stringify(controller));
    }
  }, [controller, isHydrated]);

  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

export function useMaterialTailwindController() {
  const context = React.useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

export const setOpenSidenav = (dispatch, value) =>
  dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch, value) =>
  dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
export const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
export const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
export const setMiniSidenav = (dispatch, value) =>
  dispatch({ type: "MINI_SIDENAV", value });
