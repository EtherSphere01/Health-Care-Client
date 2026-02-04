"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Stethoscope,
  Calendar,
  ClipboardList,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Heart,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

// Admin Navigation Items
export const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Doctors", href: "/admin/dashboard/doctors-management", icon: Stethoscope },
  { title: "Patients", href: "/admin/dashboard/patients-management", icon: Users },
  { title: "Admins", href: "/admin/dashboard/admins-management", icon: UserCog },
  { title: "Appointments", href: "/admin/dashboard/appointments-management", icon: Calendar },
  { title: "Specialties", href: "/admin/dashboard/specialities-management", icon: Heart },
  { title: "Schedules", href: "/admin/dashboard/schedules-management", icon: Clock },
  { title: "My Profile", href: "/admin/dashboard/my-profile", icon: User },
];

// Doctor Navigation Items
export const doctorNavItems: NavItem[] = [
  { title: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { title: "Appointments", href: "/doctor/dashboard/appointments", icon: Calendar },
  { title: "My Schedules", href: "/doctor/dashboard/my-schedules", icon: Clock },
  { title: "Prescriptions", href: "/doctor/dashboard/prescriptions", icon: ClipboardList },
  { title: "My Profile", href: "/doctor/dashboard/my-profile", icon: User },
];

// Patient Navigation Items
export const patientNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Appointments", href: "/dashboard/my-appointments", icon: Calendar },
  { title: "My Prescriptions", href: "/dashboard/my-prescriptions", icon: ClipboardList },
  { title: "My Profile", href: "/dashboard/my-profile", icon: User },
];

interface DashboardSidebarProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ navItems, isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">HealthCare</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  item.href !== "/doctor/dashboard" &&
                  item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
            disabled={isLoading}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}

interface DashboardTopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function DashboardTopbar({ onMenuClick, title }: DashboardTopbarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
          {title && (
            <h1 className="text-lg font-semibold hidden sm:block">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-muted">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role?.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export function DashboardLayoutWrapper({
  children,
  navItems,
}: DashboardLayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        navItems={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-64">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
