import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Typography,
  Button,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@/components/ui";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const pathname = usePathname();
  const segments = pathname.split("/").filter((el) => el !== "");
  const [layout, section, slug] = [segments[0], segments[1], segments[2]];
  const [venueName, setVenueName] = React.useState("");

  React.useEffect(() => {
    if (layout === "dashboard" && section === "venues" && slug) {
      try {
        const raw = localStorage.getItem("lfg.venues");
        if (raw) {
          const list = JSON.parse(raw);
          const found = Array.isArray(list) ? list.find((v) => v.slug === slug) : null;
          setVenueName(found?.name || slug);
        } else {
          setVenueName(slug);
        }
      } catch {
        setVenueName(slug);
      }
    } else {
      setVenueName("");
    }
  }, [layout, section, slug]);

  return (
    <nav
      className={`w-full rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 bg-white/80 backdrop-blur-2xl backdrop-saturate-200 py-3 px-6 shadow-md shadow-blue-gray-500/5"
          : "bg-transparent px-0 py-1"
      }`}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <nav
            className={`flex bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""}`}
            aria-label="breadcrumb"
          >
            <ol className="flex flex-wrap items-center">
              <li className="flex items-center">
                <Link href={layout === "dashboard" ? "/dashboard/home" : `/${layout}`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
                  >
                    {layout}
                  </Typography>
                </Link>
                {section && <span className="mx-2 text-blue-gray-500 text-sm">/</span>}
              </li>
              {section && (
                slug ? (
                  <>
                    <li className="flex items-center">
                      <Link href={`/${layout}/${section}`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
                        >
                          {section}
                        </Typography>
                      </Link>
                      <span className="mx-2 text-blue-gray-500 text-sm">/</span>
                    </li>
                    <li className="flex items-center">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {venueName || slug}
                      </Typography>
                    </li>
                  </>
                ) : (
                  <li className="flex items-center">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {section}
                    </Typography>
                  </li>
                )
              )}
            </ol>
          </nav>
          <Typography variant="h6" color="blue-gray">
            {slug ? (venueName || slug) : (section || layout)}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <Link href="/auth/sign-in">
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case text-black hover:bg-blue-gray-50"
            >
              <UserCircleIcon className="h-5 w-5" />
              Sign In
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden hover:bg-blue-gray-50"
            >
              <UserCircleIcon className="h-5 w-5 text-black" />
            </IconButton>
          </Link>
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton variant="text" color="blue-gray" className="hover:bg-blue-gray-50">
                <BellIcon className="h-5 w-5 text-black" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            className="hover:bg-blue-gray-50"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-black" />
          </IconButton>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
