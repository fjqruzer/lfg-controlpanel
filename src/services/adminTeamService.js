// src/services/adminTeamService.js
import { apiClient } from "@/lib/apiClient";

export const getAdminTeams = (params = {}) =>
  apiClient.get("/admin/teams", params);

export const getAdminTeam = (id) =>
  apiClient.get(`/admin/teams/${id}`);

export const approveTeam = (id, verificationNotes = "") =>
  apiClient.post(`/admin/teams/${id}/approve`, {
    verification_notes: verificationNotes,
  });

export const rejectTeam = (id, verificationNotes) =>
  apiClient.post(`/admin/teams/${id}/reject`, {
    verification_notes: verificationNotes,
  });

export const resetTeamVerification = (id) =>
  apiClient.post(`/admin/teams/${id}/reset-verification`, {});

export const getTeamDocuments = (id) =>
  apiClient.get(`/admin/teams/${id}/documents`);

export const getTeamStatistics = () =>
  apiClient.get("/admin/teams/statistics");
