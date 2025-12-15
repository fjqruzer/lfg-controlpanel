"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getEventRatingsAdmin,
  getRatingsLeaderboardAdmin,
} from "@/services/adminRatingsService";

// Event ratings
export function useAdminEventRatings(eventId) {
  return useQuery({
    queryKey: ["admin-event-ratings", eventId],
    queryFn: () => getEventRatingsAdmin(eventId),
    enabled: !!eventId,
  });
}

// Ratings leaderboard
export function useAdminRatingsLeaderboard(params) {
  return useQuery({
    queryKey: ["admin-ratings-leaderboard", params],
    queryFn: () => getRatingsLeaderboardAdmin(params || {}),
  });
}

