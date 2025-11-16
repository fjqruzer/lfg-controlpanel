import { Typography } from "@/components/ui";
import { ClockIcon } from "@heroicons/react/24/solid";

export function ChartFooter({ children, footerText }) {
  if (children) {
    return children;
  }

  return (
    <Typography
      variant="small"
      className="flex items-center font-normal text-blue-gray-600"
    >
      <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
      &nbsp;{footerText}
    </Typography>
  );
}

export default ChartFooter;