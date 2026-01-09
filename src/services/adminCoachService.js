// src/services/adminCoachService.js
import { apiClient } from "@/lib/apiClient";

export const getAdminCoaches = (params = {}) =>
  apiClient.get("/admin/coaches", params);

export const getAdminCoach = (id) =>
  apiClient.get(`/admin/coaches/${id}`);

export const approveCoach = (id, verificationNotes = "") =>
  apiClient.post(`/admin/coaches/${id}/approve`, {
    verification_notes: verificationNotes,
  });

export const rejectCoach = (id, verificationNotes) =>
  apiClient.post(`/admin/coaches/${id}/reject`, {
    verification_notes: verificationNotes,
  });

export const resetCoachVerification = (id) =>
  apiClient.post(`/admin/coaches/${id}/reset-verification`, {});

export const getCoachDocuments = (id) =>
  apiClient.get(`/admin/coaches/${id}/documents`);

export const getCoachStatistics = () =>
  apiClient.get("/admin/coaches/statistics");
