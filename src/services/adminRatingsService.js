// src/services/adminRatingsService.js
import { apiClient } from "@/lib/apiClient";

export const getEventRatingsAdmin = (eventId) =>
  apiClient.get(`/admin/events/${eventId}/ratings`);

export const getRatingsLeaderboardAdmin = (params = {}) =>
  apiClient.get("/admin/ratings/leaderboard", params);


