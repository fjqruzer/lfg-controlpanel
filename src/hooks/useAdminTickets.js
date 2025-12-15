"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminTickets,
  getAdminTicket,
  createAdminTicket,
  updateAdminTicket,
  closeAdminTicket,
} from "@/services/adminTicketService";

// Tickets list with filtering
export function useAdminTickets(filters) {
  return useQuery({
    queryKey: ["admin-tickets", filters],
    queryFn: () => getAdminTickets(filters || {}),
    keepPreviousData: true,
  });
}

// Single ticket
export function useAdminTicket(id) {
  return useQuery({
    queryKey: ["admin-ticket", id],
    queryFn: () => getAdminTicket(id),
    enabled: !!id,
  });
}

// Create ticket mutation
export function useCreateAdminTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createAdminTicket(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tickets"] });
    },
  });
}

// Update ticket mutation
export function useUpdateAdminTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAdminTicket(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-tickets"] });
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ["admin-ticket", variables.id] });
      }
    },
  });
}

// Close ticket mutation
export function useCloseAdminTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => closeAdminTicket(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["admin-tickets"] });
      qc.invalidateQueries({ queryKey: ["admin-ticket", id] });
    },
  });
}

