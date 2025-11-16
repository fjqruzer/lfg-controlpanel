"use client";

import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@/components/ui";
import {
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/components/cards";
import { StatisticsChart } from "@/components/charts";
import { ChartFooter } from "@/components/charts";
import {
  lfgStatisticsCardsData,
  lfgStatisticsChartsData,
  lfgSessionsTableData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export function Home() {
  return (
    <div className="mt-8">
      {/* Statistics Cards - 3 cards per row */}
      <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lfgStatisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>

      {/* Analytics Charts Section */}
      <Card className="mb-4">
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            Analytics Overview
          </Typography>
          <Typography variant="small" className="text-white/90">
            Key stats for users, events, sports, and venues
          </Typography>
        </CardHeader>
      </Card>

      {/* Top Row: User Registration (2/3) + Popular Sports (1/3) */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-3 xl:items-stretch">
        {/* User Registration Trend - 2/3 width */}
        <div className="xl:col-span-2 flex">
          <div className="w-full">
            <StatisticsChart
              key={lfgStatisticsChartsData[0].title}
              {...lfgStatisticsChartsData[0]}
              height={400}
              cardHeight={400}
              footer={<ChartFooter footerText={lfgStatisticsChartsData[0].footer} />}
            />
          </div>
        </div>
        {/* Most Popular Sports - 1/3 width */}
        <div className="flex">
          <div className="w-full">
            <StatisticsChart
              key={lfgStatisticsChartsData[2].title}
              {...lfgStatisticsChartsData[2]}
              height={400}
              cardHeight={400}
              footer={<ChartFooter footerText={lfgStatisticsChartsData[2].footer} />}
            />
          </div>
        </div>
      </div>

      {/* Event Creation by Type - Full Width */}
      <div className="mb-4">
        <StatisticsChart
          key={lfgStatisticsChartsData[1].title}
          {...lfgStatisticsChartsData[1]}
          height={400}
          cardHeight={400}
          footer={<ChartFooter footerText={lfgStatisticsChartsData[1].footer} />}
        />
      </div>

      {/* Most Active Venues - Full Width */}
      <div className="mb-4">
        <StatisticsChart
          key={lfgStatisticsChartsData[3].title}
          {...lfgStatisticsChartsData[3]}
          height={400}
          cardHeight={400}
          footer={<ChartFooter footerText={lfgStatisticsChartsData[3].footer} />}
        />
      </div>

      {/* Revenue Metrics - Full Width */}
      <div className="mb-4">
        <StatisticsChart
          key={lfgStatisticsChartsData[4].title}
          {...lfgStatisticsChartsData[4]}
          height={400}
          cardHeight={400}
          footer={<ChartFooter footerText={lfgStatisticsChartsData[4].footer} />}
        />
      </div>
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2 xl:items-start">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-50 flex flex-col" style={{ height: 400 }}>
          <CardHeader
            className="m-0 mx-0 shadow-none flex flex-row items-start justify-between p-4 flex-shrink-0 bg-transparent mt-0"
          >
            <div className="text-left">
              <Typography variant="h6" color="blue-gray" className="mb-1 text-left">
                Active Matches
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600 text-left"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>Live now</strong> across venues
              </Typography>
            </div>
            <div className="flex-shrink-0">
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray">
                    <EllipsisVerticalIcon
                      strokeWidth={3}
                      fill="currenColor"
                      className="h-6 w-6"
                    />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem>Action</MenuItem>
                  <MenuItem>Another Action</MenuItem>
                  <MenuItem>Something else here</MenuItem>
                </MenuList>
              </Menu>
            </div>
          </CardHeader>
          <CardBody className="overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-blue-gray-200 scrollbar-track-transparent">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["match", "players", "slots", "progress"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {lfgSessionsTableData.map(
                  ({ img, name, members, slots, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === lfgSessionsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          <div className="flex items-center -space-x-2">
                            {members.map(({ img, name }, key) => (
                              <Tooltip key={name} content={name}>
                                <Avatar
                                  src={img}
                                  alt={name}
                                  size="xs"
                                  variant="circular"
                                  className="cursor-pointer border-2 border-white hover:z-10"
                                />
                              </Tooltip>
                            ))}
                          </div>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {slots}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex flex-col gap-1 pr-4">
                            <Typography
                              variant="small"
                              className="text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1.5"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

    </div>
  );
}

export default Home;
