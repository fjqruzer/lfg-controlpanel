// src/services/adminAuditService.js
import { apiClient } from "@/lib/apiClient";

export const getAuditLogs = (params = {}) =>
  apiClient.get("/admin/audit-logs", params);


