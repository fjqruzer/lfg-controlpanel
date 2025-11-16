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


