"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminVenues,
  getAdminVenue,
  updateAdminVenue,
  approveAdminVenue,
  rejectAdminVenue,
} from "@/services/adminVenueService";

// Venues list with filtering
export function useAdminVenues(filters) {
  return useQuery({
    queryKey: ["admin-venues", filters],
    queryFn: () => getAdminVenues(filters || {}),
    keepPreviousData: true,
  });
}

// Single venue with relations
export function useAdminVenue(id) {
  return useQuery({
    queryKey: ["admin-venue", id],
    queryFn: () => getAdminVenue(id),
    enabled: !!id,
  });
}

// Update venue mutation
export function useUpdateAdminVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAdminVenue(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-venues"] });
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ["admin-venue", variables.id] });
      }
    },
  });
}

// Approve venue mutation
export function useApproveAdminVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => approveAdminVenue(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["admin-venues"] });
      qc.invalidateQueries({ queryKey: ["admin-venue", id] });
    },
  });
}

// Reject venue mutation
export function useRejectAdminVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => rejectAdminVenue(id, reason),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-venues"] });
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ["admin-venue", variables.id] });
      }
    },
  });
}



