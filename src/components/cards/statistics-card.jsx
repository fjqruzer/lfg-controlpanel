import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@/components/ui";
import PropTypes from "prop-types";

export function StatisticsCard({ color, icon, title, value, footer }) {
  return (
    <Card className="border border-blue-gray-50">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white shadow-md">
              {icon}
            </div>
          </div>
          <div className="text-right">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              {title}
            </Typography>
            <Typography variant="h4" color="blue-gray">
              {value}
            </Typography>
          </div>
        </div>
        {footer && (
          <div className="pt-4">
            {footer}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
