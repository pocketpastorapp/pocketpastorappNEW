
import { createContext, useContext, useEffect, useState } from "react";
import { PreferencesService } from "@/services/preferencesService";
import { supabase } from "@/integrations/supabase/client";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // Initialize theme from localStorage immediately to prevent flash
  const [theme, setTheme] = useState<Theme>(() => {
    const localTheme = localStorage.getItem(storageKey) as Theme;
    return localTheme || defaultTheme;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsInitialized(true);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load theme preference on initialization
  useEffect(() => {
    if (!isInitialized) return;

    const loadTheme = async () => {
      if (isAuthenticated) {
        // Load from Supabase for authenticated users
        const savedTheme = await PreferencesService.loadThemePreference();
        if (savedTheme) {
          setTheme(savedTheme as Theme);
        } else {
          // Fallback to localStorage or default
          const localTheme = localStorage.getItem(storageKey) as Theme;
          setTheme(localTheme || defaultTheme);
        }
      } else {
        // Load from localStorage for unauthenticated users
        const localTheme = localStorage.getItem(storageKey) as Theme;
        setTheme(localTheme || defaultTheme);
      }
    };

    loadTheme();
  }, [isAuthenticated, isInitialized, storageKey, defaultTheme]);

  // Apply theme to DOM
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const handleSetTheme = async (newTheme: Theme) => {
    setTheme(newTheme);
    
    // Always save to localStorage as fallback
    localStorage.setItem(storageKey, newTheme);
    
    // Save to Supabase if authenticated
    if (isAuthenticated) {
      try {
        await PreferencesService.saveThemePreference(newTheme);
        console.log("Theme preference saved to Supabase");
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }
    }
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
