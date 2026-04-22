import { useNavigate } from "react-router-dom";
import {
  User,
  Award,
  BookOpen,
  Play,
  Trophy,
  ChevronRight,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";

import { useAuth } from "../../../context/AuthContext";
import { DashboardNavbar } from "../components/DashboardNavbar";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleStartExam = () => navigate("/exams");
  const handleViewResults = () => navigate("/results");
  const handleViewCertificates = () => navigate("/certificates");
  const handleOpenSettings = () => navigate("/settings");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ✅ Welcome */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your learning journey 🚀
          </p>
        </div>

        {/* ✅ User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {user?.name || "-"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "-"}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone_number || "-"}
            </p>
            <p>
              <strong>Role:</strong> {user?.role || "-"}
            </p>
          </CardContent>
        </Card>

        {/* 🚀 Action Section */}
        <Card className="mb-6">
          <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Start your next exam
              </h2>
              <p className="text-muted-foreground text-sm">
                Practice makes perfect. Keep going!
              </p>
            </div>

            <Button onClick={handleStartExam} className="gap-2">
              <Play className="w-4 h-4" />
              Start Exam
            </Button>
          </CardContent>
        </Card>

        {/* ⚡ Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate easily</CardDescription>
          </CardHeader>

          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={handleStartExam} className="justify-start gap-2">
              <Play className="w-4 h-4" />
              Start Exam
            </Button>

            <Button
              variant="outline"
              onClick={handleViewResults}
              className="justify-start gap-2"
            >
              <Trophy className="w-4 h-4" />
              Results
            </Button>

            <Button
              variant="outline"
              onClick={handleViewCertificates}
              className="justify-start gap-2"
            >
              <Award className="w-4 h-4" />
              Certificates
            </Button>

            <Button
              variant="ghost"
              onClick={handleOpenSettings}
              className="justify-start gap-2"
            >
              <User className="w-4 h-4" />
              Settings
            </Button>
          </CardContent>
        </Card>

        {/* 🔴 Logout */}
        <div className="mt-8 flex justify-end">
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} • Keep learning 🚀
        </p>
      </main>
    </div>
  );
}
