"use client";

import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Dialog,
  DialogBody,
  Tooltip,
} from "@/components/ui";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import {
  ArrowsPointingOutIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function StatisticsChart({ chart, title, description, footer, onRefresh, height = 300, cardHeight = 420 }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timeRange, setTimeRange] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Handle export
  const handleExport = (format) => {
    if (typeof window !== "undefined" && window.ApexCharts) {
      const chartId = chart.options.chart?.id || "chart";
      const chartInstance = window.ApexCharts.getChartByID(chartId);
      if (chartInstance) {
        if (format === "png" || format === "svg") {
          chartInstance.dataURI().then(({ imgURI }) => {
            const link = document.createElement("a");
            link.href = imgURI;
            link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.${format}`;
            link.click();
          });
        } else if (format === "csv") {
          // Export as CSV
          const data = chart.series;
          let csv = "Category,Value\n";
          data.forEach((series) => {
            series.data.forEach((value, index) => {
              const category = chart.options.xaxis?.categories?.[index] || index;
              csv += `${category},${value}\n`;
            });
          });
          const blob = new Blob([csv], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.csv`;
          link.click();
        }
      }
    }
  };

  // Dynamic chart configuration based on time range
  const dynamicChart = useMemo(() => {
    let filteredData = { ...chart };
    
    // Filter data based on time range
    if (timeRange !== "all" && Array.isArray(chart.series) && chart.series[0]?.data) {
      const dataLength = chart.series[0].data.length;
      let sliceAmount = dataLength;
      
      if (timeRange === "7d") sliceAmount = 7;
      else if (timeRange === "30d") sliceAmount = 30;
      else if (timeRange === "90d") sliceAmount = 90;
      
      filteredData = {
        ...chart,
        series: chart.series.map(s => ({
          ...s,
          data: s.data.slice(-sliceAmount)
        })),
        options: {
          ...chart.options,
          xaxis: {
            ...chart.options.xaxis,
            categories: chart.options.xaxis?.categories?.slice(-sliceAmount) || []
          }
        }
      };
    }

    return filteredData;
  }, [chart, timeRange]);

  const ChartContent = ({ isFullScreenMode = false }) => (
    <div className={isFullScreenMode ? "flex flex-col h-full" : "flex flex-col h-full"}>
      <div className={isFullScreenMode ? "flex items-start justify-between mb-4" : "flex items-start justify-between mb-3"}>
        <div className="flex-1">
          <Typography 
            variant={isFullScreenMode ? "h2" : "h6"} 
            color="blue-gray" 
            className={isFullScreenMode ? "mb-2" : "mb-1"}
          >
            {title}
          </Typography>
          <Typography 
            variant={isFullScreenMode ? "lead" : "small"}
            className={isFullScreenMode ? "font-normal text-blue-gray-600 text-base" : "font-normal text-blue-gray-600 text-xs"}
          >
            {description}
          </Typography>
          
        </div>
        
        <div className="flex items-center gap-1">
        
          <Tooltip content="Refresh Data">
            <IconButton
              size={isFullScreenMode ? "md" : "sm"}
              variant="text"
              color="blue-gray"
              onClick={handleRefresh}
              className={isRefreshing ? "animate-spin" : ""}
            >
              <ArrowPathIcon className={isFullScreenMode ? "h-5 w-5" : "h-4 w-4"} />
            </IconButton>
          </Tooltip>

          {/* Full Screen Toggle / Close */}
          {!isFullScreenMode ? (
            <Tooltip content="Full Screen">
              <IconButton
                size="sm"
                variant="text"
                color="blue-gray"
                onClick={() => setIsFullScreen(true)}
              >
                <ArrowsPointingOutIcon className="h-4 w-4" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip content="Close Full Screen">
              <IconButton
                size="md"
                variant="filled"
                color="gray"
                onClick={() => setIsFullScreen(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </IconButton>
            </Tooltip>
          )}

          {/* Options Menu */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton size={isFullScreenMode ? "md" : "sm"} variant="text" color="blue-gray">
                <EllipsisVerticalIcon className={isFullScreenMode ? "h-5 w-5" : "h-4 w-4"} />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem className="text-xs font-medium text-blue-gray-700" disabled>
                Export As
              </MenuItem>
              <MenuItem 
                className="text-xs flex items-center gap-2"
                onClick={() => handleExport("png")}
              >
                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                Download PNG
              </MenuItem>
              <MenuItem 
                className="text-xs flex items-center gap-2"
                onClick={() => handleExport("svg")}
              >
                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                Download SVG
              </MenuItem>
              <MenuItem 
                className="text-xs flex items-center gap-2"
                onClick={() => handleExport("csv")}
              >
                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                Export CSV
              </MenuItem>
              
            </MenuList>
          </Menu>
        </div>
      </div>

      {/* Time Range Filter (only for charts with time-series data) */}
      {chart.type !== "pie" && chart.series[0]?.data?.length > 7 && (
        <div className={isFullScreenMode ? "flex gap-3 mb-4 flex-wrap" : "flex gap-2 mb-3 flex-wrap"}>
          {[
            { label: "7 Days", value: "7d" },
            { label: "30 Days", value: "30d" },
            { label: "90 Days", value: "90d" },
            { label: "All Time", value: "all" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`${isFullScreenMode ? "px-6 py-2 text-sm font-medium" : "px-3 py-1 text-xs"} rounded-md transition-colors ${
                timeRange === range.value
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      <div className={isFullScreenMode ? "w-full overflow-hidden flex-1" : "w-full overflow-hidden flex-1"}>
        <Chart 
          {...dynamicChart} 
          height={isFullScreenMode ? "100%" : "100%"}
          width="100%"
        />
      </div>
      
      {footer && (
          <div className={isFullScreenMode ? "mt-4 text-sm text-blue-gray-600" : "mt-3 text-xs text-blue-gray-600"}>
            {footer}
          </div>
      )}
    </div>
  );

  return (
    <>
      <Card className="border border-blue-gray-50 w-full flex flex-col" style={{ height: cardHeight }}>
        <CardBody className="p-4 w-full flex flex-col overflow-visible h-full">
          <ChartContent />
        </CardBody>
      </Card>

      {/* Full Screen Dialog */}
      <Dialog 
        open={isFullScreen} 
        handler={() => setIsFullScreen(false)}
        size="xxl"
        className="bg-white !max-w-[90vw] w-[90vw] !h-[90vh]"
      >
        <DialogBody className="overflow-visible p-6 h-full">
          <ChartContent isFullScreenMode={true} />
        </DialogBody>
      </Dialog>
    </>
  );
}

export default StatisticsChart;
