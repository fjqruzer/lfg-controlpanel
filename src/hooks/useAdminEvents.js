"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminEvents,
  getAdminEvent,
  getAdminEventParticipants,
  getAdminEventScores,
  updateAdminEvent,
} from "@/services/adminEventService";

// Events list with filtering
export function useAdminEvents(filters) {
  return useQuery({
    queryKey: ["admin-events", filters],
    queryFn: () => getAdminEvents(filters || {}),
    keepPreviousData: true,
  });
}

// Single event with stats
export function useAdminEvent(id) {
  return useQuery({
    queryKey: ["admin-event", id],
    queryFn: () => getAdminEvent(id),
    enabled: !!id,
  });
}

// Event participants
export function useAdminEventParticipants(id) {
  return useQuery({
    queryKey: ["admin-event-participants", id],
    queryFn: () => getAdminEventParticipants(id),
    enabled: !!id,
  });
}

// Event scores
export function useAdminEventScores(id) {
  return useQuery({
    queryKey: ["admin-event-scores", id],
    queryFn: () => getAdminEventScores(id),
    enabled: !!id,
  });
}

// Update event mutation
export function useUpdateAdminEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAdminEvent(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ["admin-event", variables.id] });
      }
    },
  });
}

