"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type UserProfile = "admin" | "leo" | "alex" | "cindy";
export type ThemePreference = "light" | "dark" | "system";

interface UserContextType {
  activeUser: UserProfile;
  setActiveUser: (user: UserProfile) => void;
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  avatars: Record<UserProfile, string | null>;
  setAvatar: (user: UserProfile, base64Image: string) => void;
  points: Record<UserProfile, number>;
  addPoints: (user: UserProfile, amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [activeUser, setActiveUser] = useState<UserProfile>("admin");
  const [theme, setTheme] = useState<ThemePreference>("system");
  const [avatars, setAvatars] = useState<Record<UserProfile, string | null>>({
    admin: null,
    leo: null,
    alex: null,
    cindy: null,
  });
  const [points, setPoints] = useState<Record<UserProfile, number>>({
    admin: 0,
    leo: 0,
    alex: 0,
    cindy: 0,
  });
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("activeUser") as UserProfile;
    if (savedUser) setActiveUser(savedUser);

    const savedTheme = localStorage.getItem("themePreference") as ThemePreference;
    if (savedTheme) setTheme(savedTheme);

    const savedAvatars = localStorage.getItem("userAvatars");
    if (savedAvatars) {
      try {
        setAvatars(JSON.parse(savedAvatars));
      } catch (e) {
        console.error("Failed to parse avatars");
      }
    }

    const savedPoints = localStorage.getItem("userPoints");
    if (savedPoints) {
      try {
        setPoints(JSON.parse(savedPoints));
      } catch (e) {
        console.error("Failed to parse points");
      }
    }
    
    setMounted(true);
  }, []);

  // Save to localStorage when things change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("activeUser", activeUser);
      localStorage.setItem("themePreference", theme);
      localStorage.setItem("userAvatars", JSON.stringify(avatars));
      localStorage.setItem("userPoints", JSON.stringify(points));
    }
  }, [activeUser, theme, avatars, points, mounted]);

  // Apply theme to document element
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        root.setAttribute("data-theme", "dark");
      } else {
        root.removeAttribute("data-theme");
      }
      
      // Listen for system changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        if (theme === "system") {
          if (e.matches) root.setAttribute("data-theme", "dark");
          else root.removeAttribute("data-theme");
        }
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
      
    } else if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [theme, mounted]);

  const handleSetAvatar = (user: UserProfile, base64Image: string) => {
    setAvatars(prev => ({ ...prev, [user]: base64Image }));
  };

  const handleAddPoints = (user: UserProfile, amount: number) => {
    setPoints(prev => ({ ...prev, [user]: (prev[user] || 0) + amount }));
  };

  // Prevent hydration mismatch by hiding until mounted, but still provide context for SSR
  if (!mounted) {
    return (
      <UserContext.Provider value={{ activeUser, setActiveUser, theme, setTheme, avatars, setAvatar: handleSetAvatar, points, addPoints: handleAddPoints }}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider value={{ activeUser, setActiveUser, theme, setTheme, avatars, setAvatar: handleSetAvatar, points, addPoints: handleAddPoints }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserProvider");
  }
  return context;
}
