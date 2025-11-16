"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken } from "@/services/authService";

export function RequireAuth({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      // Preserve intended destination if needed later
      router.replace(`/auth/sign-in?next=${encodeURIComponent(pathname || "/dashboard/home")}`);
    } else {
      setChecked(true);
    }
  }, [router, pathname]);

  if (!checked) {
    return null;
  }

  return children;
}

export default RequireAuth;


