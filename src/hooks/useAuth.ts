"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout as logoutService } from "@/services/auth";
import { IDecodedToken, UserRole } from "@/types";

interface UseAuthReturn {
  user: IDecodedToken | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isDoctor: boolean;
  isPatient: boolean;
  isSuperAdmin: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

/**
 * Custom hook for authentication state and actions
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<IDecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = useCallback(async () => {
    startTransition(async () => {
      await logoutService();
      setUser(null);
      router.push("/login");
      router.refresh();
    });
  }, [router]);

  const hasRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const isDoctor = user?.role === UserRole.DOCTOR;
  const isPatient = user?.role === UserRole.PATIENT;
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  return {
    user,
    isLoading: isLoading || isPending,
    isAuthenticated: !!user,
    role: user?.role || null,
    logout,
    isAdmin,
    isDoctor,
    isPatient,
    isSuperAdmin,
    hasRole,
  };
}

/**
 * Hook for protecting routes based on roles
 */
export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, isLoading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (allowedRoles && !hasRole(allowedRoles)) {
        // Redirect to appropriate dashboard based on role
        if (user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) {
          router.push("/admin/dashboard");
        } else if (user?.role === UserRole.DOCTOR) {
          router.push("/doctor/dashboard");
        } else if (user?.role === UserRole.PATIENT) {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }
    }
  }, [isLoading, isAuthenticated, allowedRoles, hasRole, router, user?.role]);

  return { user, isLoading, isAuthenticated };
}
