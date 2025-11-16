import Link from "next/link";
import { usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@/components/ui";
import { useMaterialTailwindController, setOpenSidenav, setMiniSidenav } from "@/context";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav, miniSidenav } = controller;
  const pathname = usePathname();
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] ${miniSidenav ? "w-20" : "w-56"} rounded-xl border border-blue-gray-50 xl:translate-x-0 transition-all duration-300 ease-in-out will-change-[transform,width]`}
    >
      <div
        className={`relative`}
      >
        <Link href="/" className="py-6 px-4 block">
          <div className={`flex items-center ${miniSidenav ? "justify-center" : "justify-center gap-3"}`}>
            {brandImg && (
              <img src={brandImg} alt={brandName} className={`${miniSidenav ? "h-8" : "h-10"} w-auto`} />
            )}
            {!miniSidenav && brandName && (
              <Typography
                variant="h6"
                color={sidenavType === "dark" ? "white" : "blue-gray"}
              >
                {brandName}
              </Typography>
            )}
          </div>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          className="absolute right-0 top-0 hidden rounded-br-none rounded-tl-none"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-2">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-2 flex flex-col gap-1">
            {!miniSidenav && title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.filter((p) => !p.isHidden).map(({ icon, name, path }) => {
              const href = `/${layout}${path}`;
              const isActive = pathname === href;
              return (
                <li key={name}>
                  <Link href={href}>
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className={`flex items-center ${miniSidenav ? "justify-center gap-0 px-0" : "gap-4 px-4"} capitalize`}
                      fullWidth
                    >
                      {icon}
                      {!miniSidenav && (
                        <Typography
                          color="inherit"
                          className="font-medium capitalize"
                        >
                          {name}
                        </Typography>
                      )}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setMiniSidenav(dispatch, !miniSidenav)}
        className={`absolute top-[42px] -right-3 z-50 h-8 w-8 rounded-full transition-colors duration-300 hidden xl:grid ${
          sidenavType === "dark" ? "bg-white text-blue-gray-900" : "bg-blue-gray-900 text-white"
        } shadow-md grid place-items-center border border-blue-gray-100`}
        aria-label="Toggle mini sidenav"
      >
        {miniSidenav ? (
          <ChevronDoubleRightIcon className="h-4 w-4" />
        ) : (
          <ChevronDoubleLeftIcon className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}

export default Sidenav;
