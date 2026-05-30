import React from "react";
import { NavLink } from "react-router-dom";
import { Users, Shield, Key, Settings, BookOpen } from "lucide-react";
import { cn } from "../../../lib/utils";

const SidebarItem = ({ icon: Icon, label, to, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      cn(
        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )
    }
  >
    <Icon className="h-5 w-5" />
    {label}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="h-full flex flex-col">
      {/* Logo/Header Area */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <SidebarItem
          icon={Users}
          label="Users Management"
          to="/dashboard-admin/user-management"
          end
        />
        <SidebarItem
          icon={BookOpen}
          label="Exam Management"
          to="/dashboard-admin/exam-management"
        />
        <SidebarItem
          icon={Key}
          label="Hierarchy Management"
          to="/dashboard-admin/hierarchy-management"
        />
        <SidebarItem icon={Settings} label="Settings" to="settings" />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">© 2024 Your App</div>
      </div>
    </aside>
  );
}
