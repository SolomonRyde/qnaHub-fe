import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  X,
  Home,
} from "lucide-react";
import { cn } from "../../../lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect for backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("[data-user-menu]")) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setUserMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setUserMenuOpen(false);
  };

  const userName = user?.name?.split(" ")[0] || "User";
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-sm border-b border-border transition-all duration-200",
        isScrolled && "shadow-sm",
      )}
    >
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center justify-between gap-4">
          {/* Left: Search */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {searchOpen ? (
              <div className="relative flex-1">
                <Input
                  placeholder="Search..."
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                  className="pl-9 bg-muted/50 border-border focus-visible:ring-primary w-full"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative" data-user-menu>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  "flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-accent transition-colors",
                  userMenuOpen && "bg-accent",
                )}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground">
                  {userName}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    userMenuOpen && "rotate-180",
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  {/* Backdrop for mobile */}
                  <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-border bg-muted/30">
                      <p className="font-semibold text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => handleNavigate("/dashboard")}
                        className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-3"
                      >
                        <User className="h-4 w-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={() =>
                          handleNavigate("/user-management/settings")
                        }
                        className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-3"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                      <button
                        onClick={() => handleNavigate("/")}
                        className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-3"
                      >
                        <Home className="h-4 w-4" />
                        Home
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="py-1 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center gap-3"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
