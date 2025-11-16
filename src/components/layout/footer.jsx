import PropTypes from "prop-types";
import { Typography } from "@/components/ui";
import { HeartIcon } from "@heroicons/react/24/solid";

export function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-between px-2">
        <Typography variant="small" className="text-xs font-normal text-inherit">
          &copy; {year} {brandName} • All rights reserved
        </Typography>
        <Typography variant="small" className="text-xs font-normal text-inherit">
          Made with ❤️ by Biryani Boys
        </Typography>
        {routes && routes.length > 0 && (
          <ul className="flex items-center gap-4">
            {routes.map(({ name, path }) => (
              <li key={name}>
                <Typography
                  as="a"
                  href={path}
                  target="_blank"
                  variant="small"
                  className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
                >
                  {name}
                </Typography>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandName: "Looking for Games",
  brandLink: "#",
  routes: [],
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
