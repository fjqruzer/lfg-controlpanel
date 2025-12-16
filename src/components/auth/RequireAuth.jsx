"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken, getCurrentUser, isAdminUser, logout } from "@/services/authService";

export function RequireAuth({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      // No token - redirect to sign in
      router.replace(`/auth/sign-in?next=${encodeURIComponent(pathname || "/dashboard/home")}`);
      return;
    }

    // Check if user is admin
    const user = getCurrentUser();
    if (!isAdminUser(user)) {
      // Not an admin - clear tokens and redirect to sign in
      logout();
      router.replace(`/auth/sign-in?next=${encodeURIComponent(pathname || "/dashboard/home")}`);
      return;
    }

    // Token exists and user is admin
    setChecked(true);
  }, [router, pathname]);

  if (!checked) {
    return null;
  }

  return children;
}

export default RequireAuth;


