// src/services/ratingsService.js
import { apiClient } from "@/lib/apiClient";

export const getPendingRatings = (eventId) =>
  apiClient.get(`/events/${eventId}/pending-ratings`);

export const submitRating = (eventId, payload) =>
  apiClient.post(`/events/${eventId}/ratings`, payload);

export const getRatingsSummary = (eventId) =>
  apiClient.get(`/events/${eventId}/ratings/summary`);


