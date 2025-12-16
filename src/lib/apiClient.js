// src/lib/apiClient.js
import { getAuthToken, logout } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (typeof window !== "undefined" && !API_URL) {
  console.error(
    "⚠️ NEXT_PUBLIC_API_URL is not defined. Please set it in your .env.local file or Vercel environment variables."
  );
}

async function parse(res) {
  // Check content-type before parsing
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  
  // Clone response for potential error handling (body can only be read once)
  let responseClone = null;
  try {
    responseClone = res.clone();
  } catch {
    // Clone might fail in some environments, that's okay
  }
  
  if (!res.ok) {
    let data = null;
    let errorMessage = "Request failed";
    
    if (isJson) {
      try {
        data = await res.json();
        errorMessage = data?.message || data?.error || errorMessage;
      } catch (parseErr) {
        console.error("Failed to parse error response as JSON:", parseErr);
        // Response might not actually be JSON despite content-type header
        if (responseClone) {
          try {
            const text = await responseClone.text();
            console.error("Non-JSON error response preview:", text.substring(0, 200));
            if (text.includes("ngrok") || text.includes("html") || text.includes("<!DOCTYPE")) {
              errorMessage = "API endpoint returned HTML instead of JSON. This may be due to ngrok intercepting the request or API misconfiguration.";
            }
          } catch {
            // ignore
          }
        }
      }
    } else {
      // Not JSON - log for debugging
      try {
        const text = await res.text();
        console.error("Non-JSON error response:", { status: res.status, contentType, preview: text.substring(0, 200) });
        if (text.includes("ngrok") || text.includes("html") || text.includes("<!DOCTYPE")) {
          errorMessage = "API endpoint returned HTML instead of JSON. Check API configuration.";
        }
      } catch {
        // ignore
      }
    }

    const err = new Error(errorMessage);
    err.status = res.status;
    err.data = data;

    // Basic 401 handling: clear token so guards/sign-in can take over
    if (res.status === 401) {
      logout();
    }

    throw err;
  }

  // Success response - check if it's JSON
  if (!isJson) {
    const text = await res.text();
    console.error("Expected JSON but received non-JSON response:", { 
      url: res.url, 
      contentType, 
      status: res.status,
      preview: text.substring(0, 200) 
    });
    
    if (text.includes("ngrok") || text.includes("html") || text.includes("<!DOCTYPE")) {
      throw new Error("API returned HTML instead of JSON. This may be due to ngrok intercepting requests or API misconfiguration. Please check NEXT_PUBLIC_API_URL.");
    }
    
    throw new Error(`Expected JSON response but received ${contentType || 'unknown content type'}`);
  }

  // Parse JSON response
  try {
    return await res.json();
  } catch (parseErr) {
    // Even if content-type says JSON, parsing might fail (e.g., HTML response with wrong header)
    console.error("JSON parse error:", parseErr);
    if (responseClone) {
      try {
        const text = await responseClone.text();
        console.error("Response preview:", text.substring(0, 500));
        if (text.includes("ngrok") || text.includes("html") || text.includes("<!DOCTYPE")) {
          throw new Error("API returned HTML instead of JSON. Check NEXT_PUBLIC_API_URL configuration.");
        }
      } catch {
        // ignore
      }
    }
    throw new Error(`Failed to parse JSON response: ${parseErr.message}`);
  }
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


