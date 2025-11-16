// src/lib/apiClient.js
import { getAuthToken, logout } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    const qs = new URLSearchParams(params).toString();
    const url = `${API_URL}${endpoint}${qs ? `?${qs}` : ""}`;

    return fetch(url, {
      headers: {
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
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).then(parse);
  },
};


