// src/services/adminExportService.js
import { getAuthToken } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function downloadCsv(path, filename) {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error("Export failed");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const exportUsers = () =>
  downloadCsv("/admin/exports/users", "users.csv");

export const exportVenues = () =>
  downloadCsv("/admin/exports/venues", "venues.csv");

export const exportEvents = () =>
  downloadCsv("/admin/exports/events", "events.csv");

export const exportTickets = () =>
  downloadCsv("/admin/exports/tickets", "tickets.csv");

export const exportRatings = () =>
  downloadCsv("/admin/exports/ratings", "ratings.csv");


