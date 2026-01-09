// src/services/adminVenueService.js
import { apiClient } from "@/lib/apiClient";

export const getAdminVenues = (params = {}) =>
  apiClient.get("/admin/venues", params);

export const getAdminVenue = (id) =>
  apiClient.get(`/admin/venues/${id}`);

export const updateAdminVenue = (id, data) =>
  apiClient.patch(`/admin/venues/${id}`, data);

export const approveAdminVenue = (id, verificationNotes = "") =>
  apiClient.post(`/admin/venues/${id}/approve`, {
    verification_notes: verificationNotes,
  });

export const rejectAdminVenue = (id, reason) =>
  apiClient.post(`/admin/venues/${id}/reject`, { reason });

export const resetVenueVerification = (id) =>
  apiClient.post(`/admin/venues/${id}/reset-verification`, {});

export const getVenueDocuments = (id) =>
  apiClient.get(`/admin/venues/${id}/documents`);


