// src/services/adminDashboardService.js
import { apiClient } from "@/lib/apiClient";

export const getOverviewDashboard = () =>
  apiClient.get("/admin/dashboards/overview");

export const getEventsDashboard = (params = {}) =>
  apiClient.get("/admin/dashboards/events", params);

export const getVenuesDashboard = () =>
  apiClient.get("/admin/dashboards/venues");

export const getSupportDashboard = () =>
  apiClient.get("/admin/dashboards/support");

export const getRatingsDashboard = (params = {}) =>
  apiClient.get("/admin/dashboards/ratings", params);


