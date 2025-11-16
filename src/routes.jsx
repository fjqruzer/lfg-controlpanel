import {
  HomeIcon,
  UserCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "venues",
        path: "/venues",
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "venue details",
        path: "/venues/:slug",
        isHidden: true,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "events",
        path: "/events",
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "event details",
        path: "/events/:slug",
        isHidden: true,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "users",
        path: "/users",
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        isHidden: true,
      },
    ],
  },
];

export default routes;
