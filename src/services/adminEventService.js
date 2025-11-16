// src/services/adminEventService.js
import { apiClient } from "@/lib/apiClient";

export const getAdminEvents = (params = {}) =>
  apiClient.get("/admin/events", params);

export const getAdminEvent = (id) =>
  apiClient.get(`/admin/events/${id}`); // { event, stats }

export const getAdminEventParticipants = (id) =>
  apiClient.get(`/admin/events/${id}/participants`);

export const getAdminEventScores = (id) =>
  apiClient.get(`/admin/events/${id}/scores`);

export const updateAdminEvent = (id, data) =>
  apiClient.patch(`/admin/events/${id}`, data);


