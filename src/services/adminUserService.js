// src/services/adminUserService.js
import { apiClient } from "@/lib/apiClient";

export const getAdminUsers = (params = {}) =>
  apiClient.get("/admin/users", params);

export const getAdminUser = (id) => apiClient.get(`/admin/users/${id}`);

export const createAdminUser = (data) =>
  apiClient.post("/admin/users", data);

export const updateAdminUser = (id, data) =>
  apiClient.patch(`/admin/users/${id}`, data);

export const deleteAdminUser = (id) => apiClient.del(`/admin/users/${id}`);

export const banAdminUser = (id, data) =>
  apiClient.post(`/admin/users/${id}/ban`, data);

export const unbanAdminUser = (id) =>
  apiClient.post(`/admin/users/${id}/unban`, {});

export const getAdminUserActivity = (id) =>
  apiClient.get(`/admin/users/${id}/activity`);

// Pro Athlete verification functions
export const approveProAthlete = (id, verificationNotes = "") =>
  apiClient.post(`/admin/users/${id}/approve`, {
    verification_notes: verificationNotes,
  });

export const rejectProAthlete = (id, verificationNotes) =>
  apiClient.post(`/admin/users/${id}/reject`, {
    verification_notes: verificationNotes,
  });

// Get user documents
export const getUserDocuments = (id) =>
  apiClient.get(`/admin/users/${id}/documents`);

// Get user statistics
export const getUserStatistics = () =>
  apiClient.get("/admin/users/statistics");


