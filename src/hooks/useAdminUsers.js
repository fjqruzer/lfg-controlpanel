"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  banAdminUser,
  unbanAdminUser,
} from "@/services/adminUserService";

export function useAdminUsers(filters) {
  return useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => getAdminUsers(filters || {}),
    keepPreviousData: true,
  });
}

export function useAdminUser(id) {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => getAdminUser(id),
    enabled: !!id,
  });
}

export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createAdminUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useUpdateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAdminUser(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ["admin-user", variables.id] });
      }
    },
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteAdminUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useBanAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => banAdminUser(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ["admin-user", variables.id] });
      }
    },
  });
}

export function useUnbanAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => unbanAdminUser(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      if (id) {
        qc.invalidateQueries({ queryKey: ["admin-user", id] });
      }
    },
  });
}


