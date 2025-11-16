import React from "react";
import { Typography, Card, CardBody, Avatar, IconButton } from "@/components/ui";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { lfgActivityData } from "@/data";
import { useMaterialTailwindController } from "@/context";
import { CalendarCard } from "@/components/ui/calendar-card";

export function RightSidenav() {
  const [controller] = useMaterialTailwindController();
  const { fixedNavbar } = controller;
  const topClass = fixedNavbar ? "xl:top-24" : "xl:top-4";
  return (
    <aside className={`hidden xl:block xl:sticky ${topClass} w-72 mt-8`}>
      {/* Compact Calendar first */}
      <Card className="border border-blue-gray-50">
        <CardBody className="p-4">
          <CalendarCard />
        </CardBody>
      </Card>

      {/* Recent Activity below */}
      <Card className="mt-4 border border-blue-gray-50 flex flex-col max-h-[400px]">
        <CardBody className="p-6 flex flex-col overflow-hidden">
          <div className="mb-6 flex-shrink-0">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Recent Activity
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>Live</strong> updates
            </Typography>
          </div>
          <div className="overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-blue-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-blue-gray-300">
            {lfgActivityData.map(({ id, icon, color, title, description }, key) => (
              <div key={id} className={`flex items-start gap-4 py-3 first:pt-0 ${key === lfgActivityData.length - 1 ? 'pb-0' : ''}`}>
                <div
                  className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                    key === lfgActivityData.length - 1 ? 'after:h-0' : 'after:h-4/6'
                  }`}
                >
                  {React.createElement(icon, {
                    className: `!w-5 !h-5 ${color}`,
                  })}
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block font-medium"
                  >
                    {title}
                  </Typography>
                  <Typography
                    as="span"
                    variant="small"
                    className="text-xs font-medium text-blue-gray-500"
                  >
                    {description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
      
    </aside>
  );
}


export default RightSidenav;

