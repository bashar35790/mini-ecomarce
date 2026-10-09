"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setCredentials, setLoading } from "@/lib/authSlice";
import { apiClient } from "@/lib/api/client";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const restoreSession = async () => {
      try {
        const refreshRes = await apiClient.post("/auth/refresh");
        const accessToken = refreshRes.data?.data?.accessToken;
        if (accessToken) {
          const meRes = await apiClient.get("/auth/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const user = meRes.data?.data?.user;
          if (user) {
            dispatch(setCredentials({ user, accessToken }));
            return;
          }
        }
      } catch {
        // No active session or cookie expired
      } finally {
        dispatch(setLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);

  return <>{children}</>;
}
