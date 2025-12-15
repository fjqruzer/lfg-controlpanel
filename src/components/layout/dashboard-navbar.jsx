import React from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { getCurrentUser, logout } from "@/services/authService";
import { getUserAvatarUrl } from "@/lib/imageUrl";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/").filter((el) => el !== "");
  const [layout, section, slug] = [segments[0], segments[1], segments[2]];
  const [venueName, setVenueName] = React.useState("");
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/auth/sign-in");
  };

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
          {user ? (
            <Menu placement="bottom-end">
              <MenuHandler>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="hidden items-center gap-2 px-4 xl:flex normal-case text-black hover:bg-blue-gray-50"
                >
                  <Avatar
                    src={getUserAvatarUrl(user)}
                    alt={user.first_name || "Admin"}
                    size="xs"
                    variant="circular"
                  />
                  <span className="font-medium">
                    {user.first_name || user.email?.split('@')[0] || 'Admin'}
                  </span>
                </Button>
              </MenuHandler>
              <MenuList className="min-w-[160px]">
                <MenuItem className="flex items-center gap-2 text-blue-gray-700">
                  <UserCircleIcon className="h-4 w-4" />
                  Profile
                </MenuItem>
                <hr className="my-1 border-blue-gray-50" />
                <MenuItem 
                  className="flex items-center gap-2 text-red-500"
                  onClick={handleLogout}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link href="/auth/sign-in">
              <Button
                variant="text"
                color="blue-gray"
                className="hidden items-center gap-1 px-4 xl:flex normal-case text-black hover:bg-blue-gray-50"
              >
                <UserCircleIcon className="h-5 w-5" />
                Sign In
              </Button>
            </Link>
          )}
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden hover:bg-blue-gray-50"
            onClick={() => user ? handleLogout() : router.push('/auth/sign-in')}
          >
            {user ? (
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-black" />
            ) : (
              <UserCircleIcon className="h-5 w-5 text-black" />
            )}
          </IconButton>
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
