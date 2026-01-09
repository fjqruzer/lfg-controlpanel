"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminTeams,
  getAdminTeam,
  approveTeam,
  rejectTeam,
  resetTeamVerification,
  getTeamDocuments,
  getTeamStatistics,
} from "@/services/adminTeamService";

// Teams list with filtering
export function useAdminTeams(filters) {
  return useQuery({
    queryKey: ["admin-teams", filters],
    queryFn: () => getAdminTeams(filters || {}),
    keepPreviousData: true,
  });
}

// Single team with relations
export function useAdminTeam(id) {
  return useQuery({
    queryKey: ["admin-team", id],
    queryFn: () => getAdminTeam(id),
    enabled: !!id,
  });
}

// Team statistics
export function useTeamStatistics() {
  return useQuery({
    queryKey: ["admin-team-statistics"],
    queryFn: () => getTeamStatistics(),
  });
}

// Team documents
export function useTeamDocuments(teamId) {
  return useQuery({
    queryKey: ["admin-team-documents", teamId],
    queryFn: () => getTeamDocuments(teamId),
    enabled: !!teamId,
  });
}

// Approve team mutation
export function useApproveTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }) => approveTeam(id, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-teams"] });
      qc.invalidateQueries({ queryKey: ["admin-team-statistics"] });
    },
  });
}

// Reject team mutation
export function useRejectTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }) => rejectTeam(id, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-teams"] });
      qc.invalidateQueries({ queryKey: ["admin-team-statistics"] });
    },
  });
}

// Reset team verification mutation
export function useResetTeamVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => resetTeamVerification(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-teams"] });
      qc.invalidateQueries({ queryKey: ["admin-team-statistics"] });
    },
  });
}
