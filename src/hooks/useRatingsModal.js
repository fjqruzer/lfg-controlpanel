"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPendingRatings,
  submitRating,
} from "@/services/ratingsService";

export function usePendingRatings(eventId) {
  return useQuery({
    queryKey: ["pending-ratings", eventId],
    queryFn: () => getPendingRatings(eventId),
    enabled: !!eventId,
  });
}

export function useSubmitRating(eventId) {
  return useMutation({
    mutationFn: (payload) => submitRating(eventId, payload),
  });
}


