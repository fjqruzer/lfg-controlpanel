"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getOverviewDashboard,
  getEventsDashboard,
  getVenuesDashboard,
  getSupportDashboard,
  getRatingsDashboard,
} from "@/services/adminDashboardService";

// Overview dashboard
export function useOverviewDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: getOverviewDashboard,
  });
}

// Events dashboard with optional date filters
export function useEventsDashboard(params) {
  return useQuery({
    queryKey: ["admin-dashboard-events", params],
    queryFn: () => getEventsDashboard(params || {}),
  });
}

// Venues dashboard
export function useVenuesDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard-venues"],
    queryFn: getVenuesDashboard,
  });
}

// Support dashboard
export function useSupportDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard-support"],
    queryFn: getSupportDashboard,
  });
}

// Ratings dashboard with optional date filters
export function useRatingsDashboard(params) {
  return useQuery({
    queryKey: ["admin-dashboard-ratings", params],
    queryFn: () => getRatingsDashboard(params || {}),
  });
}

