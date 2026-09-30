import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { getCurrentUser } from "../services/apiAuth";
import { buildApiUrl, API_PATHS } from "../config/api.js";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(user); // track user without re-triggering effects
  userRef.current = user;

  const logout = useCallback(async (showMessage = false) => {
    try {
      await fetch(buildApiUrl(`${API_PATHS.AUTH}/logout`), {
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
  }, []); // stable reference, won't re-trigger effects

  // Check auth on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getCurrentUser();
        const currentUser = data?.user;
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
  }, [logout]); // logout is stable, so this still runs once

  // Polling — only acts while logged in, at a sane interval
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!userRef.current) return;

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
        // Don't auto-logout on network errors / 429s — just log it
        console.error("Auth polling failed:", err);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [logout]); // logout is stable, so the interval never restarts

  const login = useCallback(({ user }) => {
    setUser(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
