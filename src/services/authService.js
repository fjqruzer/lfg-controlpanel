// src/services/authService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && typeof window !== "undefined") {
  console.error(
    "NEXT_PUBLIC_API_URL is not defined. Please set it in your .env.local file or Vercel environment variables."
  );
}

/**
 * Request OTP - sends email to receive one-time code
 * POST /auth/login { email }
 * Response: { next: "otp", message: "OTP sent to your email address" }
 */
export const requestOtp = async (email) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "true", // Bypass ngrok browser warning page
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw await parseError(res);
  // expected: { next: "otp", message }
  return res.json();
};

/**
 * Verify OTP code
 * POST /auth/verify-otp { email, code }
 * Response: { status, message, authorization: { token, type }, user, ... }
 */
export const verifyOtp = async (email, code) => {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "true", // Bypass ngrok browser warning page
    },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) throw await parseError(res);
  const data = await res.json();

  // Handle new response format: { authorization: { token }, user }
  const token = data.authorization?.token || data.token;
  const user = data.user;

  if (typeof window !== "undefined" && token) {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
  }

  return { ...data, token, user };
};

/**
 * Check if user object has admin role
 * Returns true if:
 * - user.role_id === 6 (admin role id) - PRIMARY CHECK
 * - user.role.id === 6 (admin role id)
 * - user.role.name === 'admin' (case-insensitive)
 * - user.role === 'admin' (case-insensitive)
 */
export const isAdminUser = (user) => {
  if (!user) {
    console.log("[isAdminUser] No user provided");
    return false;
  }
  
  // Check role_id first (most common format) - handle both number and string
  const roleId = user.role_id;
  if (roleId !== undefined && roleId !== null) {
    const roleIdNum = Number(roleId);
    if (roleIdNum === 6) {
      console.log("[isAdminUser] Admin detected via role_id:", roleId);
      return true;
    }
  }
  
  // Check nested role.id
  const nestedRoleId = user.role?.id;
  if (nestedRoleId !== undefined && nestedRoleId !== null) {
    const nestedRoleIdNum = Number(nestedRoleId);
    if (nestedRoleIdNum === 6) {
      console.log("[isAdminUser] Admin detected via role.id:", nestedRoleId);
      return true;
    }
  }
  
  // Fallback to role name check
  const roleName = user.role?.name || user.role || "";
  if (roleName && typeof roleName === 'string' && roleName.toLowerCase() === "admin") {
    console.log("[isAdminUser] Admin detected via role name:", roleName);
    return true;
  }
  
  console.log("[isAdminUser] Not admin - user:", { role_id: user.role_id, role: user.role });
  return false;
};

/**
 * Check if user has admin role via API
 * GET /me with Bearer token
 * Returns true if user.role.name === 'admin'
 * Note: Prefer using isAdminUser() with user data from verifyOtp response
 */
export const checkAdminRole = async (token) => {
  try {
    const res = await fetch(`${API_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true", // Bypass ngrok browser warning page
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return false;
    }

    // Check if response is JSON before parsing
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Error checking admin role: Response is not JSON", { contentType, status: res.status });
      return false;
    }

    let userData;
    try {
      userData = await res.json();
    } catch (parseErr) {
      console.error("Error checking admin role: Failed to parse JSON", parseErr);
      return false;
    }

    return isAdminUser(userData.user || userData);
  } catch (err) {
    console.error("Error checking admin role:", err);
    return false;
  }
};

/**
 * Resend OTP to email
 * POST /auth/resend-otp { email }
 */
export const resendOtp = async (email) => {
  const res = await fetch(`${API_URL}/auth/resend-otp`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "true", // Bypass ngrok browser warning page
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw await parseError(res);
  return res.json();
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
};

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_user");
  return raw ? JSON.parse(raw) : null;
};

async function parseError(res) {
  const data = await res.json().catch(() => null);
  
  // Build a more informative error message
  let message = data?.message || data?.error;
  
  if (!message) {
    if (res.status === 404) {
      message = "API endpoint not found. Please check NEXT_PUBLIC_API_URL configuration.";
    } else if (res.status === 401) {
      message = "Unauthorized. Please check your credentials.";
    } else if (res.status === 422) {
      message = data?.errors ? Object.values(data.errors).flat().join(", ") : "Validation failed";
    } else if (res.status >= 500) {
      message = "Server error. Please try again later.";
    } else {
      message = `Request failed (${res.status})`;
    }
  }
  
  const error = new Error(message);
  error.status = res.status;
  error.data = data;
  throw error;
}
