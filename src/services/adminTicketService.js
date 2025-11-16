// src/services/adminTicketService.js
import { apiClient } from "@/lib/apiClient";

export const getAdminTickets = (params = {}) =>
  apiClient.get("/admin/tickets", params);

export const getAdminTicket = (id) =>
  apiClient.get(`/admin/tickets/${id}`);

export const createAdminTicket = (data) =>
  apiClient.post("/admin/tickets", data);

export const updateAdminTicket = (id, data) =>
  apiClient.patch(`/admin/tickets/${id}`, data);

export const closeAdminTicket = (id) =>
  apiClient.post(`/admin/tickets/${id}/close`, {});


