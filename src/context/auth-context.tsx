
import { createContext, useContext, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { useAuthState, UserProfile } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useLocation } from "react-router-dom";
import { isSessionExpired, getLastActivity, updateLastActivity } from "@/utils/securityUtils";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string, gender?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateDisclaimerAcceptance: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    profile,
    isLoading,
    setIsLoading,
    updateDisclaimerAcceptance
  } = useAuthState();
  
  const { login, register, logout } = useAuthActions(setIsLoading);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningShownRef = useRef(false);

  // Derive authentication state
  const isAuthenticated = !!user;

  // Session security monitoring (moved here to avoid circular dependency)
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSessionTimeout = () => {
      const lastActivity = getLastActivity();
      const isExpired = isSessionExpired(lastActivity, 30); // 30 minutes timeout
      const timeUntilExpiry = 30 * 60 * 1000 - (Date.now() - lastActivity);
      
      if (isExpired) {
        toast.error("Your session has expired due to inactivity. Please log in again.");
        logout();
        return;
      }

      // Show warning 5 minutes before expiry
      if (timeUntilExpiry <= 5 * 60 * 1000 && !warningShownRef.current) {
        warningShownRef.current = true;
        toast.warning("Your session will expire in 5 minutes due to inactivity.", {
          duration: 10000,
          action: {
            label: "Stay Active",
            onClick: () => {
              updateLastActivity();
              warningShownRef.current = false;
            }
          }
        });
      }

      // Reset warning if user becomes active again
      if (timeUntilExpiry > 5 * 60 * 1000) {
        warningShownRef.current = false;
      }
    };

    // Check every minute
    const interval = setInterval(checkSessionTimeout, 60 * 1000);

    // Initial check
    checkSessionTimeout();

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, logout]);

  // Update activity on user interaction
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      updateLastActivity();
      warningShownRef.current = false; // Reset warning when user is active
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [isAuthenticated]);
  
  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateDisclaimerAcceptance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
