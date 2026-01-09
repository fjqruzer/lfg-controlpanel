import React from "react";
import { Card, CardBody } from "@/components/ui";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useMaterialTailwindController } from "@/context";
import { CalendarCard } from "@/components/ui/calendar-card";
import { RecentActivity } from "@/components/pages/dashboard/recent-activity";

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

      {/* Recent Activity below - using smart component */}
      <div className="mt-4">
        <RecentActivity limit={15} showHeader={true} />
      </div>
      
    </aside>
  );
}


export default RightSidenav;

