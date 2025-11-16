import {
  UsersIcon,
  UserGroupIcon,
  MapPinIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  TicketIcon,
  FlagIcon,
} from "@heroicons/react/24/solid";
import { chartsConfig } from "@/configs";

// Top statistic cards for LFG
export const lfgStatisticsCardsData = [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total Registered Users",
    value: "2,847",
    footer: { color: "text-green-500", value: "+12%", label: "vs last month" },
  },
  {
    color: "gray",
    icon: CalendarDaysIcon,
    title: "Active Events",
    value: "156",
    footer: { color: "text-green-500", value: "+24", label: "this week" },
  },
  {
    color: "gray",
    icon: MapPinIcon,
    title: "Total Venues",
    value: "43",
    footer: { color: "text-blue-500", value: "38 verified", label: "5 pending" },
  },
  {
    color: "gray",
    icon: UserGroupIcon,
    title: "Total Teams",
    value: "127",
    footer: { color: "text-green-500", value: "+8", label: "new this month" },
  },
  {
    color: "gray",
    icon: TicketIcon,
    title: "Active Support Tickets",
    value: "23",
    footer: { color: "text-orange-500", value: "12 urgent", label: "awaiting response" },
  },
  {
    color: "gray",
    icon: FlagIcon,
    title: "Flagged Content",
    value: "9",
    footer: { color: "text-red-500", value: "3 new", label: "needs review" },
  },
];

// Charts for LFG dashboard (reuse template chart component shape)
export const lfgStatisticsChartsData = [
  {
    color: "white",
    title: "User Registration Trend",
    description: "New user sign-ups over the last 30 days",
    footer: "Updated 2 min ago",
    chart: {
      type: "line",
      height: 300,
      series: [
        {
          name: "New Users",
          data: [45, 52, 38, 65, 58, 73, 62, 48, 55, 70, 82, 67, 75, 88, 92, 78, 85, 91, 98, 105, 95, 102, 110, 118, 108, 115, 125, 132, 120, 128],
        },
      ],
      options: {
        ...chartsConfig,
        colors: ["#000000"],
        chart: { 
          ...(chartsConfig.chart || {}), 
          id: "user-registration-chart", 
          toolbar: { show: false }, 
          background: "transparent",
          width: "100%",
        },
        stroke: { curve: "smooth", width: 3, lineCap: "round" },
        markers: { size: 4 },
        xaxis: {
          ...(chartsConfig.xaxis || {}),
          type: "category",
          categories: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
          labels: { 
            ...(chartsConfig.xaxis?.labels || {}), 
            style: { colors: "#64748b", fontSize: "11px" },
            show: false,
          },
        },
        yaxis: { ...(chartsConfig.yaxis || {}), labels: { style: { colors: "#64748b", fontSize: "11px" } } },
        grid: { ...(chartsConfig.grid || {}), strokeDashArray: 4 },
        dataLabels: { enabled: false },
        tooltip: {
          x: { show: true },
        },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: { width: "100%" },
          },
        }],
      },
    },
  },
  {
    color: "white",
    title: "Event Creation by Type",
    description: "Distribution of events created this month",
    footer: "Updated 5 min ago",
    chart: {
      type: "bar",
      height: 300,
      series: [
        {
          name: "Events",
          data: [45, 38, 52, 28, 35, 42, 18],
        },
      ],
      options: {
        ...chartsConfig,
        colors: "#000000",
        chart: { 
          ...(chartsConfig.chart || {}), 
          id: "event-type-chart", 
          toolbar: { show: false }, 
          background: "transparent",
          width: "100%",
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
            borderRadius: 4,
          },
        },
        xaxis: {
          ...(chartsConfig.xaxis || {}),
          type: "category",
          categories: ["Free For All", "Team vs Team", "Tournament", "Training", "Scrimmage", "League", "Friendly"],
          labels: { 
            ...(chartsConfig.xaxis?.labels || {}), 
            style: { colors: "#64748b", fontSize: "10px" },
            rotate: -45,
          },
        },
        yaxis: { ...(chartsConfig.yaxis || {}), labels: { style: { colors: "#64748b", fontSize: "11px" } } },
        grid: { ...(chartsConfig.grid || {}), strokeDashArray: 4 },
        dataLabels: { enabled: false },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: { width: "100%" },
            plotOptions: { bar: { columnWidth: "70%" } },
          },
        }],
      },
    },
  },
  {
    color: "white",
    title: "Most Popular Sports",
    description: "Events breakdown by sport category",
    footer: "All time data",
    chart: {
      type: "pie",
      height: 300,
      series: [324, 278, 195, 142, 118, 89, 64],
      options: {
        ...chartsConfig,
        colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#ef4444"],
        chart: { 
          ...(chartsConfig.chart || {}), 
          id: "popular-sports-chart", 
          toolbar: { show: false }, 
          background: "transparent",
          width: "100%",
        },
        labels: ["Basketball", "Football", "Volleyball", "Badminton", "Tennis", "Swimming", "Others"],
        legend: {
          position: "bottom",
          fontSize: "11px",
          fontFamily: "inherit",
          labels: {
            colors: "#64748b",
          },
        },
        dataLabels: { enabled: false },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: false,
              },
            },
          },
        },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: { width: "100%" },
            legend: { position: "bottom" },
          },
        }],
      },
    },
  },
  {
    color: "white",
    title: "Most Active Venues",
    description: "Top 10 venues by events hosted",
    footer: "This month",
    chart: {
      type: "bar",
      height: 300,
      series: [
        {
          name: "Events Hosted",
          data: [87, 72, 68, 54, 48, 42, 38, 34, 28, 22],
        },
      ],
      options: {
        ...chartsConfig,
        colors: "#000000",
        chart: { 
          ...(chartsConfig.chart || {}), 
          id: "active-venues-chart", 
          toolbar: { show: false }, 
          background: "transparent", 
          type: "bar",
          width: "100%",
          offsetY: -10,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 4,
            barHeight: "75%",
          },
        },
        xaxis: {
          ...(chartsConfig.xaxis || {}),
          categories: ["GG Arena", "Quest Hub", "Sports Central", "MVP Courts", "Elite Fields", "Pro Zone", "Champion Arena", "Victory Courts", "Ace Complex", "Game Point"],
          labels: { style: { colors: "#64748b", fontSize: "11px" } },
        },
        yaxis: { ...(chartsConfig.yaxis || {}), labels: { style: { colors: "#64748b", fontSize: "10px" } } },
        grid: { ...(chartsConfig.grid || {}), strokeDashArray: 4 },
        dataLabels: { enabled: false },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: { width: "100%" },
            yaxis: { labels: { style: { fontSize: "9px" } } },
          },
        }],
      },
    },
  },
  {
    color: "white",
    title: "Revenue Metrics",
    description: "Facility booking revenue (PHP)",
    footer: "Last 7 days",
    chart: {
      type: "bar",
      height: 300,
      series: [
        {
          name: "Revenue",
          data: [125000, 142000, 138000, 155000, 178000, 165000, 192000],
        },
      ],
      options: {
        ...chartsConfig,
        colors: "#000000",
        chart: { 
          ...(chartsConfig.chart || {}), 
          id: "revenue-chart", 
          toolbar: { show: false }, 
          background: "transparent",
          width: "100%",
        },
        plotOptions: {
          bar: {
            columnWidth: "60%",
            borderRadius: 4,
          },
        },
        xaxis: {
          ...(chartsConfig.xaxis || {}),
          type: "category",
          categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          labels: { ...(chartsConfig.xaxis?.labels || {}), style: { colors: "#64748b", fontSize: "11px" } },
        },
        yaxis: { 
          ...(chartsConfig.yaxis || {}), 
          labels: { 
            style: { colors: "#64748b", fontSize: "11px" },
            formatter: function (val) {
              return "₱" + (val / 1000).toFixed(0) + "k";
            },
          },
        },
        grid: { ...(chartsConfig.grid || {}), strokeDashArray: 4 },
        dataLabels: { enabled: false },
        tooltip: {
          y: {
            formatter: function (val) {
              return "₱" + val.toLocaleString();
            },
          },
        },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: { width: "100%" },
            plotOptions: { bar: { columnWidth: "80%" } },
          },
        }],
      },
    },
  },
];

// Sessions table data (adapts existing table structure)
export const lfgSessionsTableData = [
  {
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=200",
    name: "Basketball | 5v5 Pickup",
    members: [
      { img: "https://i.pravatar.cc/40?img=1", name: "PG • Marco" },
      { img: "https://i.pravatar.cc/40?img=2", name: "SF • Luis" },
      { img: "https://i.pravatar.cc/40?img=3", name: "C • Ken" },
    ],
    slots: "9/10 players",
    completion: 60,
  },
  {
    img: "https://images.unsplash.com/photo-1521417531039-943f5fbc99f7?q=80&w=200",
    name: "Football | 7-a-side",
    members: [
      { img: "https://i.pravatar.cc/40?img=4", name: "ST • Paolo" },
      { img: "https://i.pravatar.cc/40?img=5", name: "GK • Migs" },
    ],
    slots: "10/14 players",
    completion: 40,
  },
  {
    img: "https://images.unsplash.com/photo-1511295742362-92c96b1f2a9a?q=80&w=200",
    name: "Tennis | Doubles",
    members: [
      { img: "https://i.pravatar.cc/40?img=6", name: "Serena" },
      { img: "https://i.pravatar.cc/40?img=7", name: "Venus" },
      { img: "https://i.pravatar.cc/40?img=8", name: "Roger" },
      { img: "https://i.pravatar.cc/40?img=9", name: "Rafa" },
    ],
    slots: "4/4 players",
    completion: 100,
  },
  {
    img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=200",
    name: "Volleyball | Mixed",
    members: [
      { img: "https://i.pravatar.cc/40?img=10", name: "OH • Bea" },
      { img: "https://i.pravatar.cc/40?img=11", name: "S • Kim" },
      { img: "https://i.pravatar.cc/40?img=12", name: "L • Toni" },
    ],
    slots: "8/12 players",
    completion: 60,
  },
  {
    img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=200",
    name: "Badminton | Singles",
    members: [
      { img: "https://i.pravatar.cc/40?img=13", name: "Lin Dan" },
      { img: "https://i.pravatar.cc/40?img=14", name: "Lee Chong Wei" },
    ],
    slots: "2/2 players",
    completion: 100,
  },
  {
    img: "https://images.unsplash.com/photo-1593766787879-e8c78e09cec0?q=80&w=200",
    name: "Swimming | Lap Training",
    members: [
      { img: "https://i.pravatar.cc/40?img=15", name: "Michael" },
      { img: "https://i.pravatar.cc/40?img=16", name: "Katie" },
      { img: "https://i.pravatar.cc/40?img=17", name: "Ryan" },
    ],
    slots: "3/8 players",
    completion: 30,
  },
  {
    img: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=200",
    name: "Table Tennis | Doubles",
    members: [
      { img: "https://i.pravatar.cc/40?img=18", name: "Ma Long" },
      { img: "https://i.pravatar.cc/40?img=19", name: "Fan Zhendong" },
    ],
    slots: "3/4 players",
    completion: 75,
  },
  {
    img: "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?q=80&w=200",
    name: "Cricket | T20 Match",
    members: [
      { img: "https://i.pravatar.cc/40?img=20", name: "Virat" },
      { img: "https://i.pravatar.cc/40?img=21", name: "Rohit" },
      { img: "https://i.pravatar.cc/40?img=22", name: "Dhoni" },
    ],
    slots: "15/22 players",
    completion: 65,
  },
];

// Recent activity list (adapts orders overview)
import { 
  CheckCircleIcon, 
  ClockIcon, 
  UserPlusIcon, 
  CalendarIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
} from "@heroicons/react/24/solid";

export const lfgActivityData = [
  {
    id: "activity-1",
    icon: UserPlusIcon,
    color: "text-blue-500",
    title: "New User Registration",
    description: "Marco Santos (@msantos) just registered",
  },
  {
    id: "activity-2",
    icon: CalendarIcon,
    color: "text-green-500",
    title: "Event Created",
    description: "Basketball 5v5 Pickup at GG Arena - Tomorrow 6:00 PM",
  },
  {
    id: "activity-3",
    icon: MapPinIcon,
    color: "text-purple-500",
    title: "New Venue Submission",
    description: "Pro Zone Sports Complex submitted for verification",
  },
  {
    id: "activity-4",
    icon: TicketIcon,
    color: "text-orange-500",
    title: "Support Ticket Created",
    description: "Ticket #2847: Payment issue at Quest Hub",
  },
  {
    id: "activity-5",
    icon: BellAlertIcon,
    color: "text-red-500",
    title: "System Alert",
    description: "Server maintenance scheduled for tonight at 2:00 AM",
  },
  {
    id: "activity-6",
    icon: UserPlusIcon,
    color: "text-blue-500",
    title: "New User Registration",
    description: "Bea Lim (@blim) just registered",
  },
  {
    id: "activity-7",
    icon: CalendarIcon,
    color: "text-green-500",
    title: "Event Created",
    description: "Football 7-a-side Tournament at Sports Central",
  },
  {
    id: "activity-8",
    icon: FlagIcon,
    color: "text-red-500",
    title: "Content Flagged",
    description: "Inappropriate comment flagged by user @kenreyes",
  },
  {
    id: "activity-9",
    icon: MapPinIcon,
    color: "text-purple-500",
    title: "Venue Verified",
    description: "Elite Fields verified and now active",
  },
  {
    id: "activity-10",
    icon: TicketIcon,
    color: "text-orange-500",
    title: "Support Ticket Resolved",
    description: "Ticket #2843: Booking conflict resolved",
  },
  {
    id: "activity-11",
    icon: CalendarIcon,
    color: "text-green-500",
    title: "Event Created",
    description: "Volleyball Mixed Doubles at Quest Hub - Saturday 4:00 PM",
  },
  {
    id: "activity-12",
    icon: UserPlusIcon,
    color: "text-blue-500",
    title: "New User Registration",
    description: "Ken Reyes (@kreyes) just registered",
  },
  {
    id: "activity-13",
    icon: ExclamationTriangleIcon,
    color: "text-yellow-600",
    title: "System Alert",
    description: "High server load detected - monitoring performance",
  },
  {
    id: "activity-14",
    icon: MapPinIcon,
    color: "text-purple-500",
    title: "New Venue Submission",
    description: "Champion Arena submitted for verification",
  },
  {
    id: "activity-15",
    icon: CheckCircleIcon,
    color: "text-green-500",
    title: "Event Completed",
    description: "Tennis Doubles at GG Arena finished successfully",
  },
];

export default {
  lfgStatisticsCardsData,
  lfgStatisticsChartsData,
  lfgSessionsTableData,
  lfgActivityData,
};
