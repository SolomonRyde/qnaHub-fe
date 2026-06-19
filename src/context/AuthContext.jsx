import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/apiAuth";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LOGOUT FUNCTION (reusable)
  const logout = async (showMessage = false) => {
    try {
      await fetch("https://api.rydevalues.cloud/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }

    setUser(null);

    if (showMessage) {
      toast.error("Your account has been deleted or deactivated");
    }
  };

  // ✅ Check auth on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getCurrentUser();

        const currentUser = data?.user;

        // 🚨 KEY LOGIC (AUTO LOGOUT IF DELETED)
        if (
          currentUser &&
          (currentUser.is_deleted === 1 || currentUser.status === 0)
        ) {
          await logout(true);
          return;
        }

        setUser(currentUser || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ✅ OPTIONAL: Polling (auto logout even without refresh)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const data = await getCurrentUser();
        const currentUser = data?.user;

        if (
          !currentUser ||
          currentUser.is_deleted === 1 ||
          currentUser.status === 0
        ) {
          await logout(true);
        }
      } catch (err) {
        console.error("Auth polling failed:", err);
        await logout();
      }
    }, 10000); // 🔁 every 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  // ✅ LOGIN
  const login = ({ user }) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
