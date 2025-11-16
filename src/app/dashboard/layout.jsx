'use client';

import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@/components/ui";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
  RightSidenav,
} from "@/components/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, miniSidenav } = controller;
  const pathname = usePathname();
  const segments = pathname.split("/").filter((el) => el !== "");
  const [layoutSeg, sectionSeg] = [segments[0], segments[1]];
  const isHome = layoutSeg === "dashboard" && sectionSeg === "home";

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg="/img/lfg-logo.png"
      />
      <div className={`p-4 ${miniSidenav ? "xl:ml-24" : "xl:ml-60"} transition-all duration-300 ease-in-out`}>
        <DashboardNavbar />
        <Configurator />
        {isHome ? (
          <div className="xl:flex xl:items-start xl:gap-4">
            <div className="flex-1 min-w-0">{children}</div>
            <RightSidenav />
          </div>
        ) : (
          children
        )}
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
      
      {/* Fixed Settings Button */}
      <button
        onClick={() => setOpenConfigurator(dispatch, !controller.openConfigurator)}
        className="!fixed bottom-8 right-8 z-[999] h-12 w-12 rounded-full bg-white text-blue-gray-900 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        aria-label="Toggle settings"
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

