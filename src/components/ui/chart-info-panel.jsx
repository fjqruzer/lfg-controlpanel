"use client";

import {
  Card,
  CardBody,
  Typography,
  IconButton,
} from "@/components/ui";
import { useState } from "react";
import {
  XMarkIcon,
  InformationCircleIcon,
  CursorArrowRaysIcon,
  ArrowsPointingOutIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export function ChartInfoPanel() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Show chart features"
      >
        <InformationCircleIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 animate-fade-in">
      <Card className="border border-blue-gray-100 shadow-xl">
        <CardBody className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-500" />
              <Typography variant="h6" color="blue-gray">
                Chart Features
              </Typography>
            </div>
            <IconButton
              size="sm"
              variant="text"
              color="blue-gray"
              onClick={() => setIsVisible(false)}
            >
              <XMarkIcon className="h-4 w-4" />
            </IconButton>
          </div>

          <Typography variant="small" className="text-blue-gray-600 mb-4">
            Interactive features available on dashboard charts:
          </Typography>

          <div className="space-y-3">
            <FeatureItem
              icon={CursorArrowRaysIcon}
              title="Zoom & Pan"
              description="Drag to select area or use toolbar buttons to zoom in/out"
            />
            <FeatureItem
              icon={ArrowsPointingOutIcon}
              title="Full Screen"
              description="Click expand icon to view chart in full screen mode"
            />
            <FeatureItem
              icon={ArrowDownTrayIcon}
              title="Export Data"
              description="Download as PNG, SVG, or export raw data as CSV"
            />
            <FeatureItem
              icon={ChartBarIcon}
              title="Chart Types"
              description="Switch between line, bar, and area chart views"
            />
            <FeatureItem
              icon={ClockIcon}
              title="Time Ranges"
              description="Filter data by 7, 30, 90 days or view all time"
            />
            <FeatureItem
              icon={ArrowPathIcon}
              title="Refresh"
              description="Update chart with latest data instantly"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-blue-gray-50">
            <Typography variant="small" className="text-xs text-blue-gray-500">
              💡 <strong>Tip:</strong> Hover over data points for detailed information and click legend items to show/hide data series.
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">
        <Icon className="h-4 w-4 text-gray-700" />
      </div>
      <div>
        <Typography variant="small" className="font-semibold text-blue-gray-800 mb-0.5">
          {title}
        </Typography>
        <Typography variant="small" className="text-xs text-blue-gray-600">
          {description}
        </Typography>
      </div>
    </div>
  );
}

export default ChartInfoPanel;

