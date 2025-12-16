"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "@/services/adminAuditService";

// Audit logs with filtering
export function useAdminAuditLogs(filters) {
  return useQuery({
    queryKey: ["admin-audit-logs", filters],
    queryFn: () => getAuditLogs(filters || {}),
    keepPreviousData: true,
  });
}



