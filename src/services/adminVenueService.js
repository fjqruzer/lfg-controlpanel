// src/services/adminVenueService.js
import { apiClient } from "@/lib/apiClient";

export const getAdminVenues = (params = {}) =>
  apiClient.get("/admin/venues", params);

export const getAdminVenue = (id) =>
  apiClient.get(`/admin/venues/${id}`);

export const updateAdminVenue = (id, data) =>
  apiClient.patch(`/admin/venues/${id}`, data);

export const approveAdminVenue = (id) =>
  apiClient.post(`/admin/venues/${id}/approve`, {});

export const rejectAdminVenue = (id, reason) =>
  apiClient.post(`/admin/venues/${id}/reject`, { reason });


