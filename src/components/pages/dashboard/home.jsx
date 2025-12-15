"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Chip,
} from "@/components/ui";
import { StatisticsCard } from "@/components/cards";
import { StatisticsChart } from "@/components/charts";
import { ChartFooter } from "@/components/charts";
import {
  UsersIcon,
  MapPinIcon,
  CalendarDaysIcon,
  TicketIcon,
  UserPlusIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import {
  getOverviewDashboard,
  getEventsDashboard,
  getVenuesDashboard,
} from "@/services/adminDashboardService";
import { getAdminUsers } from "@/services/adminUserService";
import { getAdminEvents } from "@/services/adminEventService";
import { chartsConfig } from "@/configs";
import Link from "next/link";
import { getUserAvatarUrl } from "@/lib/imageUrl";

export function Home() {
  const [overview, setOverview] = useState(null);
  const [eventsDashboard, setEventsDashboard] = useState(null);
  const [venuesDashboard, setVenuesDashboard] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Load all dashboard data in parallel
        const [overviewData, eventsData, venuesData, usersData, recentEventsData] = await Promise.all([
          getOverviewDashboard(),
          getEventsDashboard(),
          getVenuesDashboard(),
          getAdminUsers({ per_page: 5 }),
          getAdminEvents({ per_page: 5 }),
        ]);
        
        setOverview(overviewData);
        setEventsDashboard(eventsData);
        setVenuesDashboard(venuesData);
        setRecentUsers(usersData.data || []);
        setRecentEvents(recentEventsData.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Build statistics cards from real data
  const statisticsCards = overview ? [
    {
      color: "gray",
      icon: UsersIcon,
      title: "Total Users",
      value: overview.totals?.users?.toLocaleString() || "0",
      footer: { color: "text-blue-500", value: "", label: "registered users" },
    },
    {
      color: "gray",
      icon: MapPinIcon,
      title: "Total Venues",
      value: overview.totals?.venues?.toLocaleString() || "0",
      footer: { color: "text-green-500", value: "", label: "active venues" },
    },
    {
      color: "gray",
      icon: CalendarDaysIcon,
      title: "Upcoming Events",
      value: overview.totals?.events_upcoming?.toLocaleString() || "0",
      footer: { color: "text-blue-500", value: "", label: "scheduled" },
    },
    {
      color: "gray",
      icon: CalendarDaysIcon,
      title: "Active Events",
      value: overview.totals?.events_active?.toLocaleString() || "0",
      footer: { color: "text-green-500", value: "", label: "happening today" },
    },
    {
      color: "gray",
      icon: TicketIcon,
      title: "Open Tickets",
      value: overview.totals?.tickets_open?.toLocaleString() || "0",
      footer: { color: "text-orange-500", value: "", label: "awaiting response" },
    },
  ] : [];

  // Build user registration trend chart from real data
  const buildUsersTrendChart = () => {
    if (!overview?.trends?.users?.length) return null;
    
    const data = overview.trends.users.map(item => item.c);
    const categories = overview.trends.users.map(item => {
      const date = new Date(item.d);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return {
      color: "white",
      title: "User Registration Trend",
      description: "New user sign-ups over the last 30 days",
      footer: "Live data from database",
      chart: {
        type: "line",
        height: 300,
        series: [{ name: "New Users", data }],
        options: {
          ...chartsConfig,
          colors: ["#000000"],
          chart: { toolbar: { show: false }, background: "transparent" },
          stroke: { curve: "smooth", width: 3 },
          markers: { size: 4 },
          xaxis: { categories, labels: { show: false } },
          yaxis: { labels: { style: { colors: "#64748b", fontSize: "11px" } } },
          grid: { strokeDashArray: 4 },
          dataLabels: { enabled: false },
        },
      },
    };
  };

  // Build events trend chart from real data
  const buildEventsTrendChart = () => {
    if (!overview?.trends?.events?.length) return null;
    
    const data = overview.trends.events.map(item => item.c);
    const categories = overview.trends.events.map(item => {
      const date = new Date(item.d);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return {
      color: "white",
      title: "Events Trend",
      description: "Events scheduled over the last 30 days",
      footer: "Live data from database",
      chart: {
        type: "bar",
        height: 300,
        series: [{ name: "Events", data }],
        options: {
          ...chartsConfig,
          colors: "#000000",
          chart: { toolbar: { show: false }, background: "transparent" },
          plotOptions: { bar: { columnWidth: "50%", borderRadius: 4 } },
          xaxis: { categories, labels: { show: false } },
          yaxis: { labels: { style: { colors: "#64748b", fontSize: "11px" } } },
          grid: { strokeDashArray: 4 },
          dataLabels: { enabled: false },
        },
      },
    };
  };

  // Build sports distribution chart from real data
  const buildSportsChart = () => {
    if (!eventsDashboard?.per_sport?.length) return null;
    
    const series = eventsDashboard.per_sport.map(item => item.c);
    const labels = eventsDashboard.per_sport.map(item => item.sport || "Unknown");

    return {
      color: "white",
      title: "Events by Sport",
      description: "Distribution of events by sport category",
      footer: "All time data",
      chart: {
        type: "pie",
        height: 300,
        series,
        options: {
          ...chartsConfig,
          colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#ef4444"],
          chart: { toolbar: { show: false }, background: "transparent" },
          labels,
          legend: { position: "bottom", fontSize: "11px", labels: { colors: "#64748b" } },
          dataLabels: { enabled: false },
        },
      },
    };
  };

  // Build top venues chart from real data
  const buildVenuesChart = () => {
    if (!venuesDashboard?.top_venues?.length) return null;
    
    const data = venuesDashboard.top_venues.map(v => v.events_count);
    const categories = venuesDashboard.top_venues.map(v => v.name);

    return {
      color: "white",
      title: "Most Active Venues",
      description: "Top venues by events hosted",
      footer: "All time data",
      chart: {
        type: "bar",
        height: 300,
        series: [{ name: "Events Hosted", data }],
        options: {
          ...chartsConfig,
          colors: "#000000",
          chart: { toolbar: { show: false }, background: "transparent", type: "bar" },
          plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "75%" } },
          xaxis: { categories, labels: { style: { colors: "#64748b", fontSize: "11px" } } },
          yaxis: { labels: { style: { colors: "#64748b", fontSize: "10px" } } },
          grid: { strokeDashArray: 4 },
          dataLabels: { enabled: false },
        },
      },
    };
  };

  const usersTrendChart = buildUsersTrendChart();
  const eventsTrendChart = buildEventsTrendChart();
  const sportsChart = buildSportsChart();
  const venuesChart = buildVenuesChart();

  if (loading) {
    return (
      <div className="mt-8">
        <Card>
          <CardBody className="p-6 text-center">
            <Typography>Loading dashboard...</Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <Card>
          <CardBody className="p-6 text-center">
            <Typography color="red">{error}</Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Admin Overview Header */}
      <div className="mb-6">
        <Card>
          <CardHeader variant="gradient" color="gray" className="p-4">
            <Typography variant="h6" color="white">
              Admin Overview
            </Typography>
            <Typography variant="small" className="text-white/90">
              Live data from the backend API
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {statisticsCards.map((card) => (
                <div key={card.title} className="border rounded p-4 bg-white shadow-sm">
                  <div className="flex items-center gap-2 text-xs uppercase text-gray-500">
                    {React.createElement(card.icon, { className: "w-4 h-4" })}
                    {card.title}
                  </div>
                  <div className="text-2xl font-semibold mt-1">{card.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{card.footer.label}</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <Card className="mb-4">
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            Analytics Overview
          </Typography>
          <Typography variant="small" className="text-white/90">
            Real-time stats from database
          </Typography>
        </CardHeader>
      </Card>

      {/* Charts Grid */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {usersTrendChart && (
          <StatisticsChart
            {...usersTrendChart}
            height={300}
            cardHeight={350}
            footer={<ChartFooter footerText={usersTrendChart.footer} />}
          />
        )}
        {eventsTrendChart && (
          <StatisticsChart
            {...eventsTrendChart}
            height={300}
            cardHeight={350}
            footer={<ChartFooter footerText={eventsTrendChart.footer} />}
          />
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {sportsChart && (
          <StatisticsChart
            {...sportsChart}
            height={300}
            cardHeight={350}
            footer={<ChartFooter footerText={sportsChart.footer} />}
          />
        )}
        {venuesChart && (
          <StatisticsChart
            {...venuesChart}
            height={300}
            cardHeight={350}
            footer={<ChartFooter footerText={venuesChart.footer} />}
          />
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Recent Users */}
        <Card className="border border-blue-gray-50">
          <CardHeader className="m-0 p-4 bg-transparent shadow-none">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray">Recent Users</Typography>
                <Typography variant="small" className="text-blue-gray-600">
                  Latest registered users
                </Typography>
              </div>
              <Link href="/dashboard/users">
                <Typography variant="small" className="text-blue-500 hover:underline cursor-pointer">
                  View All
                </Typography>
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-4 pt-0">
            {recentUsers.length === 0 ? (
              <Typography variant="small" className="text-blue-gray-400">No recent users</Typography>
            ) : (
              <div className="flex flex-col gap-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded hover:bg-blue-gray-50">
                    <Avatar
                      src={getUserAvatarUrl(user)}
                      alt={user.username || user.email}
                      size="sm"
                      variant="circular"
                    />
                    <div className="flex-1">
                      <Typography variant="small" className="font-medium text-blue-gray-800">
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        @{user.username || user.email?.split('@')[0]}
                      </Typography>
                    </div>
                    <Chip
                      size="sm"
                      variant="ghost"
                      color={user.role?.name === 'admin' ? 'red' : 'blue'}
                      value={user.role?.name || 'user'}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Events */}
        <Card className="border border-blue-gray-50">
          <CardHeader className="m-0 p-4 bg-transparent shadow-none">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray">Recent Events</Typography>
                <Typography variant="small" className="text-blue-gray-600">
                  Latest created events
                </Typography>
              </div>
              <Link href="/dashboard/events">
                <Typography variant="small" className="text-blue-500 hover:underline cursor-pointer">
                  View All
                </Typography>
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-4 pt-0">
            {recentEvents.length === 0 ? (
              <Typography variant="small" className="text-blue-gray-400">No recent events</Typography>
            ) : (
              <div className="flex flex-col gap-3">
                {recentEvents.map((event) => (
                  <Link key={event.id} href={`/dashboard/events/${event.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-blue-gray-50 cursor-pointer">
                      <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center">
                        <CalendarDaysIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="small" className="font-medium text-blue-gray-800">
                          {event.name}
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-500">
                          {event.sport} • {event.venue?.name || 'No venue'}
                        </Typography>
                      </div>
                      <div className="text-right">
                        <Typography variant="small" className="text-blue-gray-600">
                          {event.date ? new Date(event.date).toLocaleDateString() : 'No date'}
                        </Typography>
                        <Chip
                          size="sm"
                          variant="ghost"
                          color={event.cancelled_at ? 'red' : 'green'}
                          value={event.cancelled_at ? 'cancelled' : 'active'}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
