// src/lib/apiClient.js
import { getAuthToken, logout } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (typeof window !== "undefined" && !API_URL) {
  console.error(
    "⚠️ NEXT_PUBLIC_API_URL is not defined. Please set it in your .env.local file or Vercel environment variables."
  );
}

async function parse(res) {
  if (!res.ok) {
    let data = null;
    try {
      data = await res.json();
    } catch {
      // ignore parse error
    }

    const err = new Error((data && data.message) || "Request failed");
    err.status = res.status;
    err.data = data;

    // Basic 401 handling: clear token so guards/sign-in can take over
    if (res.status === 401) {
      logout();
    }

    throw err;
  }

  return res.json();
}

export const apiClient = {
  get(endpoint, params = {}) {
    const token = getAuthToken();
    // Filter out undefined/null values before creating query string
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const qs = new URLSearchParams(filteredParams).toString();
    const url = `${API_URL}${endpoint}${qs ? `?${qs}` : ""}`;

    return fetch(url, {
      headers: {
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).then(parse);
  },

  post(endpoint, body = {}) {
    const token = getAuthToken();
    return fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    }).then(parse);
  },

  patch(endpoint, body = {}) {
    const token = getAuthToken();
    return fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    }).then(parse);
  },

  del(endpoint) {
    const token = getAuthToken();
    return fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).then(parse);
  },
};


