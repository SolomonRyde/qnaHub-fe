import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ShieldAlert,
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { useAuth } from "../../../context/AuthContext";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { initialsOf, formatDate } from "../components/helpers";
import ProfileTab from "../components/tabs/ProfileTab";
import EmailTab from "../components/tabs/EmailTab";
import PasswordTab from "../components/tabs/PasswordTab";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "email", label: "Email", icon: Mail },
  { id: "password", label: "Password", icon: Lock },
];

export default function ProfileSettingsPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl opacity-60" />
        <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-500/15 blur-3xl opacity-50" />
      </div>

      <DashboardNavbar />

      <main className="relative max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </button>

        {/* Identity header */}
        <Card className="mb-6 overflow-hidden border-white/10 bg-gradient-to-br from-primary/10 via-background to-violet-500/10">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-violet-500 blur-md opacity-60" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-primary-foreground text-xl sm:text-2xl font-bold ring-4 ring-background">
                  {initialsOf(user?.name)}
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold truncate">
                  {user?.name || "Your account"}
                </h1>
                <p className="text-muted-foreground text-sm mt-1 truncate">
                  {user?.email}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    {user?.role || "user"}
                  </span>
                  {user?.is_verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600">
                      <ShieldAlert className="w-3 h-3" />
                      Unverified
                    </span>
                  )}
                  {user?.created_at && (
                    <span className="text-[11px] text-muted-foreground">
                      Member since {formatDate(user.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "profile" && (
          <ProfileTab user={user} onUpdated={(u) => login({ user: u })} />
        )}
        {activeTab === "email" && (
          <EmailTab user={user} onUpdated={(u) => login({ user: u })} />
        )}
        {activeTab === "password" && <PasswordTab />}
      </main>
    </div>
  );
}
