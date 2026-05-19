// src/App.jsx
import { ThemeProvider } from "../src/context/ThemeContext";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Pages
import HomePage from "./features/landingPage/pages/HomePage";
import ExamsPage from "./features/exams/pages/ExamsPage";
import ExamOverviewPage from "./features/exams/pages/ExamOverviewPage";
import { LoginPage } from "./features/authentication/pages/LoginPage";
import { SignupPage } from "./features/authentication/pages/SignupPage";
import { VerifyOtpPage } from "./features/authentication/pages/VerifyOtpPage";
import { ResendOtpPage } from "./features/authentication/pages/ResendOtpPage";
import { ForgotPasswordPage } from "./features/authentication/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./features/authentication/pages/ResetPasswordPage";
import { DashboardPage } from "./features/userDashboard/pages/DashboardPage";

// Features
import { ProtectedRoute } from "./features/authentication/components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Dashboard Layout & Pages
import DashboardLayout from "./features/adminDashboard/layout/DashbaordLayout";
import UserManagementPage from "./features/adminDashboard/pages/UserManagementPage";
import RolesPage from "./features/adminDashboard/pages/RolesPage";
import IndustryCategorySubCategory from "./features/adminDashboard/pages/IndustryCategorySubCategory";
import SettingsPage from "./features/adminDashboard/pages/SettingsPage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 0 },
    },
  });

  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "#fff",
                color: "#374151",
              },
            }}
          />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/exams" element={<ExamsPage />} />
                <Route path="/exam/:id" element={<ExamOverviewPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />
                <Route path="/resend-otp" element={<ResendOtpPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPasswordPage />}
                />

                {/* Dashboard (User + Admin) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["user", "admin"]}>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Only */}

                <Route
                  path="/dashboard-admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={<Navigate to="user-management" replace />}
                  />
                  <Route
                    path="user-management"
                    element={<UserManagementPage />}
                  />
                  <Route path="roles" element={<RolesPage />} />
                  <Route
                    path="hierarchy-management"
                    element={<IndustryCategorySubCategory />}
                  />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
