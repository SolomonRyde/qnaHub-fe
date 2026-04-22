import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/apiAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check auth on app load using cookie
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data?.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ✅ Login (NO localStorage)
  const login = ({ user }) => {
    setUser(user);
  };

  // ✅ Logout (call backend)
  const logout = async () => {
    try {
      await fetch("https://api.rydevalues.cloud/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }

    setUser(null);
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

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
