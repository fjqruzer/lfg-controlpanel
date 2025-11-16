"use client";

import {
  exportUsers,
  exportVenues,
  exportEvents,
  exportTickets,
  exportRatings,
} from "@/services/adminExportService";

export function useExports() {
  return {
    exportUsers,
    exportVenues,
    exportEvents,
    exportTickets,
    exportRatings,
  };
}


