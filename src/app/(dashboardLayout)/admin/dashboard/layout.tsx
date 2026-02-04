"use client";

import {
  DashboardLayoutWrapper,
  adminNavItems,
} from "@/components/shared/DashboardNavigation";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutWrapper navItems={adminNavItems}>
      {children}
    </DashboardLayoutWrapper>
  );
}
