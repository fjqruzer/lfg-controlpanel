"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCoaches,
  getAdminCoach,
  approveCoach,
  rejectCoach,
  resetCoachVerification,
  getCoachDocuments,
  getCoachStatistics,
} from "@/services/adminCoachService";

// Coaches list with filtering
export function useAdminCoaches(filters) {
  return useQuery({
    queryKey: ["admin-coaches", filters],
    queryFn: () => getAdminCoaches(filters || {}),
    keepPreviousData: true,
  });
}

// Single coach with relations
export function useAdminCoach(id) {
  return useQuery({
    queryKey: ["admin-coach", id],
    queryFn: () => getAdminCoach(id),
    enabled: !!id,
  });
}

// Coach statistics
export function useCoachStatistics() {
  return useQuery({
    queryKey: ["admin-coach-statistics"],
    queryFn: () => getCoachStatistics(),
  });
}

// Coach documents
export function useCoachDocuments(coachId) {
  return useQuery({
    queryKey: ["admin-coach-documents", coachId],
    queryFn: () => getCoachDocuments(coachId),
    enabled: !!coachId,
  });
}

// Approve coach mutation
export function useApproveCoach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }) => approveCoach(id, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coaches"] });
      qc.invalidateQueries({ queryKey: ["admin-coach-statistics"] });
    },
  });
}

// Reject coach mutation
export function useRejectCoach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }) => rejectCoach(id, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coaches"] });
      qc.invalidateQueries({ queryKey: ["admin-coach-statistics"] });
    },
  });
}

// Reset coach verification mutation
export function useResetCoachVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => resetCoachVerification(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coaches"] });
      qc.invalidateQueries({ queryKey: ["admin-coach-statistics"] });
    },
  });
}
